"""GET LED CENAS v1.2 — reproducible, geometry-locked technical effects.

Preserves source photo and camera exactly.  Only photometric adjustments and
carefully bounded object masks are modified. No premium/photoreal approval implied.
"""
from pathlib import Path
import argparse, math, subprocess, json
import numpy as np
import cv2
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parent
SRC=ROOT/'assets/rooms/living-model/GLC_LIVING_BASE_001.png'
OUT=ROOT/'assets/video/v12'
FRAMES=ROOT/'assets/rooms/living-model/v12'
OUT.mkdir(parents=True,exist_ok=True)
FRAMES.mkdir(parents=True,exist_ok=True)
W,H=1280,720
BASE=np.asarray(Image.open(SRC).convert('RGB'),np.float32)
Y,X=np.mgrid[0:H,0:W].astype(np.float32)

def clamp(x): return float(np.clip(x,0,1))
def ease(x):
    x=clamp(x)
    return x*x*(3-2*x)
def sequence(t,a,b):
    return ease((t-a)/(b-a))
def gaussian(x,y,sx,sy):
    return np.exp(-.5*(((X-x)/sx)**2+((Y-y)/sy)**2)).astype(np.float32)
def mask_poly(points,blur=1.1):
    m=np.zeros((H,W),np.uint8)
    cv2.fillPoly(m,[np.asarray(points,np.int32)],255)
    return cv2.GaussianBlur(m.astype(np.float32)/255,(0,0),blur)

def path_mask(path,width=2):
    img=np.zeros((H,W),np.uint8)
    for a,b in zip(path,path[1:]):
        cv2.line(img,tuple(a),tuple(b),255,width,cv2.LINE_AA)
    return img.astype(np.float32)/255

# Exact photo geometry from original perspective, including sofa foreground matte.
GLASS_PANELS=[(311,249,433,499),(440,249,671,499),(679,249,789,499)]
SOFA_OCCLUSION=[(294,432),(324,423),(369,417),(421,414),(467,413),(505,411),(554,405),(590,405),(613,408),(640,420),(653,447),(658,515),(270,521)]
MATTE=np.zeros((H,W),np.float32)
for l,t,r,b in GLASS_PANELS:
    MATTE[t:b,l:r]=1.
SOFA=mask_poly(SOFA_OCCLUSION,blur=1.6)
MATTE*=1-SOFA
MATTE=cv2.GaussianBlur(MATTE,(0,0),.6)

# Fixed fabric weave: low contrast linen with diffusion, not flat opaque grey.
weave=(
    1.8*np.sin(X*.61)+1.2*np.sin(Y*.84)+1.6*np.sin(X*.052)+
    .7*np.sin((X+Y)*.14)
).astype(np.float32)
cloth=(np.array([211,207,198],np.float32)[None,None,:] + weave[:,:,None]).astype(np.float32)
# A faint shadow cast by the window edges lives *inside* the moving fabric.
edge_x=np.minimum(np.abs(X-311),np.abs(X-789))
cloth-=gaussian(432,370,30,180)[:,:,None]*1.5
cloth=np.clip(cloth,0,255)

# Photo's fixed right and left wall sconces; preserve originals.
SCONCE_HALO=(gaussian(58,341,29,74)+gaussian(979,340,30,80)).astype(np.float32)
SCONCE_CORE=(gaussian(58,339,5,38)+gaussian(979,341,5,41)).astype(np.float32)
SCONCE_HALO=np.clip(SCONCE_HALO,0,1)
SCONCE_CORE=np.clip(SCONCE_CORE,0,1)

# Existing pendant heads are above the dinner table. No extra fixtures.
PENDANT_HALO=(gaussian(188,413,48,58)+gaussian(259,425,44,53)).astype(np.float32)
TABLE_LIGHT=gaussian(190,497,125,58).astype(np.float32)

# Perspective-correct LED lines: use the existing ceiling grooves.
LED_LINES=np.zeros((H,W),np.uint8)
for pts in [[(254,0),(480,240)],[(318,0),(542,252)],[(981,0),(791,239)],[(310,237),(807,237)]]:
    for a,b in zip(pts,pts[1:]):cv2.line(LED_LINES,a,b,255,2,cv2.LINE_AA)
