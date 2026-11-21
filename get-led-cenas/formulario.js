'use strict';
const u = window.CenasUtil, $ = u.byId;
const hash = location.hash.startsWith('#p=') ? location.hash.slice(3) : '';
const raw = hash && hash.length < 4600 ? u.decode(hash) : null;
const fallback = {
  v: 1,
  title: 'Sua residência inteligente',
  welcome: 'Descubra cenas que se adaptam ao seu jeito de viver.',
  equipment: ['iluminacao', 'ar', 'persianas', 'tv', 'som', 'assistente'],
  rooms: ['Living / Sala', 'Sala de jantar', 'Suíte master', 'Corredor', 'Banheiro', 'Lavabo']
};
const valid = raw && raw.v === 1 && Array.isArray(raw.equipment) && raw.equipment.length <= 25 && Array.isArray(raw.rooms) && raw.rooms.length <= 16 && typeof raw.title === 'string' && raw.title.length <= 65 && typeof raw.welcome === 'string' && raw.welcome.length <= 250;
const config = valid ? {
  ...raw,
  equipment: raw.equipment.filter(x => typeof x === 'string' && CENAS_CATALOG.equipment.some(y => y.id === x)),
  rooms: raw.rooms.filter(x => typeof x === 'string' && CENAS_CATALOG.rooms.includes(x))
} : fallback;
const scenes = u.visible(config);
let selected = new Set(), active = scenes[0] || null, filter = 'Todas', query = '', limit = 6, isBefore = false, modalOpen = false, activeStop = 0, tourTimer = null;
let stageTimers = [];
const sessionKey = 'getled_cenas_selection_v04_' + hash.slice(0, 55).replace(/[^\w-]/g, '') + '_' + scenes.length;

try {
  const v = JSON.parse(localStorage.getItem(sessionKey) || 'null');
  if (v && Array.isArray(v.ids)) {
    selected = new Set(v.ids.filter(id => scenes.some(s => s.id === id)));
    $('notes').value = typeof v.notes === 'string' ? v.notes : '';
    $('customName').value = typeof v.customName === 'string' ? v.customName : '';
    $('customDescription').value = typeof v.customDescription === 'string' ? v.customDescription : '';
  }
} catch {}

