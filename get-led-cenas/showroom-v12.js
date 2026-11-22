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
  let current = 0;
  let chromeTimer = 0;
  let touchStart = null;
  const base = 'assets/rooms/living-model/v12/';
  const mp4 = 'assets/video/v12/';
  const frame = (p,state='BEFORE') => `${base}${p.id}_${state}.webp`;
  const time = (v) => { const n = Math.max(0, Math.floor(Number(v)||0)); return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`; };
  const setPlayingUI = (playing) => { $('mainPlay').textContent = playing?'Ⅱ':'▶'; $('playSmall').textContent = playing?'Ⅱ':'▶'; };
  const reveal = () => {
    screen.classList.remove('hide-chrome');
    clearTimeout(chromeTimer);
    if(!video.paused && !video.ended) chromeTimer=setTimeout(()=>screen.classList.add('hide-chrome'),2600);
  };
  const play = () => {
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
      const meta=document.createElement('span');const strong=document.createElement('strong');strong.textContent=p.name;const small=document.createElement('small');small.textContent=`${p.time.toFixed(1)} segundos • técnico`;meta.append(strong,small);button.append(img,meta);
      button.addEventListener('click',()=>choose(i));list.append(button);
    });
  };
  const choose=(index,{auto=false}={})=>{
    current=(index+presets.length)%presets.length;
    const p=presets[current];
    video.pause(); video.removeAttribute('src'); video.load();
    video.poster=frame(p,'BEFORE');video.src=mp4+p.id+'.mp4';video.load();
    $('sceneIndex').textContent=`${String(current+1).padStart(2,'0')} / ${String(presets.length).padStart(2,'0')}`;
    $('sceneTitle').textContent=p.name;
    $('sceneDescription').textContent=p.desc;
    $('sceneDetails').textContent=p.desc;
    $('timer').textContent=`0:00 / ${time(p.time)}`;
    $('timeline').value='0'; setPlayingUI(false);renderList();reveal();
    if(auto) video.play().catch(()=>reveal());
  };
  const jump=(step)=>choose(current+step);
  $('prevScene').onclick=()=>jump(-1);$('nextScene').onclick=()=>jump(1);
  $('mainPlay').onclick=play;$('playSmall').onclick=play;
  $('replay').onclick=()=>{video.pause();video.currentTime=0;play();};
  $('showBefore').onclick=()=>{video.pause();video.currentTime=0;setPlayingUI(false);reveal();};
  $('showAfter').onclick=()=>{video.pause();if(video.readyState>=1)video.currentTime=Math.max(0,video.duration-.05);setPlayingUI(false);reveal();};
  $('timeline').oninput=(e)=>{if(video.duration && Number.isFinite(video.duration))video.currentTime=Number(e.target.value)/1000*video.duration;reveal();};
  video.ontimeupdate=()=>{const d=(video.duration&&Number.isFinite(video.duration))?video.duration:presets[current].time;$('timer').textContent=`${time(video.currentTime)} / ${time(d)}`;$('timeline').value=String(Math.round(1000*video.currentTime/d));};
  video.onplay=()=>{setPlayingUI(true);reveal();};
  video.onpause=()=>{setPlayingUI(false);reveal();};
  video.onended=()=>{setPlayingUI(false);reveal();};
  video.onerror=()=>{$('sceneDescription').textContent='Mídia ainda não carregada. Tente atualizar a página.';setPlayingUI(false);};
  $('fullScreen').onclick=()=>{if(document.fullscreenElement) document.exitFullscreen?.();else screen.requestFullscreen?.().catch(()=>{});};
  screen.addEventListener('pointermove',reveal);
  screen.addEventListener('touchstart',(e)=>{touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};reveal();},{passive:true});
  screen.addEventListener('touchend',(e)=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>72 && Math.abs(dx)>1.5*Math.abs(dy))jump(dx<0?1:-1);touchStart=null;},{passive:true});
  screen.addEventListener('click',(e)=>{if(e.target===screen||e.target===video) {if(screen.classList.contains('hide-chrome'))reveal();else screen.classList.add('hide-chrome');}});
  document.addEventListener('fullscreenchange',reveal);
  document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.key==='ArrowLeft')jump(-1);else if(e.key==='ArrowRight')jump(1);else if(e.key===' '){e.preventDefault();play();}else if(e.key.toLowerCase()==='f'){if(document.fullscreenElement)document.exitFullscreen?.();else screen.requestFullscreen?.().catch(()=>{});}});
  choose(0);
})();
