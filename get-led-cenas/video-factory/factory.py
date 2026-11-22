#!/usr/bin/env python3
"""GET LED CENAS — reliable batch workflow. Default: dry-run. No credentials stored.

Install: pip install fal-client pillow
Environment: FAL_KEY in process environment (never in source / CLI argument).
Billable requests require explicit `generate --execute`.
Generated outputs require explicit review before catalog publication.
"""
import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
JOBS = ROOT / 'jobs.json'
OUTPUT = ROOT / 'output'
PROJECT_MEDIA = ROOT / 'output' / 'catalog_manifest.preview.json'


def now():
    return datetime.now(timezone.utc).isoformat()


def load_config():
    cfg = json.loads(JOBS.read_text(encoding='utf-8'))
    for job in cfg['jobs']:
        path = (ROOT / job['input']).resolve()
        if not path.is_relative_to(ROOT / 'inputs'):
            raise ValueError('Input path is outside of factory inputs')
        if not path.is_file():
            raise FileNotFoundError(str(path))
        if len(job['prompt'].encode('utf-8')) > 2048 or len(job['negative_prompt'].encode('utf-8')) > 2048:
            raise ValueError(f"Prompt exceeds model limit in {job['id']}")
        if not (1 <= int(job['duration']) <= 15):
            raise ValueError('Invalid duration')
        if job['resolution'] not in {'360p','540p','720p','1080p'}:
            raise ValueError('Unsupported resolution')
    return cfg


def get_jobs(cfg, ids):
    candidates = cfg['jobs']
    if ids:
        selected = [j for j in candidates if j['id'] in ids]
        if len(selected) != len(set(ids)):
            raise ValueError('Unknown job ID provided')
        return selected
    return candidates


def load_record(job_id):
    path = OUTPUT / job_id / 'record.json'
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}


def write_record(job_id, record):
    target = OUTPUT / job_id
    target.mkdir(parents=True, exist_ok=True)
    (target / 'record.json').write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding='utf-8')


def plan(cfg, jobs):
    result = []
    for j in jobs:
        inp = ROOT/j['input']
        row = {'job_id':j['id'],'scene':j['scene_id'],'input':j['input'],
               'image_sha256':hashlib.sha256(inp.read_bytes()).hexdigest()[:14],
               'model':cfg['model'],'resolution':j['resolution'],'duration_s':j['duration'],
               'prompt_length':len(j['prompt'].encode('utf-8')),
               'record_status':load_record(j['id']).get('status','not_generated')}
        result.append(row)
    return result


def download_https(url, path, max_bytes=150_000_000):
    u = urlparse(url)
    if u.scheme != 'https' or not u.netloc:
        raise ValueError('Rejecting non-HTTPS media URL')
    req = urllib.request.Request(url, headers={'User-Agent':'GetLedCenasVideoFactory/1.0'})
    with urllib.request.urlopen(req, timeout=50) as response:
        if response.status != 200:
            raise RuntimeError(f'Bad HTTP status: {response.status}')
        n=0
        tmp = path.with_suffix(path.suffix+'.download')
        try:
            with tmp.open('wb') as out:
                while True:
                    data = response.read(512*1024)
                    if not data: break
                    n += len(data)
                    if n > max_bytes: raise ValueError('Video too large; rejected')
                    out.write(data)
            tmp.replace(path)
        finally:
            if tmp.exists(): tmp.unlink()


def probe(media):
    if not shutil.which('ffprobe'):
        raise RuntimeError('ffprobe is required to validate output')
    p = subprocess.run(['ffprobe','-v','error','-show_entries','format=duration,size:stream=index,codec_name,codec_type,width,height,r_frame_rate',
                        '-of','json',str(media)],capture_output=True,text=True,check=True)
    data = json.loads(p.stdout)
    if not any(s.get('codec_type')=='video' for s in data.get('streams',[])):
        raise ValueError('No video track found')
    return data


def generate(cfg,jobs,execute,max_jobs):
    if len(jobs)>max_jobs:
        raise ValueError(f'Batch has {len(jobs)} jobs, above cap {max_jobs}; pass --ids to select')
    if not execute:
        print(json.dumps({'mode':'DRY_RUN','billable_requests':0,'jobs':plan(cfg,jobs)},ensure_ascii=False,indent=2))
        return
    if not os.environ.get('FAL_KEY'):
        raise RuntimeError('FAL_KEY absent. Configure securely as an environment variable. Never paste keys in chat.')
    try: import fal_client
    except ImportError as ex: raise RuntimeError('Install SDK: pip install fal-client') from ex
    for j in jobs:
        rec=load_record(j['id'])
        if rec.get('status') in ['generated_pending_review','approved']:
            print(j['id']+' skipped: output already exists');continue
        print('Generating',j['id'],file=sys.stderr)
        image_url = fal_client.upload_file(str(ROOT/j['input']))
        args = {'prompt':j['prompt'],'negative_prompt':j['negative_prompt'],
                'image_url':image_url,'duration':int(j['duration']),
                'resolution':j['resolution'],'generate_audio_switch':False,
                'generate_multi_clip_switch':False}
        raw = fal_client.subscribe(cfg['model'],arguments=args)
        result = raw.get('data',raw) if isinstance(raw,dict) else raw
        if not isinstance(result,dict) or not result.get('video',{}).get('url'):
            raise RuntimeError('Provider did not return expected video URL')
        dest=OUTPUT/j['id'];dest.mkdir(parents=True,exist_ok=True)
        path=dest/'generated.mp4'
        download_https(result['video']['url'],path)
        meta=probe(path)
        if float(meta['format']['duration'])>30:raise ValueError('Unexpected clip length')
        write_record(j['id'],{'job_id':j['id'],'scene_id':j['scene_id'],'status':'generated_pending_review',
            'model':cfg['model'],'source':j['input'],'created_at':now(),
            'prompt_sha256':hashlib.sha256(j['prompt'].encode()).hexdigest(),
            'provider_request_id':raw.get('requestId') if isinstance(raw,dict) else None,
            'local_file':'generated.mp4','probe':meta,'approved_by':None})
        print('Pending visual review:',path)