$('title').textContent = config.title || 'Sua casa inteligente';
$('welcome').textContent = config.welcome || 'Explore experiências';
$('sceneTotal').textContent = scenes.length + ' cenas';
const recommended = new Set(['SC01', 'SC03', 'SC05', 'SC06', 'SC07', 'SC11', 'SC12', 'SC14']);
const ENV_LABEL = { living: 'Living / Sala', jantar: 'Sala de jantar', suite: 'Suíte', banho: 'Banheiro / Lavabo' };
const IMG = {
  living: 'assets/sala-premium.webp',
  livingNight: 'assets/living-noite.webp',
  jantar: 'assets/jantar-premium.webp',
  suite: 'assets/quarto-conceito.svg',
  banho: 'assets/banheiro-conceito.svg'
};
const TOUR_MAP = {
  living: [
    { id: 'overview', label: 'Visão geral', note: 'Leitura ampla do living e da varanda.', pos: '50% 52%', size: '114%', focus: { x: 51, y: 56, w: 64, h: 56 } },
    { id: 'lights', label: 'Perfis e pendentes', note: 'Transição da iluminação decorativa e indireta.', pos: '18% 26%', size: '156%', focus: { x: 21, y: 28, w: 31, h: 23 } },
    { id: 'window', label: 'Janela e persianas', note: 'Abertura e fechamento conforme a cena.', pos: '53% 45%', size: '150%', focus: { x: 53, y: 48, w: 38, h: 32 } },
    { id: 'media', label: 'TV e soundbar', note: 'Vídeo e áudio entram em destaque.', pos: '86% 43%', size: '160%', focus: { x: 86, y: 44, w: 20, h: 25 } },
    { id: 'dining', label: 'Mesa social', note: 'Camada de luz acolhedora para receber.', pos: '12% 54%', size: '154%', focus: { x: 16, y: 52, w: 26, h: 28 } }
  ],
  jantar: [
    { id: 'overview', label: 'Composição completa', note: 'Leitura geral da área de jantar.', pos: '50% 52%', size: '114%', focus: { x: 50, y: 56, w: 62, h: 54 } },
    { id: 'table', label: 'Mesa de jantar', note: 'Atenção na área principal de convivência.', pos: '49% 63%', size: '148%', focus: { x: 49, y: 60, w: 34, h: 26 } },
    { id: 'pendant', label: 'Pendente', note: 'Destaque do elemento cenográfico da cena.', pos: '50% 22%', size: '160%', focus: { x: 50, y: 24, w: 18, h: 22 } },
    { id: 'support', label: 'Apoio lateral', note: 'Luz auxiliar e ambientação do espaço.', pos: '82% 48%', size: '154%', focus: { x: 80, y: 45, w: 19, h: 28 } }
  ],
  suite: [
    { id: 'overview', label: 'Vista da suíte', note: 'Composição ampla do descanso.', pos: '50% 52%', size: '112%', focus: { x: 50, y: 55, w: 60, h: 52 } },
    { id: 'bed', label: 'Leitura / cabeceira', note: 'Foco da cena de leitura ou relaxamento.', pos: '44% 56%', size: '144%', focus: { x: 44, y: 57, w: 34, h: 28 } },
    { id: 'window', label: 'Blackout e janela', note: 'Integração com cortina ou persiana.', pos: '78% 48%', size: '150%', focus: { x: 76, y: 46, w: 22, h: 36 } },
    { id: 'comfort', label: 'Conforto térmico', note: 'Leitura de conforto para climatização.', pos: '62% 28%', size: '156%', focus: { x: 64, y: 26, w: 18, h: 18 } }
  ],
  banho: [
    { id: 'overview', label: 'Visão geral', note: 'Leitura ampla do ambiente de banho.', pos: '50% 52%', size: '112%', focus: { x: 50, y: 56, w: 60, h: 54 } },
    { id: 'mirror', label: 'Espelho e bancada', note: 'Realce da luz funcional do espelho.', pos: '44% 38%', size: '150%', focus: { x: 44, y: 38, w: 28, h: 22 } },
    { id: 'shower', label: 'Área de banho', note: 'Clima do banho conforto.', pos: '78% 54%', size: '150%', focus: { x: 76, y: 55, w: 24, h: 30 } },
    { id: 'ambient', label: 'Iluminação de apoio', note: 'Detalhes de conforto e ambientação.', pos: '24% 58%', size: '152%', focus: { x: 26, y: 58, w: 22, h: 26 } }
  ]
};

