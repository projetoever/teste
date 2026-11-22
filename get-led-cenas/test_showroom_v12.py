"""GET LED CENAS v1.2 Browser QA, offline about:blank with inline assets.
Video playback uses the real SC01 MP4; all other MP4s are probed separately.
"""
from pathlib import Path
import json,base64,re,subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
html=(ROOT/'showroom.html').read_text(encoding='utf-8')
css=re.sub(r'@import url\([^;]+;','',(ROOT/'showroom-v12.css').read_text(encoding='utf-8'))
js=(ROOT/'showroom-v12.js').read_text(encoding='utf-8')

def data(path,mime):return 'data:'+mime+';base64,'+base64.b64encode((ROOT/path).read_bytes()).decode('ascii')
poster=data('assets/rooms/living-model/GLC_LIVING_BASE_001.webp','image/webp')
mp4=data('assets/video/v12/GLC_SC01_PERSIANA_V02.mp4','video/mp4')
html=html.replace('<link rel="stylesheet" href="showroom-v12.css">','<style>'+css+'</style>').replace('<script src="showroom-v12.js" defer></script>','')
html=html.replace('assets/rooms/living-model/GLC_LIVING_BASE_001.webp',poster)
js=js.replace("const frame = (p,state='BEFORE') => `${base}${p.id}_${state}.webp`;","const frame = (p,state='BEFORE') => window.QA_POSTER;")
js=js.replace("video.src=mp4+p.id+'.mp4';","video.src=window.QA_VIDEO;")
report={'version':'1.2','method':'Chromium offline test with real video and inlined assets','tests':[],'assets':[]}
for f in sorted((ROOT/'assets/video/v12').glob('*.mp4')):
    command=['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,codec_name','-show_entries','format=duration','-of','json',str(f)]
    result=json.loads(subprocess.check_output(command))
    assert result['streams'][0]['width']==1280
    assert result['streams'][0]['height']==720
    assert result['streams'][0]['codec_name']=='h264'
    report['assets'].append({'file':f.name,'duration':float(result['format']['duration']),'resolution':'1280x720','codec':'h264','bytes':f.stat().st_size})
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--autoplay-policy=no-user-gesture-required'])
    for name,w,h,mobile in [('mobile',390,844,True),('landscape',844,390,True),('desktop',1440,900,False)]:
        ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile)
        page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto('about:blank')
        page.set_content(html,wait_until='domcontentloaded')
        page.evaluate('(payload)=>{window.QA_POSTER=payload.poster;window.QA_VIDEO=payload.video;}',{'poster':poster,'video':mp4})
        page.add_script_tag(content=js)
        assert page.locator('.scene-item').count()==6
        page.locator('#mainPlay').click()
        page.wait_for_timeout(600)
        elapsed=page.locator('#experienceVideo').evaluate('(v)=>v.currentTime')
        assert elapsed>.08,(name,elapsed)
        # Switch via arrow and verify scene title changes; the QA clip is reused for UI test only.
        page.locator('#nextScene').click()
        assert 'Arandelas' in page.locator('#sceneTitle').inner_text()
        page.locator('#showAfter').click()
        horizontal=page.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1')
        assert not horizontal,(name,'horizontal overflow')
        assert not errors,(name,errors)
        page.screenshot(path=str(ROOT/f'preview_v12_{name}.png'),full_page=False)
        report['tests'].append({'viewport':name,'size':[w,h],'played_seconds':round(elapsed,2),'scene_switch':'PASS','horizontal_overflow':False,'pageerrors':errors,'result':'PASS'})
        ctx.close()
    browser.close()
(ROOT/'QA_v12.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(report,indent=2,ensure_ascii=False))
