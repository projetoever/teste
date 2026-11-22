"""GET LED CENAS: deterministic geometry-locked SC01 blind-motion demonstration.
Generates TWO coherent keyframes + test clip, not a photoreal GenAI approval asset.
No secrets, account access or external API.
"""
from pathlib import Path
import numpy as np, cv2, subprocess, math, json
from PIL import Image

ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/'assets/rooms/living-model/GLC_LIVING_BASE_001.png'
DEST=ROOT/'assets/rooms/living-model'
VD=ROOT/'assets/video'
DEST.mkdir(parents=True,exist_ok=True)
VD.mkdir(parents=True,exist_ok=True)
W,H=1280,720
im=Image.open(SOURCE).convert('RGB')
base=np.array(im.resize((W,H),Image.Resampling.LANCZOS))
# Artwork designed in normalized original-photo coordinates, rendered at 1280x720.
sx=W/1672;sy=H/941
q=lambda x,y:(int(x*sx),int(y*sy))
x1,y1=q(402,326);x2,y2=q(1054,650)
Y,X=np.mgrid[0:H,0:W]
# matte for roller fabric enclosed within the window frame, with wall/curtain protection
panelmask=np.zeros((H,W),np.float32)
for a,b in [(404,670),(675,868),(874,1018)]:
    left,_=q(a,0);right,_=q(b,0)
    panelmask[y1:y2,left:right]=1.0
# preserve foreground sofa, plants and furniture, in front of glass
foreground=np.zeros((H,W),np.uint8)
polys=[
    [(385,560),(430,551),(490,546),(550,541),(608,539),(665,533),(714,525),(758,521),(804,536),(835,550),(850,650),(350,660)],
]
for poly in polys:
    cv2.fillPoly(foreground,[np.array([q(*p) for p in poly],np.int32)],255)
fg=cv2.GaussianBlur(foreground,(0,0),1.2)/255.0
panelmask*=1-fg

# fixed-location linen weave, rollers and light shade.  Same surfaces remain in every frame.
rows=np.arange(H,dtype=np.float32)[:,None]
cols=np.arange(W,dtype=np.float32)[None,:]
colshade=0.96+0.036*np.sin(cols*.055)+0.018*np.cos(cols*.024)
rowshade=0.99+0.024*np.sin(rows*.075)
wave=(colshade*rowshade)[:,:,None]
cream=np.zeros_like(base,dtype=np.float32)+[198,192,179]
cream=np.clip(cream*wave,0,255)
# bring central panels into alignment: sheer taupe fabric, not stark solid grey
cloth=.97*cream+.03*base.astype(np.float32)

# lower edge and track mask in the same perspective frame
track=np.zeros((H,W,3),np.uint8)
cv2.line(track,q(400,323),q(1057,323),(38,42,46),3,lineType=cv2.LINE_AA)

def smooth(t):
    t=float(np.clip(t,0,1))
    return t*t*(3-2*t)

def frame(progress):
    p=smooth(progress)
    yy=y1+(y2-y1)*p
    # fade cloth behind balcony + upholstery; leaves room geometry fully locked
    cover=np.clip((yy-Y+1.5)/3.0,0,1).astype(np.float32)*panelmask
    # roller shade 94% opaque; cinematic but does not change foreground objects
    alpha=cover*.99
    lightdrop=.025*p
    dark=np.clip(base.astype(np.float32)*(1-lightdrop),0,255)
    out=(dark*(1-alpha[:,:,None])+cloth*alpha[:,:,None]).astype(np.uint8)
    # subtle bottom-weighted rail follows physically descending bottom edge
    if p>.002:
        row=int(round(yy))
        bottom=np.zeros((H,W,3),np.uint8)
        for xL,xR in [(404,670),(675,868),(874,1018)]:
            a,b=q(xL,0)[0],q(xR,0)[0]
            cv2.line(bottom,(a,row),(b,row),(84,79,70),2,lineType=cv2.LINE_AA)
        railmask=np.zeros((H,W),np.uint8)
        cv2.line(railmask,(q(405,0)[0],row),(q(1018,0)[0],row),255,2,lineType=cv2.LINE_AA)
        railmask=railmask.astype(np.float32)/255*(1-fg)
        out=(out*(1-railmask[:,:,None]) + bottom*railmask[:,:,None]).astype(np.uint8)
    # opaque upper casing never changes location
    out[:,:]=np.maximum(0,out)
    return out

Image.fromarray(frame(0)).save(DEST/'GLC_LIVING_BASE_001.png',optimize=True)
Image.fromarray(frame(1)).save(DEST/'GLC_LIVING_SC01_BLIND_CLOSED_001.png',optimize=True)
Image.fromarray(frame(.5)).save(DEST/'GLC_LIVING_MID_001.png',optimize=True)
# preproduce low-cost local reference. Deliberately no synthetic TV or lamps.
N=120;fps=24
command=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r',str(fps),'-i','-','-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',str(VD/'GLC_SC01_BLIND_TECHNICAL_V01.mp4')]
p=subprocess.Popen(command,stdin=subprocess.PIPE)
for i in range(N):
    # first/last 0.4s hold for clean before/after inspection
    t=(i/fps-.42)/(5-.84)
    im=frame(t)
    p.stdin.write(im.tobytes())
p.stdin.close();rc=p.wait()
if rc:raise RuntimeError(f'ffmpeg exit {rc}')
meta={'id':'GLC-SC01-BLIND-001','room':'living-model','scene':'SC01','equipment':'persiana','camera':'locked','duration_s':5,'fps':fps,'resolution':f'{W}x{H}','engine':'deterministic-2.5d-reference','review_status':'demonstrativo_nao_homologado','ai_generation':False,'input':'GLC_LIVING_BASE_001.png','end':'GLC_LIVING_SC01_BLIND_CLOSED_001.png','clip':'GLC_SC01_BLIND_TECHNICAL_V01.mp4','note':'Pilot video for infrastructure, baseline movement and PixVerse keyframe inputs; not an approved photoreal simulation.'}
(DEST/'manifest.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2))
print(json.dumps(meta,ensure_ascii=False))