function sceneEnv(s) {
  const r = (s.rooms || []).join(' ').toLocaleLowerCase('pt-BR');
  const cat = (s.cat || '').toLocaleLowerCase('pt-BR');
  const name = s.name.toLocaleLowerCase('pt-BR');
  if (r.includes('banheiro') || r.includes('lavabo') || cat.includes('banho')) return 'banho';
  if (r.includes('suíte') || r.includes('quarto') || name.includes('dormir') || name.includes('despertar') || name.includes('leitura')) return 'suite';
  if (name.includes('jantar') || r.includes('jantar')) return 'jantar';
  return 'living';
}
function imgPath(s, before = false) {
  const env = sceneEnv(s);
  if (env === 'living' && !before && ['cinema', 'noite'].includes(mood(s))) return IMG.livingNight;
  return IMG[env] || IMG.living;
}
function mood(s) {
  return ['cinema', 'jantar', 'noite', 'manha', 'leitura', 'banho'].includes(s.visual) ? s.visual : 'manha';
}
function hasShadeSupport() {
  return config.equipment.includes('persianas') || config.equipment.includes('cortina');
}
function studioState(s, before = false) {
  const m = mood(s), isDark = ['cinema', 'noite'].includes(m), hasShade = hasShadeSupport();
  const showShade = !before && isDark && hasShade && sceneEnv(s) !== 'banho';
  const showTv = !before && config.equipment.includes('tv') && s.needs.includes('tv');
  return { m: before ? 'manha' : m, showShade, showTv, env: sceneEnv(s) };
}
function getStops(s) {
  return TOUR_MAP[sceneEnv(s)] || TOUR_MAP.living;
}
function defaultStopIndex(s) {
  const stops = getStops(s);
  const desired = mood(s) === 'cinema' ? 'media' : mood(s) === 'jantar' ? 'dining' : mood(s) === 'leitura' ? 'bed' : mood(s) === 'banho' ? 'mirror' : (hasShadeSupport() && ['noite', 'manha'].includes(mood(s)) ? 'window' : 'overview');
  const idx = stops.findIndex(stop => stop.id === desired);
  return idx >= 0 ? idx : 0;
}
function deviceStateSummary(s, before = isBefore) {
  const currentMood = before ? 'manha' : mood(s);
  const hasShade = hasShadeSupport() && sceneEnv(s) !== 'banho';
  const hasTV = config.equipment.includes('tv') && s.needs.includes('tv');
  const hasAudio = config.equipment.includes('som') && (s.needs.includes('som') || s.needs.includes('tv') || currentMood === 'jantar');
  const light = before ? 'Base do ambiente' : currentMood === 'cinema' ? 'Indireta / cinema' : currentMood === 'jantar' ? 'Social / decorativa' : currentMood === 'noite' ? 'Apoio / noturna' : currentMood === 'leitura' ? 'Foco / leitura' : currentMood === 'banho' ? 'Banho / espelho' : 'Conforto / dia';
  const blind = !hasShade ? 'Sem integração' : before ? 'Abertas' : ['cinema', 'noite'].includes(mood(s)) ? 'Fechadas' : 'Abertas';
  const media = !hasTV ? 'Sem alteração' : before ? 'Em espera' : 'TV ligada';
  const audio = !hasAudio ? 'Opcional' : before ? 'Standby' : (s.needs.includes('tv') ? 'Soundbar ativa' : 'Som ambiente');
  const chips = [
    { label: 'Iluminação', value: light },
    { label: 'Ambiente', value: (getStops(s)[activeStop] || getStops(s)[0]).label }
  ];
  if (hasShade) chips.push({ label: 'Persianas', value: blind });
  if (hasTV) chips.push({ label: 'Vídeo', value: media });
  if (hasAudio) chips.push({ label: 'Áudio', value: audio });
  return { light, blind, media, audio, chips };
}
function applyStage(el, s, before = false, stop = null) {
  if (!el || !s) return;
  const d = studioState(s, before);
  const point = stop || getStops(s)[0];
  const baseClass = el.id === 'modalVisual' ? 'sim-modal-visual' : 'studio';
  el.className = baseClass + ' ' + d.m + (d.showShade ? ' closed' : '') + (d.showTv ? ' media-on' : '') + ' env-' + d.env;
  el.style.setProperty('--scene-image', `url("${imgPath(s, before)}")`);
  el.style.setProperty('--bg-pos', point.pos || '50% 52%');
  el.style.setProperty('--bg-size', point.size || '116%');
  el.setAttribute('aria-label', `Simulação ilustrativa de ${s.name}. Ambiente de referência ${ENV_LABEL[d.env] || d.env}. Não representa instalação real.`);
}
function applyAllStages() {
  if (!active) return;
  const point = getStops(active)[activeStop] || getStops(active)[0];
  applyStage($('studio'), active, isBefore, point);
  if (modalOpen) applyStage($('modalVisual'), active, isBefore, point);
  updateFocus(point);
  updateMainState();
  if (modalOpen) {
    updateDeviceChips();
    updateModalStateGrid();
  }
}
function updateMainState() {
  if (!active) return;
  const status = deviceStateSummary(active, isBefore);
  $('simName').textContent = active.name;
  $('simDesc').textContent = active.desc;
  $('stateLight').textContent = status.light;
  $('stateBlind').textContent = status.blind;
  $('stateMedia').textContent = status.media === 'Sem alteração' ? 'Sem alteração' : status.media;
  $('chooseSim').textContent = selected.has(active.id) ? '✓ Cena selecionada' : '+ Quero esta cena';
  $('simFilters').querySelectorAll('button').forEach(b => {
    const on = b.dataset.scene === active.id;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  syncBefore();
}
function updateFocus(point) {
  const halo = $('focusHalo');
  if (!point || !halo) return;
  halo.style.left = point.focus.x + '%';
  halo.style.top = point.focus.y + '%';
  halo.style.width = point.focus.w + '%';
  halo.style.height = point.focus.h + '%';
  $('focusLabel').textContent = point.label + ' · ' + point.note;
  if ($('tourCounter') && active) $('tourCounter').textContent = `${activeStop + 1} / ${getStops(active).length}`;
}
function updateDeviceChips() {
  if (!modalOpen || !active) return;
  const status = deviceStateSummary(active, isBefore);
  $('modalDeviceChips').innerHTML = status.chips.map((chip, i) => `<span class="device-chip" style="--i:${i}"><small>${u.text(chip.label)}</small>${u.text(chip.value)}</span>`).join('');
}
function updateModalStateGrid() {
  if (!active) return;
  const status = deviceStateSummary(active, isBefore);
  $('modalStateLight').textContent = status.light;
  $('modalStateBlind').textContent = status.blind;
  $('modalStateMedia').textContent = status.media;
  $('modalStateAudio').textContent = status.audio;
}
function syncBefore() {
  $('beforeAfter').textContent = isBefore ? '◐ Ver depois' : '◐ Ver antes';
  $('beforeAfter').setAttribute('aria-pressed', String(isBefore));
  if ($('modalBeforeAfter')) $('modalBeforeAfter').textContent = $('beforeAfter').textContent;
}
function eligibleOptions(s) {
  return (s.optional || []).filter(id => config.equipment.includes(id)).map(id => CENAS_CATALOG.equipment.find(x => x.id === id)?.name).filter(Boolean);
}
function stopTour(silent = true) {
  if (tourTimer) {
    clearInterval(tourTimer);
    tourTimer = null;
    if (!silent) u.toast('Visita do ambiente encerrada');
  }
  if ($('modalVisitToggle')) {
    $('modalVisitToggle').textContent = '◈ Visitar ambiente';
    $('modalVisitToggle').classList.remove('active');
  }
}
function clearStageTimers() {
  stageTimers.forEach(clearTimeout);
  stageTimers = [];
  $('modalVisual')?.classList.remove('sequence-live');
  $('studio')?.classList.remove('sequence-live');
}
function setActiveStop(index, manual = false) {
  if (!active) return;
  const stops = getStops(active);
  if (!stops.length) return;
  if (manual) stopTour();
  activeStop = (index + stops.length) % stops.length;
  applyAllStages();
  if (modalOpen) updateTourUI();
}
function startTour() {
  if (!active) return;
  stopTour();
  $('modalVisitToggle').textContent = '■ Encerrar visita';
  $('modalVisitToggle').classList.add('active');
  tourTimer = setInterval(() => setActiveStop(activeStop + 1), 2600);
  u.toast('Visita do ambiente iniciada');
}
function toggleTour() {
  if (tourTimer) stopTour(false); else startTour();
}
function playSceneSequence() {
  if (!active) return;
  stopTour();
  clearStageTimers();
  isBefore = true;
  applyAllStages();
  syncBefore();
  if ($('modalVisual')) {
    $('modalVisual').classList.remove('sequence-live');
    void $('modalVisual').offsetWidth;
    $('modalVisual').classList.add('sequence-live');
  }
  if ($('studio')) {
    $('studio').classList.remove('sequence-live');
    void $('studio').offsetWidth;
    $('studio').classList.add('sequence-live');
  }
  stageTimers.push(setTimeout(() => {
    isBefore = false;
    applyAllStages();
    syncBefore();
  }, 450));
  stageTimers.push(setTimeout(() => {
    $('modalVisual')?.classList.remove('sequence-live');
    $('studio')?.classList.remove('sequence-live');
  }, 2300));
}
function simulate(s, opts = {}) {
  if (!s) return;
  active = s;
  if (!opts.keepStop) activeStop = defaultStopIndex(s);
  stopTour();
  isBefore = false;
  applyAllStages();
  if (modalOpen) updateModal();
}
function filteredScenes() {
  return scenes.filter(s => (filter === 'Todas' || s.cat === filter) && (s.name + ' ' + s.desc + ' ' + s.cat + ' ' + s.rooms.join(' ')).toLocaleLowerCase('pt-BR').includes(query));
}
function scenePool() {
  const filtered = filteredScenes();
  return filtered.length ? filtered : scenes;
}
function changeScene(step) {
  const pool = scenePool();
  if (!pool.length || !active) return;
  let idx = pool.findIndex(s => s.id === active.id);
  if (idx < 0) idx = 0;
  idx = (idx + step + pool.length) % pool.length;
  simulate(pool[idx]);
  if (modalOpen) playSceneSequence();
}
function updateTourUI() {
  if (!active) return;
  const stops = getStops(active);
  $('tourStops').innerHTML = stops.map((stop, index) => `<button type="button" class="tour-stop ${index === activeStop ? 'active' : ''}" data-stop="${index}"><span>${u.text(stop.label)}</span><small>${u.text(stop.note)}</small></button>`).join('');
  $('tourStops').querySelectorAll('[data-stop]').forEach(btn => btn.addEventListener('click', () => setActiveStop(Number(btn.dataset.stop), true)));
  $('tourCounter').textContent = `${activeStop + 1} / ${stops.length}`;
}
function updateModal() {
  if (!active) return;
  $('modalTitle').textContent = active.name;
  $('modalSceneTitle').textContent = active.name;
  $('modalSubtitle').textContent = `${ENV_LABEL[sceneEnv(active)] || 'Ambiente'} · melhor experiência em paisagem`;
  $('modalDetails').textContent = active.desc;
  $('modalChoose').textContent = selected.has(active.id) ? '✓ Cena selecionada' : '+ Escolher cena';
  applyAllStages();
  updateTourUI();
  updateModalStateGrid();
  syncBefore();
}

const featured = scenes.filter(s => ['SC01', 'SC03', 'SC06', 'SC07', 'SC11', 'SC12', 'SC17', 'SC19'].includes(s.id)).slice(0, 6);
if (!featured.length) featured.push(...scenes.slice(0, 6));
$('simFilters').innerHTML = featured.map(s => `<button type="button" class="sim-choice" data-scene="${u.text(s.id)}">${u.text(s.name)}</button>`).join('');
$('simFilters').querySelectorAll('button').forEach(b => b.addEventListener('click', () => simulate(u.byScene(b.dataset.scene))));

$('beforeAfter').addEventListener('click', () => {
  if (!active) return;
  stopTour();
  isBefore = !isBefore;
  applyAllStages();
  syncBefore();
});

const cats = ['Todas', ...new Set(scenes.map(s => s.cat))];
$('filters').innerHTML = cats.map(cat => `<button type="button" class="filter ${cat === 'Todas' ? 'active' : ''}" aria-pressed="${cat === 'Todas'}" data-cat="${u.text(cat)}">${u.text(cat)}</button>`).join('');
$('filters').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
  filter = b.dataset.cat;
  limit = 6;
  $('filters').querySelectorAll('button').forEach(x => {
    const on = x === b;
    x.classList.toggle('active', on);
    x.setAttribute('aria-pressed', String(on));
  });
  renderCatalog();
}));