led_line=LED_LINES.astype(np.float32)/255
led_bloom1=cv2.GaussianBlur(led_line,(0,0),6.5)
led_bloom2=cv2.GaussianBlur(led_line,(0,0),24.)
# Light response on ceiling surfaces, not a second fake fixture.
LED_CEILING=gaussian(520,174,310,148)

# Existing TV screen, polygon slightly inside the bezel, no duplicate rectangle.
TV=mask_poly([(1010,246),(1248,158),(1248,444),(1010,414)],blur=.55)
tv_pattern=(
    gaussian(1104,295,86,85)*.5+gaussian(1177,355,72,98)*.37+
    gaussian(1092,386,54,44)*.1
)
TV_CONTENT=np.zeros_like(BASE,dtype=np.float32)
TV_CONTENT[:]=[13.,20.,36.]
TV_CONTENT+=tv_pattern[:,:,None]*np.array([34.,101.,162.],np.float32)
TV_GLOW=gaussian(1110,335,195,176)*(1-TV)

# Cast daylight mostly across the near window, couch and rug, slight room exposure.
DAYLIGHT_REDUCTION=(.018 + gaussian(512,438,315,255)*.07).astype(np.float32)

def add_light(arr,mask,rgb,strength):
    if strength<=0:return arr
    # Screen blending: soft light addition without gray blotches on dark wood.
    lm=(mask*strength)[:,:,None]
    color=np.array(rgb,np.float32)[None,None,:]
    return np.clip(arr+(255-arr)*(color/255)*lm,0,255)

# Flexible single-render for each moment; illumination state scalar is independent.
def render(blind=0,sconce=0,led=0,pendant=0,tv=0,dim=0):
    blind=clamp(blind);sconce=clamp(sconce);led=clamp(led);pendant=clamp(pendant);tv=clamp(tv);dim=clamp(dim)
    arr=BASE.copy()
    if blind>1e-4:
        # Mild synchronized reduction of ambient light once outdoor light is blocked.
        arr*=1-(DAYLIGHT_REDUCTION*blind)[:,:,None]
        # Rolling fabric top edge progresses down; window rails and upholstery remain intact.
        bottom=249+(499-249)*blind
        y_alpha=np.clip((bottom-Y+1.5)/3.,0,1)
        window_alpha=(y_alpha*MATTE*.93).astype(np.float32)
        arr=arr*(1-window_alpha[:,:,None])+cloth*window_alpha[:,:,None]
        # Weight bar follows the roller physically; never crosses occluded objects.
        rail=np.zeros((H,W),np.uint8)
        py=int(bottom)
        if py<499:
            for left,top,right,end in GLASS_PANELS:
                cv2.line(rail,(left,py),(right-1,py),255,3,cv2.LINE_AA)
            rail=(rail.astype(np.float32)/255)*(1-SOFA)
            arr=arr*(1-rail[:,:,None]*.75)+np.array([83,79,72],np.float32)*rail[:,:,None]*.75
    # The source shot was lit; first subtract the existing local spill, then reveal it progressively.
    if sconce<1:
        off=(1-sconce)
        dim_mask=(SCONCE_HALO*.24+SCONCE_CORE*.12)*off
        arr*=1-dim_mask[:,:,None]
    if sconce>0:
        arr=add_light(arr,SCONCE_HALO,[255,211,143],.16*sconce)
        arr=add_light(arr,SCONCE_CORE,[255,232,194],.22*sconce)
    if pendant<1:
        arr*=1-(PENDANT_HALO*.17+TABLE_LIGHT*.12)[:,:,None]*(1-pendant)
    if pendant>0:
        arr=add_light(arr,PENDANT_HALO,[255,225,178],.15*pendant)
        arr=add_light(arr,TABLE_LIGHT,[249,210,149],.13*pendant)
    if led>0:
        arr=add_light(arr,led_bloom2,[249,195,112],(.55*led))
        arr=add_light(arr,led_bloom1,[255,234,194],(.86*led))
        arr=add_light(arr,led_line,[255,248,223],(.95*led))
        arr=add_light(arr,LED_CEILING,[255,225,169],.034*led)
    if tv>0:
        tv_alpha=TV*.92*tv
        arr=arr*(1-tv_alpha[:,:,None])+TV_CONTENT*tv_alpha[:,:,None]
        arr=add_light(arr,TV_GLOW,[59,130,220],.032*tv)
    if dim>0:
        # Ambient fall-off during the cinema scene; protect key physical emissive fixtures.
        darkness=dim*(.10+gaussian(560,420,360,320)*.09)
        arr*=1-darkness[:,:,None]
    return np.clip(arr,0,255).astype(np.uint8)

