'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 let data=null,scene=null,model=null,fileUrl=null,localName='',reviewChecks=[];
 const notify=msg=>{const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>el.classList.remove('show'),3300)};
 const dollars=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'USD'}).format(n);
 const len=s=>new TextEncoder().encode(s).length;
 const copy=async value=>{try{await navigator.clipboard.writeText(value);notify('Conteúdo copiado')}catch{notify('Cópia indisponível neste navegador')}};
 function renderScenes(){
  $('templatesCount').textContent=`${String(data.scenes.length).padStart(2,'0')} roteiros`;
  $('templateTrack').replaceChildren();
  data.scenes.forEach((s,i)=>{
   const b=document.createElement('button');b.type='button';b.className='template-card'+(scene?.id===s.id?' active':'');b.setAttribute('role','option');b.setAttribute('aria-selected',String(scene?.id===s.id));
   const icon=document.createElement('span');icon.className='template-icon';icon.textContent=s.icon;
   const name=document.createElement('strong');name.textContent=s.shot;
   const meta=document.createElement('small');meta.textContent=s.scene_id+' · '+(s.room==='living'?'Living':'Jantar');
   b.append(icon,name,meta);b.addEventListener('click',()=>chooseScene(i));$('templateTrack').append(b);
  });
 }
 function renderModel(){
  $('modelList').replaceChildren();
  data.providers.forEach(m=>{
   const b=document.createElement('button');b.type='button';b.className='model'+(model?.id===m.id?' active':'');b.setAttribute('aria-pressed',String(model?.id===m.id));
   const dot=document.createElement('span');dot.className='radio-dot';const wrap=document.createElement('span');const title=document.createElement('strong');title.textContent=m.label;const detail=document.createElement('em');detail.textContent=m.notes;wrap.append(title,detail);b.append(dot,wrap);b.addEventListener('click',()=>chooseModel(m.id));$('modelList').append(b);
  });
 }
 function chooseScene(i){
  scene=data.scenes[i];
  $('scenePoster').src=scene.poster;
  $('sceneBadge').textContent=scene.scene_id;
  $('sceneRoom').textContent=scene.room==='living'?'LIVING / SALA':'JANTAR';
  $('sceneTitle').textContent=scene.name;
  $('sceneAction').textContent=scene.shot;
  $('sceneRoomMeta').textContent=scene.room==='living'?'Sala integrada':'Sala de jantar';
  $('sceneEquipment').textContent=scene.action==='tv'?'Televisão':scene.action==='persiana'?'Persiana': 'Iluminação';
  $('sceneStatus').textContent='Roteiro preparado';
  $('prompt').value=scene.prompt;
  $('negativePrompt').value=scene.negative_prompt;
  $('timeline').replaceChildren();
  for(const line of scene.timeline){const el=document.createElement('div');el.className='timeline-step';const p=document.createElement('p');p.textContent=line;el.append(p);$('timeline').append(el)}
  clearPreview();renderQuality();renderScenes();update();
 }
 function chooseModel(id){
  const next=data.providers.find(p=>p.id===id);if(!next)return;
  model=next;
  const duration=$('duration');const prev=Number(duration.value);
  duration.replaceChildren();
  model.duration_options.forEach(seconds=>{
   const option=document.createElement('option');option.value=String(seconds);option.textContent=seconds+' segundos';duration.append(option);
  });
  duration.value=String(model.duration_options.includes(prev)?prev:model.duration_options[0]);
  renderModel();update();
 }
 function update(){
  if(!scene||!model)return;
  const resolution=$('resolution').value,duration=Number($('duration').value),rate=model.prices_usd_s?.[resolution];
  $('cost').textContent=Number.isFinite(rate)?dollars(duration*rate):'Não disponível';
  $('costDetail').textContent=`${model.label} • ${duration} s • ${resolution} • sem áudio`;
  $('promptLength').textContent=`${len($('prompt').value)} / 2048 bytes`;
  let warning='';
  if(model.kind==='transition'&&!scene.last_image)warning='Etapa pendente: criar e aprovar o quadro FINAL da persiana, mantendo perspectiva e móveis idênticos. A transição fica bloqueada até lá.';
  if(len($('prompt').value)>2048 || len($('negativePrompt').value)>2048)warning='Um dos prompts excede o limite de 2048 bytes da API.';
  $('warning').textContent=warning;
  $('exportJob').disabled=len($('prompt').value)>2048||len($('negativePrompt').value)>2048||(model.kind==='transition'&&!scene.last_image)||!Number.isFinite(rate);
  $('copyJob').disabled=$('exportJob').disabled;
 }
 function job(){
  if(!scene||!model)throw Error('Selecione a cena e o motor');
  if(model.kind==='transition'&&!scene.last_image)throw Error('Prepare e vincule a imagem final antes de usar Transition.');
  if(!model.duration_options.includes(Number($('duration').value)))throw Error('Duração não suportada pelo modelo.');
  const json={schema:3,product:'GET LED CENAS',type:'production-job',scene_id:scene.scene_id,id:scene.id,room:scene.room,shot:scene.shot,
   model:{id:model.id,endpoint:model.endpoint,kind:model.kind},quality:{resolution:$('resolution').value,duration_s:Number($('duration').value),aspect_ratio:'16:9',audio:false,multi_clip:false},
   input:{first_image:scene.input_image,last_image:scene.last_image},prompt:$('prompt').value.trim(),negative_prompt:$('negativePrompt').value.trim(),
   estimated_cost_usd:Number((model.prices_usd_s[$('resolution').value]*Number($('duration').value)).toFixed(4)),
   review:scene.quality_checks,rights:scene.rights,publication:'blocked_pending_human_review',
   adapter_status:'backend_adapter_required',
   note:'Tarefa normalizada para executor protegido. Campos de API variam por provedor. Não contém credenciais, não gasta créditos e não publica.'};
  return json;
 }
 function download(obj,filename){const b=new Blob([JSON.stringify(obj,null,2)],{type:'application/json;charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),15000)}
 function clearPreview(){if(fileUrl)URL.revokeObjectURL(fileUrl);fileUrl=null;localName='';$('reviewFile').value='';$('localPreview').pause();$('localPreview').removeAttribute('src');$('localPreview').hidden=true;$('noPreview').hidden=false;$('reviewFileName').textContent='Nenhuma mídia selecionada.';}
 function renderQuality(){reviewChecks=scene.quality_checks.map(()=>false);$('qualityList').replaceChildren();scene.quality_checks.forEach((s,i)=>{
  const label=document.createElement('label');label.className='quality-row';const box=document.createElement('input');box.type='checkbox';box.checked=false;box.addEventListener('change',()=>{reviewChecks[i]=box.checked;reviewStatus()});const span=document.createElement('span');span.textContent=s;label.append(box,span);$('qualityList').append(label)
 });reviewStatus()}
 function reviewStatus(){const count=reviewChecks.filter(Boolean).length;$('reviewResult').textContent=`${count} / ${reviewChecks.length} critérios validados`;$('downloadReview').disabled=!fileUrl || count!==reviewChecks.length}
 $('reviewFile').addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>200*1024*1024){notify('Limite de prévia local: 200 MB');e.target.value='';return}
  if(!['video/mp4','video/webm'].includes(file.type)){notify('Selecione MP4 ou WebM');e.target.value='';return}
  if(fileUrl)URL.revokeObjectURL(fileUrl);fileUrl=URL.createObjectURL(file);localName=file.name;$('localPreview').src=fileUrl;$('localPreview').hidden=false;$('noPreview').hidden=true;$('reviewFileName').textContent=file.name+' • '+(file.size/(1024*1024)).toFixed(1)+' MB';reviewChecks=reviewChecks.map(()=>false);$('qualityList').querySelectorAll('input').forEach(b=>b.checked=false);reviewStatus();});
 $('exportJob').addEventListener('click',()=>{try{download(job(),`${scene.id}_${model.id}_job.json`);notify('Tarefa preparada. Nenhum crédito foi consumido.')}catch(e){notify(e.message)}});
 $('copyJob').addEventListener('click',()=>{try{copy(JSON.stringify(job(),null,2))}catch(e){notify(e.message)}});
 $('copyPrompt').addEventListener('click',()=>copy($('prompt').value));
 $('downloadReview').addEventListener('click',()=>{if(!fileUrl||reviewChecks.some(v=>!v))return;download({schema:1,kind:'candidate-quality-review',scene_id:scene.scene_id,job_id:scene.id,file_name:localName,checks:scene.quality_checks.map((text,i)=>({text,passed:reviewChecks[i]})),decision:'visual_review_passed_NOT_PUBLISHED',license_verified:false,technical_signature_required:true,notice:'Aprovação visual local não publica o vídeo. Revisão de direitos e validação técnica continuam obrigatórias.'},`${scene.id}_avaliacao_visual.json`);notify('Avaliação exportada; publicação continua bloqueada')});
 ['resolution','duration','prompt','negativePrompt'].forEach(id=>$(id).addEventListener(id==='prompt'||id==='negativePrompt'?'input':'change',update));
 fetch('assets/video-blueprints.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Biblioteca indisponível');return r.json()}).then(manifest=>{if(manifest.schema!==3)throw Error('Biblioteca incompatível');data=manifest;scene=manifest.scenes[0];model=manifest.providers[0];chooseScene(0);chooseModel('v6')}).catch(e=>{notify('Não foi possível carregar os roteiros');$('warning').textContent=e.message;console.error(e)});
})();
