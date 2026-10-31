/* Live Craft Ver.6.2 / curated public archive index, backed by existing approved videos. */
(() => {
 'use strict';
 const C=window.LCContent,host=document.querySelector('[data-lc62-archives]');if(!host||!C)return;
 const text=(tag,cls,value)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(value!=null)e.textContent=String(value);return e;};
 const data=C.records('LIVE_CRAFT_VIDEOS').filter(v=>v.title&&C.https(v.url)).sort((a,b)=>Number(b.featured===true)-Number(a.featured===true)||String(b.date||'').localeCompare(String(a.date||'')));
 const search=document.querySelector('[data-lc62-archive-search]'),type=document.querySelector('[data-lc62-archive-type]');
 for(const category of [...new Set(data.map(v=>v.category).filter(Boolean))].sort()){const o=text('option','',category);o.value=category;type?.append(o);}
 function render(){const q=(search?.value||'').normalize('NFKC').toLowerCase().trim(),cat=type?.value||'all';const items=data.filter(x=>(cat==='all'||x.category===cat)&&[x.title,x.member,x.platform,x.category,x.description].join(' ').normalize('NFKC').toLowerCase().includes(q));host.replaceChildren();
  for(const v of items){const a=text('a','lc62-archive-card');a.href=C.https(v.url);a.target='_blank';a.rel='noopener noreferrer';const cover=text('div','lc62-archive-cover');const img=C.thumb(v.thumbnail);if(img){const im=text('img');im.src=img;im.alt='';im.loading='lazy';cover.append(im);}else cover.append(text('span','','▶'));const info=text('div','lc62-archive-info');info.append(text('small','',[v.category||'VIDEO',v.platform||'',v.member||''].filter(Boolean).join(' / ')),text('h3','',v.title));if(v.description)info.append(text('p','',String(v.description).slice(0,135)));info.append(text('small','','動画を開く ↗'));a.append(cover,info);host.append(a);}
  if(!items.length)host.append(text('p','lc62-empty',data.length?'一致する動画はありません。':'公開アーカイブは準備中です。公開済みのおすすめ動画が登録されると表示されます。'));
 }
 search?.addEventListener('input',render);type?.addEventListener('change',render);render();
})();
