"""GET LED CENAS v1.5 — locked-camera, source-pixel-anchored transitions.

Deliberately conservative: fix blind occlusion, preserve window mullions, and
turn on ONLY actual photographed LED highlights. Never draw new ceiling strips.
Technical previsualization, NOT photoreal/installation-approved.
"""
from pathlib import Path
import argparse, json, subprocess
import numpy as np
import cv2
from PIL import Image

ROOT=Path(__file__).resolve().parent
SRC=ROOT/'assets/rooms/living-model/GLC_LIVING_BASE_001.webp'
FRAMES=ROOT/'assets/rooms/living-model/v15'
OUT=ROOT/'assets/video/v15'
FRAMES.mkdir(parents=True,exist_ok=True)
OUT.mkdir(parents=True,exist_ok=True)
W,H=1280,720
BASE=np.asarray(Image.open(SRC).convert('RGB'),dtype=np.float32)
if BASE.shape != (H,W,3): raise ValueError(f'Sala-mestre inesperada: {BASE.shape}')
Y,X=np.mgrid[0:H,0:W].astype(np.float32)

def clamp(v): return float(np.clip(v,0,1))
def ease(v):
    v=clamp(v)
    return v*v*(3-2*v)
def seq(t,a,b): return ease((t-a)/(b-a))
def gauss(x,y,sx,sy): return np.exp(-.5*((X-x)**2/sx**2+(Y-y)**2/sy**2))
def poly(pts,blur=0.0):
    m=np.zeros((H,W),np.uint8)
    cv2.fillPoly(m,[np.array(pts,np.int32)],255)
    if blur: return cv2.GaussianBlur(m.astype('float32')/255,(0,0),blur)
    return m.astype('float32')/255

# Three independent fabric panels: 2 px inside the photographed metal mullions.
GLASS=[(314,250,430,502),(443,250,668,502),(682,250,785,502)]
# Geometric foreground edge was 12-17 px too high in v1.4, hiding the view
# in a band above the sofa. Trace the visible backrest instead.
SOFA_EDGE=[(290,451),(310,440),(335,435),(366,438),(392,432),
           (422,431),(456,431),(486,430),(521,427),(550,421),
           (581,424),(611,427),(640,443),(656,472),(662,520),(267,526)]
foreground=poly(SOFA_EDGE,blur=.9)
PANE=np.zeros((H,W),np.float32)
for left,top,right,bottom in GLASS:
    PANE[top:bottom,left:right]=1.
VISIBLE=PANE*(1-foreground)

# View-aware flax-colored translucent linen, not three solid white cards.
# Source exterior detail remains softly visible through the weave.
neutral=np.array([188.,181.,169.],np.float32)[None,None,:]
weave=(1.45*np.sin(X*.045)+.55*np.sin(X*.28)+.38*np.sin(Y*.22))
FABRIC=np.clip(.24*BASE+.76*neutral+weave[:,:,None],0,255).astype('float32')
# Fixed top-to-bottom linen gradient avoids uniform rectangular appearance.
FABRIC=np.clip(FABRIC*(.995+(Y-250)*.000075)[:,:,None],0,255)
AMBIENT=(.011+gauss(530,402,330,250)*.054).astype('float32')

# LED: detect photographic highlight pixels INSIDE existing ceiling grooves.
# This intentionally NEVER draws a new line and excludes the horizontal headbox.
gray=cv2.cvtColor(BASE.astype('uint8'),cv2.COLOR_RGB2GRAY).astype('float32')
lowpass=cv2.GaussianBlur(gray,(0,0),5.0)
photographed=np.clip((gray-lowpass-4.)/19.,0,1)
corridor=np.zeros((H,W),np.float32)
for ax,ay,bx,by in [(246,0,485,238),(313,0,546,238),(974,0,793,235)]:
    # Wide detection corridor, not a rendering guide: only actual bright
    # pixels inside each corridor are eligible to be illuminated.
    vx,vy=bx-ax,by-ay
    u=np.clip(((X-ax)*vx+(Y-ay)*vy)/(vx*vx+vy*vy),0,1)
    dist=np.sqrt((X-(ax+vx*u))**2+(Y-(ay+vy*u))**2)
    corridor=np.maximum(corridor,(dist<11.).astype('float32'))
corridor*=np.clip((245-Y)/6.,0,1)
LED_PIXEL=(corridor*photographed).astype('float32')
LED_BOUNCE=cv2.GaussianBlur(LED_PIXEL,(0,0),5.0)*corridor
assert np.count_nonzero(LED_PIXEL[Y>=250])==0

# Existing TV screen only. Keep the original bezel and its perspective.
TV=poly([(1014,250),(1243,166),(1243,438),(1014,409)],blur=.5)
pattern=gauss(1103,307,90,88)*.42+gauss(1178,352,72,92)*.36
TV_CONTENT=np.broadcast_to(np.array([15.,23.,37.],np.float32),(H,W,3)).copy()
TV_CONTENT+=pattern[:,:,None]*np.array([28.,74.,118.],np.float32)
TV_SPILL=gauss(1114,370,94,83)*(1-TV)

SCONCES=np.clip(gauss(58,341,30,74)+gauss(977,339,30,77),0,1)
PENDANTS=np.clip(gauss(187,410,49,58)+gauss(256,425,49,53),0,1)

