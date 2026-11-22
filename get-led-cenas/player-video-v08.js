/* GET LED CENAS Studio v0.8 — video first.
 * Renders authored film clips where explicitly supplied by the approved media manifest.
 * Without a clip, displays an honest still image. NO synthetic device overlays.
 * This file does not control residential equipment or store client data.
 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const modal = $('simModal');
  const stage = $('modalVisual');
  if (!modal || !stage) return;

  const video = $('videoScene'), poster = $('videoPoster'), backdrop = $('videoAmbient');
  const noVideo = $('theaterEmpty'), notice = $('theaterNoticeText');
  const pFill = $('videoProgress'), progress = $('videoSeekTrack');
  const playLabel = $('theaterPlayLabel');
  const menu = $('theaterScenePicker'), menuList = $('theaterScenesList');
  const clock = { hide:0, tip:0 };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const allowedCdnHosts = new Set(['res.cloudinary.com']);
  const manifestFallback = {schema:1, environments:{
    living:{poster:'assets/sala-premium.webp',before:'assets/sala-premium.webp'},
    jantar:{poster:'assets/jantar-premium.webp',before:'assets/jantar-premium.webp'},
    suite:{poster:'assets/quarto-conceito.svg',before:'assets/quarto-conceito.svg'},
    banho:{poster:'assets/banheiro-conceito.svg',before:'assets/banheiro-conceito.svg'}
  },scenes:{}};
  let manifest = manifestFallback, scene = null, media = null;
  let hasFilm = false, showingBefore = false, controlsVisible = true, menuOpen = false, finger = null;
  const roomTitles = {living:'Living / Sala',jantar:'Jantar',suite:'Suíte',banho:'Banheiro / Lavabo'};
  const sceneList = () => (typeof scenes === 'undefined' ? [] : scenes);
  const activeScene = () => (typeof active === 'undefined' ? null : active);

  function safeSource(source){
    if (typeof source !== 'string' || !source || source.length > 300) return null;
    if (/^https:\/\//.test(source)) {
      try {const u=new URL(source); if(allowedCdnHosts.has(u.hostname))return u.toString();}catch{}
      return null;
    }
    // Local files only; no protocol, query, path traversal or client supplied URL.
    if(!/^assets\/(?:video|videos|media)\/[\w./-]+\.(?:mp4|webm|mov)$/i.test(source) || source.includes('..'))return null;
    return source;
  }
  function safeImage(source){
    if(typeof source !== 'string'||source.length>220)return null;
    if(!/^assets\/[\w./-]+\.(?:jpg|jpeg|png|webp|svg)$/i.test(source) || source.includes('..'))return null;
    return source;
  }
  function getEnvironment(s){
    const val=typeof sceneEnv==='function'?sceneEnv(s):'living';
    return roomTitles[val] ? val:'living';
  }
  function configFor(s){
    const env=getEnvironment(s);
    const environment=manifest.environments?.[env] || manifestFallback.environments[env];
    const clip=manifest.scenes?.[s.id]||{};
    const defaultPoster=safeImage(environment?.poster) || manifestFallback.environments[env].poster;
    return {env,title:roomTitles[env],poster:safeImage(clip.poster)||defaultPoster,
      before:safeImage(clip.before)||safeImage(environment?.before)||defaultPoster,
      after:safeImage(clip.after)||safeImage(environment?.after)||null,
      mp4:safeSource(clip.mp4),webm:safeSource(clip.webm),status:clip.status||'em_producao',
      steps:Array.isArray(clip.storyboard)?clip.storyboard:[]};
  }
  const canShowFilm = entry => entry && entry.status==='aprovado' && (entry.mp4||entry.webm);

  function showControls(){
    controlsVisible=true;modal.classList.remove('hud-hidden');
    clearTimeout(clock.hide);
    if(!menuOpen && !reducedMotion) clock.hide=setTimeout(()=>{
      if(!modal.classList.contains('hidden') && !document.activeElement?.matches('button:focus-visible'))hideControls();
    },3700);
  }
  function hideControls(){
    if(menuOpen)return;controlsVisible=false;modal.classList.add('hud-hidden');
  }
  function stopPlayback(){
    video.pause();
    video.removeAttribute('src'); video.querySelectorAll('source').forEach(s=>s.remove());video.load();
    video.classList.remove('is-loaded');
    pFill.style.width='0%'; progress.setAttribute('aria-valuenow','0');
    $('theaterAudio').disabled=true;$('theaterAudio').setAttribute('aria-pressed','false');video.muted=true;
    $('theaterPlayLabel').textContent='Reproduzir';
  }
  function showStill(src){
    poster.src=src;backdrop.style.backgroundImage=`url("${src}")`;
    poster.classList.add('is-visible');video.classList.remove('is-visible');
  }
  function showNotice(text){notice.textContent=text;}
  function setEmpty(show){
    noVideo.hidden=!show;
    $('modalPlayScene').disabled=show;
    $('modalBeforeAfter').disabled=showingBefore || !media?.after;
    $('theaterAudio').disabled=show;
    progress.classList.toggle('is-disabled',show);
  }
  function updateSelection(){
    if(!scene)return;
    const chosen=typeof selected!=='undefined' && selected.has(scene.id);
    $('theaterChooseLabel').textContent=chosen?'Cena selecionada':'Escolher cena';
    $('modalChoose').classList.toggle('is-selected',chosen);
  }
  function rebuildSceneMenu(){
    menuList.replaceChildren();
    sceneList().forEach((s,i)=>{
      const button=document.createElement('button');button.type='button';button.className='theater-scene-option'+(scene?.id===s.id?' current':'');
      button.setAttribute('aria-current',scene?.id===s.id?'true':'false');
      const pill=document.createElement('span');pill.textContent=String(i+1).padStart(2,'0');
      const title=document.createElement('span');title.textContent=s.name;
      button.append(pill,title);
      button.addEventListener('click',()=>{
        if(typeof simulate==='function')simulate(s);
        setMenu(false);showControls();
      });menuList.append(button);
    });
  }
  function render(s){
    if(!s) return;
    stopPlayback();scene=s;media=configFor(s);showingBefore=false;
    const list=sceneList();const idx=list.findIndex(x=>x.id===s.id);
    $('modalTitle').textContent=s.name;$('playerSceneName').textContent=s.name;
    $('playerRoom').textContent=media.title.toUpperCase()+' · AMBIENTE ILUSTRATIVO';
    $('playerSceneIndex').textContent=`${String(idx+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}`;
    $('theaterAnnounce').textContent='Cena '+s.name;
    showStill(media.poster);$('videoPoster').alt=(manifest.environments?.[media.env]?.alt)||('Referência de '+media.title);
    hasFilm=Boolean(canShowFilm(media));
    if (hasFilm) {
      const preferred=media.webm ? [media.webm,media.mp4] : [media.mp4];
      for(const src of preferred.filter(Boolean)) {
        const el=document.createElement('source');el.src=src;el.type=src.toLowerCase().endsWith('.webm')?'video/webm':'video/mp4';video.append(el);
      }
      video.load();
      noVideo.hidden=true;
      showNotice('VÍDEO DEMONSTRATIVO · NÃO ACIONA A RESIDÊNCIA');
      $('modalPlayScene').disabled=false;
      $('theaterAudio').disabled=false;
      $('modalBeforeAfter').disabled=!media.after;
      progress.classList.remove('is-disabled');
      playLabel.textContent='Reproduzir';
    } else {
      setEmpty(true);
      showNotice('FOTOGRAFIA DE REFERÊNCIA · VÍDEO EM PRODUÇÃO');
      $('theaterEmpty').querySelector('p').textContent='Persiana, TV e iluminação só serão demonstradas em movimento quando o vídeo profissional desta cena estiver aprovado.';
    }
    updateSelection();rebuildSceneMenu();showControls();
  }
  function open(s){
    stage.focus({preventScroll:true});setMenu(false);
    render(s);showControls();
    // Custom modal offers fullscreen layout on mobile; no unreliable forced orientation.
  }
  function sync(s){if(!s)return;if(!scene||scene.id!==s.id)render(s);else updateSelection()}
  function close(){
    stopPlayback();setMenu(false);clearTimeout(clock.hide);clearTimeout(clock.tip);
    media=null;scene=null;modal.classList.remove('hud-hidden');
  }
  function play(s){
    if(s && (!scene || scene.id!==s.id))render(s);
    if(!hasFilm){showControls();showNotice('Sem vídeo aprovado para esta cena — referência estática');return false;}
    if(video.ended)video.currentTime=0;
    if(!video.paused){video.pause();return true;}
    const result=video.play();
    if(result&&typeof result.catch==='function')result.catch(()=>{showNotice('Não foi possível reproduzir o vídeo neste dispositivo');showStill(media.poster);showControls()});
    return true;
  }
  function showReference(s,before){
    if(s && (!scene || scene.id!==s.id))render(s);
    if(!media)return;
    if(!media.after){$('modalBeforeAfter').disabled=true;return;}
    video.pause();showingBefore=Boolean(before);showStill(showingBefore?media.before:media.after);
    $('theaterBeforeLabel').textContent=showingBefore?'Ver resultado':'Ver antes';
    $('modalBeforeAfter').disabled=false;
    showControls();
  }
  function setMenu(open){menuOpen=Boolean(open);menu.hidden=!menuOpen;modal.classList.toggle('menu-open',menuOpen);showControls()}

  $('theaterScenes').addEventListener('click',()=>setMenu(!menuOpen));
  $('theaterClosePicker').addEventListener('click',()=>setMenu(false));
  $('videoSeekTrack').addEventListener('pointerdown',e=>{
    if(!hasFilm || !Number.isFinite(video.duration)||video.duration<=0)return;
    const bounds=progress.getBoundingClientRect();const pct=Math.max(0,Math.min(1,(e.clientX-bounds.left)/bounds.width));video.currentTime=pct*video.duration;showControls();
  });
  progress.addEventListener('keydown',e=>{
    if(!hasFilm)return;
    if(['ArrowRight','ArrowLeft'].includes(e.key)){
      e.preventDefault();e.stopPropagation();video.currentTime=Math.max(0,Math.min(video.duration||0, video.currentTime+(e.key==='ArrowRight'?5:-5)));
    }
  });
  video.addEventListener('loadeddata',()=>{
    video.classList.add('is-visible');poster.classList.remove('is-visible');video.classList.add('is-loaded');
  });
  video.addEventListener('timeupdate',()=>{
    if(!Number.isFinite(video.duration)||video.duration<=0)return;
    const pct=Math.min(100,Math.round(video.currentTime/video.duration*100));pFill.style.width=pct+'%';progress.setAttribute('aria-valuenow',String(pct));
  });
  video.addEventListener('play',()=>{$('theaterPlayLabel').textContent='Pausar';poster.classList.remove('is-visible');video.classList.add('is-visible');showControls()});
  video.addEventListener('pause',()=>{$('theaterPlayLabel').textContent=video.ended?'Reiniciar':'Reproduzir';showControls()});
  video.addEventListener('ended',()=>{$('theaterPlayLabel').textContent='Reiniciar';showControls()});
  video.addEventListener('error',()=>{
    hasFilm=false;setEmpty(true);showStill(media?.poster || manifestFallback.environments.living.poster);
    showNotice('Vídeo indisponível — mostrando referência estática');showControls();
  });
  $('theaterAudio').addEventListener('click',()=>{
    if(!hasFilm)return;video.muted=!video.muted;
    $('theaterAudio').setAttribute('aria-pressed',String(!video.muted));
    $('theaterAudio').querySelector('span:last-child').textContent=video.muted?'Ativar som':'Silenciar';
    showControls();
  });
  $('modalChoose').addEventListener('click',()=>setTimeout(updateSelection,0));
  stage.addEventListener('click',e=>{
    if(e.target.closest('button') || e.target.closest('.theater-scenes-drawer') || e.target===progress || progress.contains(e.target))return;
    if(finger?.wasSwipe)return;
    if(controlsVisible)hideControls();else showControls();
  });
  stage.addEventListener('pointerdown',e=>{
    if(e.target.closest('button')||e.target.closest('.theater-scenes-drawer'))return;
    finger={x:e.clientX,y:e.clientY,wasSwipe:false};
  },{passive:true});
  stage.addEventListener('pointerup',e=>{
    if(!finger)return;const dx=e.clientX-finger.x,dy=e.clientY-finger.y;
    if(Math.abs(dx)>76 && Math.abs(dx)>Math.abs(dy)*1.3){
      finger.wasSwipe=true;
      if(typeof changeScene==='function')changeScene(dx<0?1:-1);
      showControls();
    }
    setTimeout(()=>{finger=null},100);
  },{passive:true});
  stage.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&!modal.classList.contains('hidden'))showControls()},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
  fetch('assets/scene-media.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(value=>{
    if(value?.schema===1 && value?.environments && value?.scenes){manifest=value; if(scene)render(scene)}
  }).catch(()=>{});
  window.GetLedVideoPlayer={open,close,play,sync,showReference,get status(){return {scene:scene?.id||null,hasFilm,showingBefore,menuOpen,paused:video.paused}}};
})();
