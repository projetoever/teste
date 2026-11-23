(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const video = $('experienceVideo');
  const screen = $('screen');
  const list = $('sceneList');
  const presets = [
    {key:'blind',name:'Persiana v2',desc:'Tecido desce dentro dos caixilhos; luz natural é reduzida, mantendo o sofá intacto.',id:'GLC_SC01_PERSIANA_V02',time:5},
    {key:'sconces',name:'Arandelas v1',desc:'A luz quente retorna às duas arandelas existentes, com distribuição suave nas paredes.',id:'GLC_SC02_ARANDELAS_V01',time:3},
    {key:'pendants',name:'Lustres v1',desc:'Os dois pendentes existentes sobre a mesa e os reflexos de apoio entram progressivamente.',id:'GLC_SC03_LUSTRES_V01',time:3},
    {key:'led',name:'Perfis LED v1',desc:'As linhas acompanham os rasgos reais do teto e iluminam as superfícies próximas.',id:'GLC_SC04_PERFIS_LED_V01',time:3.5},
    {key:'tv',name:'TV ligando v1',desc:'O brilho é aplicado dentro da tela original, sem duplicar a televisão nem deslocar o painel.',id:'GLC_SC05_TV_V01',time:3},
    {key:'cinema',name:'Cinema em Casa v1',desc:'Persiana, luzes, perfis e televisão entram em sequência; composição ainda técnica.',id:'GLC_SC06_CINEMA_COMPOSTO_V01',time:7}
  ];
  // A visualização de quadros usa os arquivos já existentes da mesma câmera.
  const still = document.createElement('img');
  still.id = 'sceneStill'; still.alt = 'Estado visual da transição';
  still.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#060e11;z-index:1;display:none;pointer-events:none';
  video.insertAdjacentElement('afterend', still);
  const style = document.createElement('style');
  style.textContent = '#sceneStill{transition:none} .frame-active #sceneStill{display:block!important} .screen.frame-active video{visibility:hidden} .frame-active .center-controls{z-index:3} .frame-active .screen-top,.frame-active .bottom-ui{z-index:3}.frame-state{display:inline-block;font-size:10px;padding:5px 9px;border-radius:999px;background:#173943;color:#bdfcf4;border:1px solid #437980;margin:8px 0 0}.scene-item.active{outline:2px solid #68e9e1;outline-offset:-2px}';document.head.append(style);
  const stage = document.createElement('span');stage.className='frame-state';stage.id='frameState';stage.setAttribute('aria-live','polite');
  $('sceneDetails').insertAdjacentElement('afterend',stage);
  const labelState = (name) => { stage.textContent=name; };
  const frameMode = (state) => {
    video.pause(); setPlayingUI(false);
    const p=presets[current]; still.src=frame(p,state);
    still.alt=state==='BEFORE'?'Antes: estado inicial do dispositivo':'Depois: estado final ilustrativo do dispositivo';
    screen.classList.add('frame-active');labelState(state==='BEFORE'?'QUADRO INICIAL • mesmo ambiente':'QUADRO FINAL • prévia técnica não homologada');
    $('timeline').value=state==='BEFORE'?'0':'1000';
    reveal();
  };
  let current = 0;
  let chromeTimer = 0;
  let touchStart = null;
  // Resolve media by version; prior releases stay available and are never overwritten.
  const frame = (p,state='BEFORE') => `assets/rooms/living-model/${p.version||'v12'}/${p.id}_${state}.webp`;
  const movie = (p) => `assets/video/${p.version||'v12'}/${p.id}.mp4`;
  const time = (v) => { const n = Math.max(0, Math.floor(Number(v)||0)); return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`; };
  const setPlayingUI = (playing) => { $('mainPlay').textContent = playing?'Ⅱ':'▶'; $('playSmall').textContent = playing?'Ⅱ':'▶'; };
  const reveal = () => {
    screen.classList.remove('hide-chrome');
    clearTimeout(chromeTimer);
    if(!video.paused && !video.ended) chromeTimer=setTimeout(()=>screen.classList.add('hide-chrome'),2600);
  };
  const play = () => {
    screen.classList.remove('frame-active');labelState('VÍDEO TÉCNICO • demonstração não homologada');
    if(video.paused){if(video.ended || (video.duration && video.currentTime >= video.duration-.05))video.currentTime=0;video.play().catch(()=>reveal());}
    else video.pause();
    reveal();
  };
  const renderList = () => {
    list.innerHTML='';
    presets.forEach((p,i)=>{
      const button=document.createElement('button');
      button.type='button';button.className='scene-item'+(i===current?' active':'');
      button.setAttribute('aria-pressed',i===current?'true':'false');
      const img=document.createElement('img');img.src=frame(p,'AFTER');img.alt='Quadro final do efeito';img.loading='lazy';
      const meta=document.createElement('span');const strong=document.createElement('strong');strong.textContent=p.name;const small=document.createElement('small');small.textContent=`${p.time.toFixed(1)} s • ${p.version||'v1.2'} • não homologado`;meta.append(strong,small);button.append(img,meta);
      button.addEventListener('click',()=>choose(i));list.append(button);
    });
  };
  const choose=(index,{auto=false}={})=>{
    current=(index+presets.length)%presets.length;
    const p=presets[current];
    video.pause(); screen.classList.remove('frame-active'); video.removeAttribute('src'); video.load();
    video.poster=frame(p,'BEFORE');video.src=movie(p);video.load();
    $('sceneIndex').textContent=`${String(current+1).padStart(2,'0')} / ${String(presets.length).padStart(2,'0')}`;
    $('sceneTitle').textContent=p.name;
    $('sceneDescription').textContent=p.desc;
    $('sceneDetails').textContent=p.desc;
    $('timer').textContent=`0:00 / ${time(p.time)}`;
    $('timeline').value='0'; setPlayingUI(false);renderList();frameMode('BEFORE');reveal();
    if(auto) video.play().catch(()=>reveal());
  };
  const jump=(step)=>choose(current+step);
  $('prevScene').onclick=()=>jump(-1);$('nextScene').onclick=()=>jump(1);
  $('mainPlay').onclick=play;$('playSmall').onclick=play;
  $('replay').onclick=()=>{video.pause();video.currentTime=0;screen.classList.remove('frame-active');play();};
  $('showBefore').onclick=()=>frameMode('BEFORE');
  $('showAfter').onclick=()=>frameMode('AFTER');
  $('timeline').oninput=(e)=>{screen.classList.remove('frame-active');labelState('VÍDEO TÉCNICO • navegação quadro a quadro');if(video.duration && Number.isFinite(video.duration))video.currentTime=Number(e.target.value)/1000*video.duration;reveal();};
  video.ontimeupdate=()=>{const d=(video.duration&&Number.isFinite(video.duration))?video.duration:presets[current].time;$('timer').textContent=`${time(video.currentTime)} / ${time(d)}`;$('timeline').value=String(Math.round(1000*video.currentTime/d));};
  video.onplay=()=>{setPlayingUI(true);reveal();};
  video.onpause=()=>{setPlayingUI(false);reveal();};
  video.onended=()=>{setPlayingUI(false);labelState('TRANSIÇÃO CONCLUÍDA • compare os quadros');reveal();};
  video.onerror=()=>{$('sceneDescription').textContent='Vídeo indisponível. Use Antes/Depois para avaliar os quadros existentes.';frameMode('BEFORE');};
  $('fullScreen').onclick=()=>{if(document.fullscreenElement) document.exitFullscreen?.();else screen.requestFullscreen?.().catch(()=>{});};
  screen.addEventListener('pointermove',reveal);
  screen.addEventListener('touchstart',(e)=>{touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};reveal();},{passive:true});
  screen.addEventListener('touchend',(e)=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>72 && Math.abs(dx)>1.5*Math.abs(dy))jump(dx<0?1:-1);touchStart=null;},{passive:true});
  screen.addEventListener('click',(e)=>{if(e.target===screen||e.target===video) {if(screen.classList.contains('hide-chrome'))reveal();else screen.classList.add('hide-chrome');}});
  document.addEventListener('fullscreenchange',reveal);
  document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowLeft')jump(-1);else if(e.key==='ArrowRight')jump(1);else if(e.key===' '){e.preventDefault();play();}else if(e.key.toLowerCase()==='f'){if(document.fullscreenElement)document.exitFullscreen?.();else screen.requestFullscreen?.().catch(()=>{});}});
  choose(0);
  // Adopt the latest successfully deployed media. Older immutable versions
  // remain as fallbacks; no broken v1.5 URL may be shown to a customer.
  const libraries = {
    blind:[['v15','GLC_ME01_PERSIANA_V15'],['v14','GLC_ME01_PERSIANA_V14']],
    led:[['v15','GLC_ME04_PERFIS_LED_V15'],['v14','GLC_ME04_PERFIS_LED_V14']],
    tv:[['v15','GLC_ME06_TV_V15'],['v14','GLC_ME06_TV_V14']],
    cinema:[['v15','GLC_SC01_CINEMA_V15'],['v14','GLC_SC01_CINEMA_V14']]
  };
  Object.entries(libraries).forEach(async ([key,variants])=>{
    for(const [version,id] of variants){
      try{
        const url='assets/video/'+version+'/'+id+'.mp4';
        const head=await fetch(url,{method:'HEAD',cache:'no-store'});
        const type=(head.headers.get('content-type')||'').toLowerCase();
        if(!head.ok || (!type.includes('video')&&!type.includes('mp4')))continue;
        const p=presets.find(p=>p.key===key);
        if(!p)break;
        p.id=id;p.version=version;
        p.name=p.name.replace(/ v(?:[0-9]+(?:\.[0-9]+)?)$/,'')+
          ' v'+(version==='v15'?'1.5':'1.4');
        if(version==='v15'){
          const descriptions={
            blind:'Tecido translúcido e barra rolô se movimentam dentro dos três vidros; caixilhos e sofá preservados.',
            led:'Apenas os detalhes luminosos já presentes nos rasgos fotografados acendem; nenhuma nova linha é desenhada.',
            tv:'A imagem surge dentro da televisão original, sem alterar moldura ou perspectiva.',
            cinema:'Persiana, iluminação social, perfis e TV são ativados em etapas de 5 segundos.'
          };
          p.desc=descriptions[key];
          if(key==='cinema')p.time=5;
        }
        renderList();
        if(presets[current]===p)choose(current);
        break;
      }catch(_error){ /* Keep existing working version. */ }
    }
  });
})();
