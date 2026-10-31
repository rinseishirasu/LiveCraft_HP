/* Ver.6.0: related published activities for a member, no extra data entry required. */
(() => {
 'use strict';
 const root=document.querySelector('[data-lc6-member-activities]');if(!root||!window.LiveCraftMembers||!window.LCContent)return;
 const M=window.LiveCraftMembers,C=window.LCContent;
 const memberId=new URLSearchParams(location.search).get('id');
 const m=M.publicMembers().find(x=>M.key(x)===memberId);if(!m){root.closest('section').hidden=true;return;}
 const names=[m.name,m.id].filter(Boolean).map(s=>String(s).trim().normalize('NFKC').toLowerCase());
 function attached(x){return [x.member,x.memberId,...(Array.isArray(x.members)?x.members:[]),...(Array.isArray(x.memberIds)?x.memberIds:[])].some(v=>typeof v==='string'&&names.includes(v.trim().normalize('NFKC').toLowerCase()));}
 const safeId=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9-]{0,63}$/.test(x);
 const spec=[['LIVE_CRAFT_NEWS','NEWS','news.html'],['LIVE_CRAFT_VIDEOS','VIDEO','videos.html'],['LIVE_CRAFT_EVENTS','EVENT','events.html'],['LIVE_CRAFT_COLLABS','COLLAB','collabs.html']];
 const entries=spec.flatMap(([key,type,fallback])=>C.records(key).filter(x=>x.title&&attached(x)).map(x=>({type,title:x.title,date:x.date||'',description:x.summary||x.description||'',url:type==='NEWS'&&safeId(x.id)?'news-article.html?id='+encodeURIComponent(x.id):C.https(x.url)||fallback}))).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8);
 function render(){root.replaceChildren();const en=window.LC_I18N?.lang?.()==='en';const section=root.closest('section');if(!entries.length){section.hidden=true;return;}section.hidden=false;
  for(const x of entries){const a=document.createElement('a');a.className='lc6-activity-item';a.href=x.url;if(/^https:\/\//.test(a.href)&&new URL(a.href).origin!==location.origin){a.target='_blank';a.rel='noopener noreferrer';}const top=document.createElement('span');top.className='lc6-activity-meta';top.textContent=x.type+(x.date?' / '+x.date:'');const h=document.createElement('strong');h.textContent=x.title;const p=document.createElement('span');p.className='lc6-activity-desc';p.textContent=x.description.slice(0,150);const mark=document.createElement('span');mark.className='lc6-activity-arrow';mark.textContent='↗';a.append(top,h,p,mark);root.append(a);}
  const label=section.querySelector('[data-lc6-activity-heading]');if(label)label.textContent=en?'Related activities':'このメンバーの活動';
 }
 document.addEventListener('lc:language-change',render);render();
})();