$('clientSceneSearch').addEventListener('input', e => {
  query = e.target.value.trim().toLocaleLowerCase('pt-BR');
  limit = 6;
  renderCatalog();
});
$('loadMore').addEventListener('click', () => { limit += 6; renderCatalog(); });

function renderCarousel(cards) {
  const track = $('sceneCarousel');
  track.innerHTML = cards.map(s => `<article class="scene-immersive-card" data-card="${u.text(s.id)}"><button type="button" class="scene-picture" style="--card-image:url('${imgPath(s, false)}')" data-view="${u.text(s.id)}" aria-label="Visualizar ${u.text(s.name)} em tela cheia"><span class="card-picture-gradient"></span><span class="card-picture-tag">${u.text((s.rooms || [])[0] || 'RESIDÊNCIA')}</span><span class="card-picture-expand">⛶ Ampliar</span></button><div class="scene-feature-body"><div class="tile-header"><span class="scene-id">${u.text(s.id)}</span><span class="cat-chip">${u.text(s.cat)}</span></div><h3>${u.text(s.name)}</h3><p>${u.text(s.desc)}</p><button type="button" class="button ${selected.has(s.id) ? 'primary' : 'outline'}" data-choose="${u.text(s.id)}">${selected.has(s.id) ? '✓ Selecionada' : '+ Escolher cena'}</button></div></article>`).join('');
  track.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => {
    simulate(u.byScene(b.dataset.view));
    openModal();
    playSceneSequence();
  }));
  track.querySelectorAll('[data-choose]').forEach(b => b.addEventListener('click', () => toggle(b.dataset.choose)));
  $('carouselPrev').disabled = cards.length === 0;
  $('carouselNext').disabled = cards.length === 0;
  updateCarouselPosition();
}
function updateCarouselPosition() {
  const track = $('sceneCarousel');
  const cards = [...track.children];
  if (!cards.length) {
    $('carouselPosition').textContent = '0 / 0';
    $('carouselDots').innerHTML = '';
    return;
  }
  const current = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / (cards[0].getBoundingClientRect().width + 14))));
  $('carouselPosition').textContent = `${current + 1} / ${cards.length}`;
  $('carouselPrev').disabled = current === 0;
  $('carouselNext').disabled = current >= cards.length - 1;
  const start = Math.max(0, Math.min(current - 2, cards.length - 5));
  $('carouselDots').innerHTML = Array.from({ length: Math.min(5, cards.length) }, (_, i) => `<button type="button" data-index="${start + i}" class="${start + i === current ? 'active' : ''}" aria-label="Ir para cena ${start + i + 1}"></button>`).join('');
  $('carouselDots').querySelectorAll('button').forEach(b => b.addEventListener('click', () => scrollToCard(Number(b.dataset.index))));
}
function scrollToCard(index) {
  const track = $('sceneCarousel');
  const cards = track.children;
  if (!cards.length) return;
  index = Math.max(0, Math.min(index, cards.length - 1));
  cards[index].scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
}
$('carouselPrev').onclick = () => {
  const cards = $('sceneCarousel').children;
  let curr = [...cards].reduce((best, el, i, arr) => Math.abs(el.getBoundingClientRect().left - $('sceneCarousel').getBoundingClientRect().left) < Math.abs(arr[best].getBoundingClientRect().left - $('sceneCarousel').getBoundingClientRect().left) ? i : best, 0);
  scrollToCard(curr - 1);
};
$('carouselNext').onclick = () => {
  const cards = $('sceneCarousel').children;
  let curr = [...cards].reduce((best, el, i, arr) => Math.abs(el.getBoundingClientRect().left - $('sceneCarousel').getBoundingClientRect().left) < Math.abs(arr[best].getBoundingClientRect().left - $('sceneCarousel').getBoundingClientRect().left) ? i : best, 0);
  scrollToCard(curr + 1);
};
let carouselTick = null;
$('sceneCarousel').addEventListener('scroll', () => {
  cancelAnimationFrame(carouselTick);
  carouselTick = requestAnimationFrame(updateCarouselPosition);
}, { passive: true });

