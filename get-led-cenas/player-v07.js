/* GET LED CENAS v0.7 — showroom player, animation choreography and responsive HUD.
   Non-destructive illustration, never sends device commands. */
(() => {
  'use strict';
  const modal = document.getElementById('simModal');
  const stage = document.getElementById('modalVisual');
  if (!modal || !stage) return;
  const $ = id => document.getElementById(id);
  const PAUSE = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
  const PHASES = ['before','dim','shade','led','tv','audio','done'];
  const DURATION = PAUSE ? 0 : 5400;
  let playing = false;
  let currentPhase = 'before';
  let currentScene = null;
  let tourActive = false;
  let timers = [];
  let raf = 0;
  let hideTimer = 0;
  let finger = null;
  let destroyed = false;
  let startedAt = 0;
  const sceneNames = { living:'LIVING / SALA',jantar:'JANTAR',suite:'SUÍTE',banho:'BANHO / LAVABO' };

  function clearSequence(){
    timers.forEach(clearTimeout);timers=[];
    if(raf)cancelAnimationFrame(raf);raf=0;
    playing=false;stage.classList.remove('sequence-live','sequence-running');
    const status=$('sequenceStatus');status?.classList.remove('live');
    const bar=$('playerProgress');if(bar)bar.style.width='0%';
  }
  function setPhase(phase){
    PHASES.forEach(p=>stage.classList.remove('phase-'+p));
    currentPhase=phase;stage.classList.add('phase-'+phase);
  }
  function needs(s,id){return s && Array.isArray(s.needs) && s.needs.includes(id)}
  function flags(s){
    const available = id => Array.isArray(config.equipment) && config.equipment.includes(id);
    const state = studioState(s,false);
    return {blind:state.showShade, tv:state.showTv,
      audio:available('som')&&(needs(s,'som')||needs(s,'tv')||mood(s)==='jantar')};
  }
  function sync(s,before=false){
    if(!s || destroyed)return;
    currentScene=s;
    const env=sceneEnv(s), state=flags(s);
    stage.classList.toggle('no-blind',!state.blind);
    stage.classList.toggle('no-tv',!state.tv);
    stage.classList.toggle('no-audio',!state.audio);
    ['cinema','jantar','noite','manha','leitura','banho'].forEach(m=>stage.classList.toggle('mood-'+m,mood(s)===m));
    if(!playing)setPhase(before?'before':'done');
    if(tourActive)focus();else resetFocus();
    const label = sceneNames[env]||'AMBIENTE';
    $('playerRoom').textContent = label+' · SIMULAÇÃO ILUSTRATIVA';
    $('playerSceneName').textContent = s.name;
    updateSceneMeta(s);
  }
  function updateSceneMeta(s){
    if(!s)return;
    const idx=scenes.findIndex(x=>x.id===s.id);
    const counter=$('playerSceneIndex');
    if(counter)counter.textContent=String(idx+1).padStart(2,'0')+' / '+String(scenes.length).padStart(2,'0');
    const title=$('playerSceneName');if(title)title.textContent=s.name;
    const choose=$('modalChoose');
    if(choose){choose.classList.toggle('is-selected',selected.has(s.id));choose.innerHTML=selected.has(s.id)?'✓ <span>Selecionada</span>':'＋ <span>Escolher cena</span>';}
    const play=$('modalPlayScene');if(play)play.innerHTML='▶ <span>Reproduzir</span>';
  }
  function showHud({persist=false}={}){
    modal.classList.remove('hud-hidden');
    clearTimeout(hideTimer);
    if(!persist && !PAUSE)hideTimer=setTimeout(()=>{
      if(!playing && modal.contains(document.activeElement) && document.activeElement?.matches('button'))return;
      modal.classList.add('hud-hidden');
    },4200);
  }
  function hideHud(){
    if(!PAUSE){clearTimeout(hideTimer);modal.classList.add('hud-hidden');}
  }
  function setStatus(title,detail){
    const status=$('sequenceStatus');
    if(!status)return;
    status.classList.add('live');
    const name=status.querySelector('strong'), description=status.querySelector('span');
    if(name)name.textContent=title;
    if(description)description.textContent=detail;
  }
  function play(s){
    if(!s)return;
    clearSequence();currentScene=s;playing=true;
    const states=flags(s), dark=['cinema','noite'].includes(mood(s));
    stage.classList.add('sequence-live','sequence-running');
    stage.classList.toggle('no-blind',!states.blind);
    stage.classList.toggle('no-tv',!states.tv);
    stage.classList.toggle('no-audio',!states.audio);
    setPhase('before');
    showHud();
    startedAt=performance.now();
    const steps=[
      [0,'before','Preparando ambiente','Luzes e equipamentos no estado inicial'],
      [380,dark?'dim':'led',dark?'Reduzindo luz geral':'Compondo a iluminação','Transição para a atmosfera escolhida'],
      [1080,states.blind?'shade':'led',states.blind?'Persiana em movimento':'Iluminação arquitetônica','A janela e o teto mudam de ambiente'],
      [2320,'led','Perfil de LED aceso','A iluminação linear ganha destaque'],
      [3400,states.tv?'tv':'led',states.tv?'TV ligando':'Ambiente em destaque',states.tv?'Tela e reflexo luminoso entram em cena':'Camadas de luz estabilizadas'],
      [4170,states.audio?'audio':(states.tv?'tv':'led'),states.audio?'Soundbar em ação':'Ajustando ambiente',states.audio?'O som participa da atmosfera':'Iluminação e conforto definidos'],
      [5100,'done','Cena pronta','Explore outra cena ou marque esta opção']
    ];
    const fast=PAUSE?10:1;
    for(const [ms,phase,title,desc] of steps){
      timers.push(setTimeout(()=>{setPhase(phase);setStatus(title,desc)},PAUSE?0:ms));
    }
    const updateProgress=(now)=>{
      if(!playing)return;
      const elapsed=Math.max(0,now-startedAt);
      const bar=$('playerProgress');if(bar)bar.style.width=Math.min(100,Math.round(elapsed/Math.max(DURATION,1)*100))+'%';
      if(elapsed<DURATION)raf=requestAnimationFrame(updateProgress);
    };
    if(!PAUSE)raf=requestAnimationFrame(updateProgress);
    timers.push(setTimeout(()=>{
      playing=false;
      sequencePlaying=false;
      isBefore=false;
      setPhase('done');
      stage.classList.remove('sequence-running','sequence-live');
      const bar=$('playerProgress');if(bar)bar.style.width='100%';
      $('sequenceStatus')?.classList.remove('live');
      syncBefore();
      showHud();
    },PAUSE?30:5400));
  }
  function resetFocus(){
    const svg=$('livingCinemaSVG');if(svg){svg.style.transform='';svg.style.transformOrigin='50% 50%';}
  }
  function focus(){
    if(!tourActive || !currentScene)return;
    const svg=$('livingCinemaSVG');
    if(!svg || sceneEnv(currentScene)!=='living')return;
    const item=(getStops(currentScene)||[])[activeStop];
    const focus=item?.focus||{x:50,y:50};
    svg.style.transformOrigin=focus.x+'% '+focus.y+'%';
    svg.style.transform='scale(1.17)';
    const hint=$('playerRoom');if(hint)hint.textContent=(item?.label||'Visão geral').toUpperCase()+' · VISITA GUIADA';
  }
  function visit(on){
    tourActive=Boolean(on);
    if(tourActive){focus();showHud();}else resetFocus();
  }
  function sizeRoom(){
    const svg=$('livingCinemaSVG');if(!svg)return;
    svg.setAttribute('preserveAspectRatio',window.innerHeight>window.innerWidth*1.1?'xMidYMid meet':'xMidYMid slice');
  }
  window.addEventListener('resize',sizeRoom,{passive:true});
  function open(s){
    sizeRoom();
    destroyed=false;currentScene=s;clearSequence();
    modal.classList.remove('hud-hidden');
    sync(s,false);
    showHud();
  }
  function close(){
    clearSequence();visit(false);clearTimeout(hideTimer);
    modal.classList.remove('hud-hidden');
  }
  function swapScene(delta){if(!modal.classList.contains('hidden')){changeScene(delta);showHud();}}
  function interact(event){
    if(event.target.closest('button,a,input,textarea,select')){showHud();return;}
    if(modal.classList.contains('hud-hidden')){showHud();}
    else hideHud();
  }
  stage.addEventListener('click',e=>{
    if(modal.classList.contains('hidden'))return;
    if(finger && finger.wasSwipe){finger=null;return;}
    interact(e);
  });
  stage.addEventListener('pointermove',e=>{if(e.pointerType==='mouse' && !modal.classList.contains('hidden') && !modal.classList.contains('hud-hidden'))showHud();},{passive:true});
  stage.addEventListener('pointerdown',e=>{
    if(e.target.closest('button')){finger=null;return;}
    finger={x:e.clientX,y:e.clientY,wasSwipe:false,t:Date.now()};
  },{passive:true});
  stage.addEventListener('pointerup',e=>{
    if(!finger || !finger.t)return;
    const dx=e.clientX-finger.x,dy=e.clientY-finger.y;
    if(Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*1.3){finger.wasSwipe=true;swapScene(dx<0?1:-1)}
    else if(Math.abs(dy)>75 && Math.abs(dy)>Math.abs(dx)*1.3){finger.wasSwipe=true;setActiveStop(activeStop+(dy<0?1:-1),true);showHud();}
    setTimeout(()=>{finger=null},200);
  },{passive:true});
  document.addEventListener('keydown',e=>{
    if(modal.classList.contains('hidden'))return;
    if(e.code==='Space' && !e.target.closest('button,input,textarea,select')){e.preventDefault();playSceneSequence();}
    if(e.key==='h' || e.key==='H'){
      e.preventDefault();modal.classList.toggle('hud-hidden');
    }
    if(e.key==='Tab')showHud({persist:true});
  });
  modal.addEventListener('focusin',()=>showHud({persist:true}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearSequence();} });
  window.GetLedPlayer={open,close,play,sync,visit,updateSceneMeta,showHud,get status(){return {playing,currentPhase,tourActive,scene:currentScene?.id||null}}};
})();
