/* Helpers for a static, demonstration-only prototype.
 * Production must not use URL parameters as an authorization mechanism. */
window.CenasUtil={
  byId(id){return document.getElementById(id)},
  encode(data){return btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(data)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')},
  decode(value){try{const base=value.replace(/-/g,'+').replace(/_/g,'/');const b=atob(base);return JSON.parse(new TextDecoder().decode(Uint8Array.from(b,x=>x.charCodeAt(0))))}catch{return null}},
  text(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))},
  byScene(id){return CENAS_CATALOG.scenes.find(s=>s.id===id)},
  visible(config){const eq=new Set(config.equipment||[]),rooms=new Set(config.rooms||[]);return CENAS_CATALOG.scenes.filter(s=>s.needs.every(x=>eq.has(x))&&(!s.rooms.length||s.rooms.some(x=>rooms.has(x))))},
  toast(msg){let el=this.byId('toast');if(!el)return;el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2100)}
};
