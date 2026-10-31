/* Shared content helpers, text-safe and appropriate for public, approved information only. */
window.LCContent = (() => {
  const create = (tag, cls, value) => { const el = document.createElement(tag); if(cls) el.className=cls; if(value != null) el.textContent=String(value); return el; };
  const https = value => {try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch{return null;}};
  const thumb = p => typeof p==='string' && /^assets\/(?:news|videos|events|collabs|projects)\/[a-zA-Z0-9_.-]+\.(?:webp|png|jpg|jpeg|avif)$/.test(p) ? p:null;
  const live = entry => entry && entry.published===true && (!entry.publishAt || (Number.isFinite(Date.parse(entry.publishAt)) && Date.now()>=Date.parse(entry.publishAt)));
  const records = key => (Array.isArray(window[key])?window[key]:[]).filter(live);
  const date = iso => /^\d{4}-\d{2}-\d{2}$/.test(iso||'') ? iso.replaceAll('-','.') : '';
  const empty = (el,heading,sub) => { if(!el) return; el.replaceChildren(); const w=create('div','lc44-empty'); w.append(create('span','lc44-empty-symbol','✦'),create('h3','',heading),create('p','',sub));el.append(w); };
  const image = (src,alt='') => {let p=thumb(src); if(!p) return create('span','lc44-placeholder','✳');const img=create('img','lc44-cover');img.src=p;img.alt=alt;img.loading='lazy';img.decoding='async';img.onerror=()=>{img.replaceWith(create('span','lc44-placeholder','✳'));};return img;};
  return Object.freeze({create,https,thumb,live,records,date,empty,image});
})();