def contact_sheet(job_id):
    rec=load_record(job_id)
    if rec.get('status') not in ('generated_pending_review','approved'):
        raise ValueError('Job has no generated output')
    from PIL import Image,ImageDraw,ImageOps
    media=OUTPUT/job_id/'generated.mp4'
    m=probe(media)
    dur=float(m['format']['duration'])
    n=6
    thumbsize=(480,270)
    sheet=Image.new('RGB',(thumbsize[0]*3, (thumbsize[1]+28)*2), '#0b1217')
    draw=ImageDraw.Draw(sheet)
    for i in range(n):
        t=max(0,dur*(i+.2)/(n+.3))
        p=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-ss',str(t),'-i',str(media),'-frames:v','1','-f','image2pipe','-vcodec','png','-'],stdout=subprocess.PIPE,check=True)
        import io
        im=ImageOps.fit(Image.open(io.BytesIO(p.stdout)).convert('RGB'),thumbsize)
        x=i%3*thumbsize[0];y=i//3*(thumbsize[1]+28)
        sheet.paste(im,(x,y));draw.text((x+12,y+thumbsize[1]+6),f'{t:.2f}s',fill='#dbf7fa')
    name=OUTPUT/job_id/'contact_sheet.jpg';sheet.save(name,quality=87,optimize=True)
    print(name)
    return name


def approve(job_id, reviewer, note):
    rec=load_record(job_id)
    if rec.get('status') not in ('generated_pending_review','approved'):
        raise ValueError('Generate a candidate first')
    if not reviewer.strip() or len(note.strip())<12:
        raise ValueError('Reviewer and 12+ character quality review note are mandatory')
    rec.update({'status':'approved','approved_by':reviewer,'approval_note':note,'approved_at':now()})
    write_record(job_id,rec)
    print('Approved candidate:',job_id,'(not yet released to the website)')


def prepare_catalog(cfg,scene_id,job_id):
    candidates={j['id']:j for j in cfg['jobs']}
    if job_id not in candidates or candidates[job_id]['scene_id']!=scene_id:
        raise ValueError('Job does not belong to scene')
    rec=load_record(job_id)
    if rec.get('status')!='approved': raise ValueError('Candidate has not been approved')
    source=OUTPUT/job_id/'generated.mp4'
    probe(source)
    catalog_root=ROOT/'output'/'ready_for_review'
    video_dir=catalog_root/'assets'/'video'
    video_dir.mkdir(parents=True,exist_ok=True)
    target=video_dir/(scene_id.lower()+'-pilot.mp4')
    subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-an',
                    '-c:v','libx264','-crf','23','-preset','medium','-pix_fmt','yuv420p',
                    '-movflags','+faststart','-vf','scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2',str(target)],check=True)
    media=json.loads((ROOT/'catalog_media.base.json').read_text(encoding='utf-8'))
    media['scenes'].setdefault(scene_id,{})
    media['scenes'][scene_id].update({'mp4':'assets/video/'+target.name,'status':'aprovado',
        'poster':'assets/'+('sala-premium.webp' if scene_id!='SC03' else 'jantar-premium.webp')})
    (catalog_root/'assets'/'scene-media.json').write_text(json.dumps(media,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Staged only (not auto-published):',target)
    print('Manifest:',catalog_root/'assets'/'scene-media.json')


def main():
    p=argparse.ArgumentParser(description='GET LED CENAS Video Factory')
    sub=p.add_subparsers(dest='cmd',required=True)
    sub.add_parser('plan')
    gen=sub.add_parser('generate');gen.add_argument('--ids',nargs='+');gen.add_argument('--execute',action='store_true');gen.add_argument('--max-jobs',type=int,default=2)
    sheet=sub.add_parser('contact-sheet');sheet.add_argument('job_id')
    app=sub.add_parser('approve');app.add_argument('job_id');app.add_argument('--reviewer',required=True);app.add_argument('--note',required=True)
    stage=sub.add_parser('stage');stage.add_argument('scene_id');stage.add_argument('job_id')
    args=p.parse_args();cfg=load_config()
    if args.cmd=='plan':print(json.dumps(plan(cfg,cfg['jobs']),ensure_ascii=False,indent=2))
    elif args.cmd=='generate':generate(cfg,get_jobs(cfg,args.ids),args.execute,args.max_jobs)
    elif args.cmd=='contact-sheet':contact_sheet(args.job_id)
    elif args.cmd=='approve':approve(args.job_id,args.reviewer,args.note)
    elif args.cmd=='stage':prepare_catalog(cfg,args.scene_id,args.job_id)

if __name__=='__main__':
    try:main()
    except Exception as e:
        print(f'ERROR: {e}',file=sys.stderr);sys.exit(1)