function renderCatalog() {
  const filtered = filteredScenes();
  $('visibleMeta').textContent = filtered.length + ' opções';
  renderCarousel(filtered);
  $('sceneGrid').innerHTML = filtered.slice(0, limit).map(s => {
    const extra = eligibleOptions(s);
    return `<article class="scene-card ${selected.has(s.id) ? 'selected' : ''}"><div class="tile-header"><span class="scene-id">${u.text(s.id)}</span><span class="cat-chip">${u.text(s.cat)} ${recommended.has(s.id) ? '✦' : ''}</span></div><h3>${u.text(s.name)}</h3><p>${u.text(s.desc)}</p>${extra.length ? `<div class="scene-optional">Com seus recursos: ${u.text(extra.slice(0, 2).join(' · '))}</div>` : ''}<button type="button" class="button ${selected.has(s.id) ? 'primary' : 'outline'}" aria-pressed="${selected.has(s.id)}" data-choose="${u.text(s.id)}">${selected.has(s.id) ? '✓ Selecionada' : '+ Escolher esta cena'}</button></article>`;
  }).join('');
  $('sceneGrid').querySelectorAll('[data-choose]').forEach(b => b.addEventListener('click', () => toggle(b.dataset.choose)));
  $('loadMore').classList.toggle('hidden', filtered.length <= limit);
  $('catalogEmpty').classList.toggle('hidden', filtered.length !== 0);
}
function renderChoices() {
  $('topCount').textContent = selected.size;
  $('choiceCount').textContent = selected.size ? `${selected.size} ${selected.size === 1 ? 'cena escolhida' : 'cenas escolhidas'}` : 'Minhas cenas';
  $('dockCount').textContent = selected.size + ' ' + (selected.size === 1 ? 'cena escolhida' : 'cenas escolhidas');
  $('choiceList').innerHTML = selected.size ? [...selected].sort().map(id => {
    const s = u.byScene(id);
    return `<div class="line-item"><div><strong><span style="color:var(--mint)">${u.text(id)}</span> · ${u.text(s.name)}</strong><small>${u.text(s.cat)}</small></div><button class="button outline" type="button" data-remove="${u.text(id)}">Remover</button></div>`;
  }).join('') : '<div class="empty">Escolha suas cenas no catálogo ou na simulação. Elas aparecerão aqui.</div>';
  $('choiceList').querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => toggle(b.dataset.remove)));
  if (active) $('chooseSim').textContent = selected.has(active.id) ? '✓ Cena selecionada' : '+ Quero esta cena';
  if ($('modalChoose')) $('modalChoose').textContent = selected.has(active?.id) ? '✓ Cena selecionada' : '+ Escolher cena';
}
function persist() {
  try {
    localStorage.setItem(sessionKey, JSON.stringify({
      ids: [...selected],
      notes: $('notes').value,
      customName: $('customName').value,
      customDescription: $('customDescription').value,
      customRoom: $('customRoom').value
    }));
  } catch {}
}
function toggle(id) {
  if (!scenes.some(s => s.id === id)) return;
  if (selected.has(id)) {
    selected.delete(id);
    u.toast('Cena removida das suas escolhas');
  } else {
    selected.add(id);
    u.toast('Cena adicionada às suas escolhas');
  }
  persist();
  renderCatalog();
  renderChoices();
}
$('chooseSim').addEventListener('click', () => active && toggle(active.id));
function customValid() {
  const name = $('customName').value.trim(), desc = $('customDescription').value.trim();
  if ((name && !desc) || (!name && desc)) {
    u.toast('Para sugerir uma cena, informe o nome e a descrição.');
    return false;
  }
  return true;
}
function summary() {
  const customName = $('customName').value.trim(), customDesc = $('customDescription').value.trim();
  let out = `GET LED CENAS — MINHAS ESCOLHAS\n\n${[...selected].sort().map(id => `${id} — ${u.byScene(id).name}`).join('\n') || 'Nenhuma cena do catálogo selecionada.'}`;
  if (customName && customDesc) out += `\n\nMINHA CENA PERSONALIZADA\nNome: ${customName}\nAmbiente: ${$('customRoom').value || 'A definir'}\nDescrição: ${customDesc}`;
  return out + `\n\nOUTRAS OBSERVAÇÕES:\n${$('notes').value.trim() || 'Sem observações.'}\n\nPré-seleção sujeita à análise técnica e confirmação pela Get Led.`;
}
function canSend() {
  if (!selected.size && !($('customName').value.trim() && $('customDescription').value.trim())) {
    u.toast('Escolha uma cena ou descreva a sua.');
    return false;
  }
  return customValid();
}
$('copy').addEventListener('click', async () => {
  if (!canSend()) return;
  try {
    await navigator.clipboard.writeText(summary());
    u.toast('Resumo copiado');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = summary();
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    u.toast('Resumo preparado para copiar');
  }
});
$('send').addEventListener('click', () => {
  if (!canSend()) return;
  window.open('https://wa.me/5511918645151?text=' + encodeURIComponent(summary()), '_blank', 'noopener,noreferrer');
});
for (const id of ['notes', 'customName', 'customDescription', 'customRoom']) $(id).addEventListener('input', persist);
$('customRoom').innerHTML = '<option value="">Escolha um ambiente (opcional)</option>' + config.rooms.map(r => `<option value="${u.text(r)}">${u.text(r)}</option>`).join('');
try {
  const v = JSON.parse(localStorage.getItem(sessionKey) || 'null');
  if (config.rooms.includes(v?.customRoom)) $('customRoom').value = v.customRoom;
} catch {}