# All transitions include exact fixed-camera full-resolution frames and separate intermediate states.
def state_for(kind,t):
    if kind=='blind':return dict(blind=ease(t),sconce=1,pendant=1)
    if kind=='sconces':return dict(sconce=ease(t),pendant=1)
    if kind=='pendants':return dict(pendant=ease(t),sconce=1)
    if kind=='led':return dict(led=ease(t),sconce=1,pendant=1)
    if kind=='tv':return dict(tv=ease(t),sconce=1,pendant=1)
    if kind=='cinema':return dict(blind=sequence(t,0,.42),sconce=1-sequence(t,.38,.7)*.78,pendant=1-sequence(t,.38,.75)*.9,led=sequence(t,.48,.82)*.8,tv=sequence(t,.63,.92),dim=sequence(t,.36,.90)*.72)
    raise ValueError(kind)

PRESETS={
 'blind':('GLC_SC01_PERSIANA_V02',5.),
 'sconces':('GLC_SC02_ARANDELAS_V01',3.),
 'pendants':('GLC_SC03_LUSTRES_V01',3.),
 'led':('GLC_SC04_PERFIS_LED_V01',3.5),
 'tv':('GLC_SC05_TV_V01',3.),
 'cinema':('GLC_SC06_CINEMA_COMPOSTO_V01',7.),
}

def export_frame(kind,t,tag):
    filename=FRAMES/f'{PRESETS[kind][0]}_{tag}.webp'
    Image.fromarray(render(**state_for(kind,t))).save(filename,format='WEBP',quality=89,method=5)
    return str(filename.relative_to(ROOT))

def render_clip(kind,fps=20):
    stem,duration=PRESETS[kind]
    output=OUT/f'{stem}.mp4'
    cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-video_size',f'{W}x{H}',
        '-framerate',str(fps),'-i','-','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(output)]
    pipe=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        n=round(duration*fps)
        for index in range(n):
            t=clamp(((index/fps)-.3)/(duration-.6))
            img=render(**state_for(kind,t))
            pipe.stdin.write(img.tobytes())
        pipe.stdin.close()
        rc=pipe.wait()
        if rc:raise RuntimeError(f'encoder exited {rc}')
    except Exception:
        pipe.kill()
        raise
    print(f'{kind}: {output.stat().st_size/1024**2:.2f}MB',flush=True)
    return str(output.relative_to(ROOT))

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--frames-only',action='store_true');parser.add_argument('--presets',nargs='+',default=list(PRESETS))
    args=parser.parse_args()
    records={}
    for kind in args.presets:
        if kind not in PRESETS:raise SystemExit(f'Unknown preset {kind}')
        before=export_frame(kind,0,'BEFORE')
        middle=export_frame(kind,.5,'MID')
        after=export_frame(kind,1,'AFTER')
        clip=None if args.frames_only else render_clip(kind)
        records[kind]={'id':PRESETS[kind][0], 'duration':PRESETS[kind][1],'before':before,'middle':middle,'after':after,'mp4':clip,'status':'piloto_tecnico_nao_homologado'}
    with (ROOT/'assets/rooms/living-model/v12/manifest.json').open('w') as f:json.dump({'schema':2,'version':'1.2','source':str(SRC.relative_to(ROOT)),'resolution':[W,H],'engine':'geometry-locked-deterministic-video','approved':False,'presets':records},f,ensure_ascii=False,indent=2)
    print(json.dumps(records,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
