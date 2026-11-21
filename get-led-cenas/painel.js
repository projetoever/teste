'use strict';
const u=window.CenasUtil, $=u.byId;
const STORE='get_led_cenas_studio_v02';
const PRESETS={
 basico:{equipment:['iluminacao','assistente','tomadas'],rooms:['Living / Sala','Sala de jantar','Cozinha','Corredor','Quarto 1','Banheiro']},
 apartamento:{equipment:['iluminacao','ar','persianas','tv','som','assistente'],rooms:['Living / Sala','Sala de jantar','Corredor','Suíte master','Quarto 1','Quarto 2','Banheiro','Lavabo','Área de serviço']},
 premium:{equipment:CENAS_CATALOG.equipment.map(x=>x.id),rooms:CENAS_CATALOG.rooms.slice()}
};
let saved=null;try{saved=JSON.parse(localStorage.getItem(STORE)||'null')}catch{}
const state={equipment:new Set(saved?.equipment||PRESETS.apartamento.equipment),rooms:new Set(saved?.rooms||PRESETS.apartamento.rooms)};
state.equipment=new Set([...state.equipment].filter(id=>CENAS_CATALOG.equipment.some(x=>x.id===id)));
state.rooms=new Set([...state.rooms].filter(r=>CENAS_CATALOG.rooms.includes(r)));
$('internalName').value=saved?.internalName||'';
$('publicTitle').value=saved?.publicTitle||'Sua casa inteligente';
$('welcome').value=saved?.welcome||'Uma seleção de experiências inteligentes criada de acordo com os ambientes e equipamentos do seu imóvel.';
const safe=s=>u.text(s);
function config(){return {v:1,title:$('publicTitle').value.trim().slice(0,65)||'Sua casa inteligente',welcome:$('welcome').value.trim().slice(0,250),equipment:[...state.equipment],rooms:[...state.rooms]}}
function isPublicSafe(c){const risky=/\b(?:\d{2,3}[ .-]?\d{4,5}[ .-]?\d{4}|\d{3}[ .-]?\d{3}[ .-]?\d{3}[ .-]?\d{2})\b|@|(?:rua|avenida|alameda|apto|apartamento|bloco|cpf|cnpj|senha|password|token)\s*[:#\d]/i;return !risky.test(c.title+' '+c.welcome)}
function markDirty(){if(!$('linkBox').classList.contains('hidden')){$('linkBox').classList.add('hidden');$('generatedLink').value=''};renderPreview()}
function persist(){try{localStorage.setItem(STORE,JSON.stringify({internalName:$('internalName').value,publicTitle:$('publicTitle').value,welcome:$('welcome').value,equipment:[...state.equipment],rooms:[...state.rooms]}))}catch{} }
function renderEquipment(){const q=$('equipmentSearch').value.trim().toLocaleLowerCase('pt-BR');$('equipmentOptions').innerHTML=CENAS_CATALOG.equipment.filter(e=>(e.name+' '+e.description).toLocaleLowerCase('pt-BR').includes(q)).map(e=>`<label class="option"><input type="checkbox" name="equipment" value="${safe(e.id)}" ${state.equipment.has(e.id)?'checked':''}><span><strong>${safe(e.name)}</strong><small>${safe(e.description)}</small></span></label>`).join('')||'<p class="panel-copy">Nenhum recurso encontrado.</p>'; $('equipmentOptions').querySelectorAll('input').forEach(el=>el.addEventListener('change',()=>{el.checked?state.equipment.add(el.value):state.equipment.delete(el.value);$('presets').querySelectorAll('.preset').forEach(b=>b.classList.remove('active'));markDirty();persist()}));$('equipmentCount').textContent=state.equipment.size+' selecionados'}
function renderRooms(){$('roomOptions').innerHTML=CENAS_CATALOG.rooms.map(r=>`<label class="room-option"><input type="checkbox" name="room" value="${safe(r)}" ${state.rooms.has(r)?'checked':''}><span>${safe(r)}</span></label>`).join('');$('roomOptions').querySelectorAll('input').forEach(el=>el.addEventListener('change',()=>{el.checked?state.rooms.add(el.value):state.rooms.delete(el.value);$('presets').querySelectorAll('.preset').forEach(b=>b.classList.remove('active'));markDirty();persist()}));$('roomCount').textContent=state.rooms.size+' ambientes'}
const recom=new Set(['SC01','SC03','SC05','SC06','SC07','SC11','SC12','SC14']);
function renderPreview(){const available=u.visible(config()),q=$('sceneSearch').value.trim().toLocaleLowerCase('pt-BR');$('sceneCount').textContent=available.length; $('coverage').style.width=(available.length*100/CENAS_CATALOG.scenes.length)+'%';const filtered=available.filter(s=>(s.name+' '+s.desc+' '+s.cat).toLocaleLowerCase('pt-BR').includes(q));$('scenePreview').innerHTML=filtered.length?filtered.map(s=>`<div class="preview-item"><div><b>${safe(s.name)}</b><small>${safe(s.id)} · ${safe(s.cat)}</small></div><span class="ok">${recom.has(s.id)?'✦ SUGERIDA':'✓'}</span></div>`).join(''):'<p class="panel-copy">Nenhuma cena compatível encontrada para este filtro.</p>'; $('equipmentCount').textContent=state.equipment.size+' selecionados';$('roomCount').textContent=state.rooms.size+' ambientes'}
$('equipmentSearch').addEventListener('input',renderEquipment);
$('sceneSearch').addEventListener('input',renderPreview);
$('presets').querySelectorAll('.preset').forEach(b=>b.addEventListener('click',()=>{state.equipment=new Set(PRESETS[b.dataset.preset].equipment);state.rooms=new Set(PRESETS[b.dataset.preset].rooms);$('presets').querySelectorAll('.preset').forEach(x=>x.classList.toggle('active',x===b));$('equipmentSearch').value='';renderEquipment();renderRooms();markDirty();persist();u.toast('Modelo aplicado ao formulário')}));
for(const [id,newSet,target] of [['selectEquipmentAll',()=>new Set(CENAS_CATALOG.equipment.map(x=>x.id)),'equipment'],['clearEquipment',()=>new Set(),'equipment'],['selectRoomsAll',()=>new Set(CENAS_CATALOG.rooms),'rooms'],['clearRooms',()=>new Set(),'rooms']]){$(id).addEventListener('click',()=>{state[target]=newSet();target==='equipment'?renderEquipment():renderRooms();markDirty();persist()})}
for(const id of ['internalName','publicTitle','welcome'])$(id).addEventListener('input',()=>{markDirty();persist()});
function makeLink(){const c=config();if(!u.visible(c).length){u.toast('Selecione recursos e ambientes compatíveis.');return null}if(!isPublicSafe(c)){u.toast('Revise o título e a mensagem: não inclua dados pessoais ou endereço.');return null}const url=new URL('formulario.html',document.baseURI);url.hash='p='+u.encode(c);$('generatedLink').value=url.href;$('linkBox').classList.remove('hidden');return url.href}
$('makeLink').addEventListener('click',()=>{if(makeLink())u.toast('Link público demonstrativo pronto')});
$('saveDraft').addEventListener('click',()=>{persist();u.toast('Rascunho salvo neste navegador')});
$('copyLink').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('generatedLink').value);u.toast('Link copiado')}catch{$('generatedLink').select();u.toast('Selecione e copie o endereço')}});
$('openLink').addEventListener('click',()=>{if($('generatedLink').value)window.open($('generatedLink').value,'_blank','noopener,noreferrer')});
$('whatsappLink').addEventListener('click',()=>{if(!$('generatedLink').value)return;const text='GET LED CENAS — Prévia de experiência residencial\n\n'+$('generatedLink').value+'\n\nCatálogo ilustrativo sujeito a validação técnica.';window.open('https://wa.me/5511918645151?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')});
renderEquipment();renderRooms();renderPreview();