function openModal() {
  if (!active) return;
  modalOpen = true;
  $('simModal').classList.remove('hidden');
  document.body.classList.add('modal-open');
  updateModal();
  $('modalClose').focus();
}
function closeModal() {
  modalOpen = false;
  stopTour();
  clearStageTimers();
  $('simModal').classList.add('hidden');
  document.body.classList.remove('modal-open');
  $('fullscreenSim').focus();
}

$('fullscreenSim').addEventListener('click', openModal);
$('modalClose').addEventListener('click', closeModal);
$('modalBeforeAfter').addEventListener('click', () => {
  stopTour();
  isBefore = !isBefore;
  applyAllStages();
  syncBefore();
});
$('modalPlayScene').addEventListener('click', playSceneSequence);
$('modalVisitToggle').addEventListener('click', toggleTour);
$('tourPrev').addEventListener('click', () => setActiveStop(activeStop - 1, true));
$('tourNext').addEventListener('click', () => setActiveStop(activeStop + 1, true));
$('modalChoose').addEventListener('click', () => active && toggle(active.id));
$('modalPrevScene').addEventListener('click', () => changeScene(-1));
$('modalNextScene').addEventListener('click', () => changeScene(1));
$('modalPrevSceneOverlay').addEventListener('click', () => changeScene(-1));
$('modalNextSceneOverlay').addEventListener('click', () => changeScene(1));
$('simModal').addEventListener('click', e => { if (e.target === $('simModal')) closeModal(); });
document.addEventListener('keydown', e => {
  if (!modalOpen) return;
  if (e.key === 'Escape') closeModal();
  else if (e.key === 'ArrowRight') changeScene(1);
  else if (e.key === 'ArrowLeft') changeScene(-1);
  else if (e.key === 'ArrowUp') setActiveStop(activeStop - 1, true);
  else if (e.key === 'ArrowDown') setActiveStop(activeStop + 1, true);
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stopTour(); });

if (active) {
  simulate(active);
} else {
  $('simName').textContent = 'Nenhuma cena disponível';
  $('simDesc').textContent = 'Solicite à Get Led a revisão das opções deste formulário.';
  $('chooseSim').disabled = true;
  $('beforeAfter').disabled = true;
  $('fullscreenSim').disabled = true;
}
renderCatalog();
renderChoices();