def render(blind=0,led=0,tv=0,lights_off=0,cinema_dark=0):
    blind,led,tv,lights_off,cinema_dark=[clamp(v) for v in
        (blind,led,tv,lights_off,cinema_dark)]
    arr=BASE.copy()
    # Photograph itself already shows warm artificial lights ON. Only local
    # emitters are attenuated in this illustrative ON/OFF transition.
    if lights_off:
        off=.17*SCONCES+.18*PENDANTS+.075*gauss(199,493,150,89)
        arr*=1-(lights_off*off)[:,:,None]
    if blind:
        # Fixed cassette, one roller each pane, synchronized vertical motion.
        bottom=250+(502-250)*blind
        reached=np.clip((bottom-Y+1.3)/2.3,0,1)
        mask=(reached*VISIBLE*.82).astype('float32')
        arr*=1-(AMBIENT*blind)[:,:,None]
        arr=arr*(1-mask[:,:,None])+FABRIC*mask[:,:,None]
        # Tiny hem bar, pane-clipped and foreground-occluded.
        # At full close it rests at the lower stop; never vanishes before end.
        rail_alpha=np.exp(-.5*((Y-(bottom-1.4))/1.15)**2)*VISIBLE
        rail_alpha*=.65 if 0.004<blind else 0.
        rail_rgb=np.array([116.,108.,96.],np.float32)
        arr=arr*(1-rail_alpha[:,:,None])+rail_rgb*rail_alpha[:,:,None]
    # Source-guided LED: make existing bright pixels OFF→ON, without creating
    # lines across the gypsum, pendant stems, headbox or window.
    # OFF suppresses photographed emission, ON restores and warms it slightly.
    arr+=((-18.+31.*led)*LED_PIXEL)[:,:,None]
    arr+=((led*.065)*LED_BOUNCE)[:,:,None]*np.array([90.,62.,35.],np.float32)
    if tv:
        a=TV*(.96*tv)
        arr=arr*(1-a[:,:,None])+TV_CONTENT*a[:,:,None]
        arr+=TV_SPILL[:,:,None]*tv*np.array([.18,.44,.91],np.float32)
    if cinema_dark:
        # Cinematic exposure response, not fictitious Zigbee dimming.
        exposure=1-cinema_dark*(.095+gauss(620,440,430,320)*.07)
        arr*=exposure[:,:,None]
    return np.clip(arr,0,255).astype('uint8')

def state(kind,t):
    t=clamp(t)
    if kind=='blind': return dict(blind=ease(t),led=0)
    if kind=='led': return dict(led=ease(t))
    if kind=='tv': return dict(tv=ease(t),led=0)
    if kind=='cinema':
        # 0–1.8s: roller; 1.8–2.5s: general lights switch OFF;
        # 2.5–3.2s: LED; 3.2–4.0s: TV; 4.0–5.0s: stable final.
        return dict(blind=seq(t,0,.36),lights_off=seq(t,.36,.50),
                    led=seq(t,.50,.64),tv=seq(t,.64,.80),
                    cinema_dark=seq(t,.36,.52)*.62)
    raise ValueError(kind)

PRESETS={'blind':('GLC_ME01_PERSIANA_V15',5.),
         'led':('GLC_ME04_PERFIS_LED_V15',3.5),
         'tv':('GLC_ME06_TV_V15',3.),
         'cinema':('GLC_SC01_CINEMA_V15',5.)}

def save_frame(kind,t,label):
    file=FRAMES/f'{PRESETS[kind][0]}_{label}.webp'
    Image.fromarray(render(**state(kind,t))).save(file,format='WEBP',quality=92,method=5)
    return str(file.relative_to(ROOT))
def clip(kind,fps=24):
    stem,duration=PRESETS[kind]
    path=OUT/f'{stem}.mp4'
    cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24',
         '-video_size',f'{W}x{H}','-framerate',str(fps),'-i','-',
         '-c:v','libx264','-crf','21','-preset','veryfast','-pix_fmt','yuv420p',
         '-movflags','+faststart',str(path)]
    process=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for i in range(round(duration*fps)):
            # Hold the true last state for the final frame.
            t=min(1.,i/max(1,round(duration*fps)-1))
            process.stdin.write(render(**state(kind,t)).tobytes())
        process.stdin.close()
        rc=process.wait()
        if rc!=0:raise RuntimeError(f'ffmpeg failed: {rc}')
    except Exception:
        process.kill()
        raise
    return str(path.relative_to(ROOT))
def main():
    p=argparse.ArgumentParser()
    p.add_argument('--presets',nargs='+',default=list(PRESETS))
    a=p.parse_args()
    output={}
    for kind in a.presets:
        before=save_frame(kind,0,'BEFORE')
        middle=save_frame(kind,.5,'MID')
        after=save_frame(kind,1,'AFTER')
        file=clip(kind)
        output[kind]={'id':PRESETS[kind][0],'duration':PRESETS[kind][1],
                     'before':before,'middle':middle,'after':after,'mp4':file,
                     'status':'piloto_tecnico_nao_homologado'}
        print(f'{kind}: rendered {file}',flush=True)
    (FRAMES/'manifest.json').write_text(json.dumps(
        {'schema':3,'version':'1.5','source':str(SRC.relative_to(ROOT)),
         'resolution':[W,H],'engine':'source-pixel-anchored-deterministic-v15',
         'approved':False,'presets':output},indent=2,ensure_ascii=False))
if __name__=='__main__':main()
