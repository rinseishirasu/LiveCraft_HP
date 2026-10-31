/* Live Craft 6.0 / browser-local favorites. No account or server tracking. */
(() => {
 'use strict';
 const KEY='livecraft:favorites:v1';
 const valid=value=>typeof value==='string'&&value.length>0&&value.length<300;
 function read(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return new Set(Array.isArray(a)?a.filter(valid).slice(0,250):[]);}catch{return new Set();}}
 let saved=read();
 const key=member=>typeof member==='string'?member:window.LiveCraftMembers?.key?.(member) || '';
 const has=member=>saved.has(key(member));
 const lang=()=>window.LC_I18N?.lang?.()==='en'?'en':'ja';
 function updateButtons(){document.querySelectorAll('[data-lc6-favorite-key]').forEach(b=>{
   const on=saved.has(b.dataset.lc6FavoriteKey);const name=b.dataset.lc6FavoriteName||'';
   b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',lang()==='en'?`${on?'Remove':'Add'} ${name} ${on?'from':'to'} favorites`:`${name}をお気に入り${on?'から解除':'に登録'}`);
   const icon=b.querySelector('.lc6-favorite-icon');const text=b.querySelector('.lc6-favorite-text');if(icon)icon.textContent=on?'★':'☆';if(text)text.textContent=lang()==='en'?(on?'Saved':'Favorite'):(on?'保存済み':'お気に入り');
 });}
 function changed(){updateButtons();document.dispatchEvent(new CustomEvent('lc6:favorites-changed',{detail:{ids:[...saved]}}));}
 function toggle(member){const id=key(member);if(!valid(id))return false;if(saved.has(id))saved.delete(id);else if(saved.size<250)saved.add(id);else return false;
   try{localStorage.setItem(KEY,JSON.stringify([...saved]));}catch{} changed();return saved.has(id);}
 function createButton(member,extraClass=''){const id=key(member);const b=document.createElement('button');b.type='button';b.className=`lc6-favorite-button ${extraClass}`.trim();b.dataset.lc6FavoriteKey=id;b.dataset.lc6FavoriteName=member?.name||'';
  const icon=document.createElement('span');icon.className='lc6-favorite-icon';icon.setAttribute('aria-hidden','true');const text=document.createElement('span');text.className='lc6-favorite-text';b.append(icon,text);
  b.addEventListener('click',e=>{e.stopPropagation();const hadFocus=document.activeElement===b;toggle(member);if(hadFocus&&!b.isConnected){const replacement=[...document.querySelectorAll('[data-lc6-favorite-key]')].find(x=>x.dataset.lc6FavoriteKey===id&&x.classList.contains('lc6-favorite-in-card'));replacement?.focus({preventScroll:true});}});return b;}
 const api=Object.freeze({key,has,toggle,createButton,count:members=>members.filter(has).length,ids:()=>[...saved],updateButtons});
 window.LC6Favorites=api;
 document.addEventListener('lc:language-change',updateButtons);
 window.addEventListener('storage',e=>{if(e.key===KEY){saved=read();changed();}});
})();
