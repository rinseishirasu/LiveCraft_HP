(() => {
'use strict';
const S=window.LCStream;if(!S)return;
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=String(text);return x;};
const t=(ja,en)=>S.t(ja,en);
const attach = (root, nodes) => root.replaceChildren(...nodes);
const imagePath = s => typeof s === 'string' && /^assets\/streams\/[a-zA-Z0-9_.-]+\.(webp|png|jpg|jpeg|avif)$/.test(s) ? s : '';
const span=(cls,txt)=>el('span',cls,txt);
const memberHref = m => window.LiveCraftMembers?.urlFor?.(m) || 'members.html';
function card(s, compact=false,at=S.now()) {
 const status=S.stateAt(s,at), item=el('article','lc5-stream-card'+(compact?' compact':'')+' '+status);
 const top=el('div','lc5-stream-top');const art=el('span','lc5-stream-avatar');
 const src=window.LiveCraftMembers?.safeProfileIcon?.(s.member);if(src){const img=el('img');img.src=src;img.alt='';img.loading='lazy';art.append(img);}else art.append(span('lc5-avatar-fallback','LC'));
 const name=el('a','lc5-stream-member',s.member.name);name.href=memberHref(s.member);
 const meta=el('div','lc5-stream-meta');meta.append(name,span('lc5-platform',String(s.platform||'Streaming').slice(0,30)));
 top.append(art,meta,span('lc5-stream-status status-'+status,S.stateLabel(status)));item.append(top);
 item.append(el('h3','lc5-stream-title',s.title.slice(0,130)));
 const when=el('p','lc5-stream-time',`${S.dateTime(s.startMs,S.lang())} – ${S.timeOnly(s.endMs,S.lang())} JST`);item.append(when);
 if(s.status==='scheduled'&&s.endMs>at&&window.LC6Calendar){const add=el('button','lc6-calendar-button',t('カレンダーに追加 ↓','Add to calendar ↓'));add.type='button';add.setAttribute('aria-label',t(`${s.member.name}の${s.title}をカレンダーに追加`, `Add ${s.member.name}'s ${s.title} to calendar`));add.addEventListener('click',()=>window.LC6Calendar.save([s],`live-craft-${s.id}.ics`));item.append(add);}
 if(typeof s.description==='string'&&s.description.trim()&&!compact)item.append(el('p','lc5-stream-desc',s.description.slice(0,180)));
 const thumb=imagePath(s.thumbnail);if(thumb&&!compact){const img=el('img','lc5-stream-thumb');img.src=thumb;img.loading='lazy';img.alt='';item.insertBefore(img,item.querySelector('.lc5-stream-title'));}
 if(s.streamUrl && status!=='cancelled' && status!=='postponed') { const a=el('a','lc5-stream-link',t('配信ページを開く ↗','Open stream ↗'));a.href=s.streamUrl;a.target='_blank';a.rel='noopener noreferrer';item.append(a); }
 if(['scheduled-live','finished'].includes(status))item.append(el('small','lc5-disclaimer',t('※実際の配信状況は未確認です','Schedule-based status, not verified')));
 return item;
}
function empty(title,desc){const b=el('div','lc5-empty');b.append(span('lc5-empty-icon','✦'),el('strong','',title),el('p','',desc));return b;}
const home=document.querySelector('[data-lc5-home-live]');
function renderHome(){if(!home)return;const at=S.now(),lives=S.plannedLive(at).slice(0,4),soon=S.next(at).slice(0,3);const title=document.querySelector('[data-lc5-live-caption]');
 if(title)title.textContent=lives.length?t('予定時刻内の配信','Within scheduled stream time'):t('次の配信予定','Upcoming streams');
 const chosen=lives.length?lives:soon;
 attach(home,chosen.length?chosen.map(s=>card(s,true,at)):[empty(t('現在、公開中の配信予定はありません。','No published streams yet.'),t('メンバーの予定が登録されると、ここに表示されます。','Schedules will appear here once added.'))]);
 const more=document.querySelector('[data-lc5-more-upcoming]');if(more)more.textContent=t('配信予定一覧を見る →','See all streams →');
}
const list=document.querySelector('[data-lc5-week-list]');let monday=S.startOfWeek();let selectedMember='all';let selectedPlatform='all';let favoritesOnly=false;
const platformFilter=document.querySelector('[data-lc6-schedule-platform]');
const favoritesFilter=document.querySelector('[data-lc6-schedule-favorites]');
const exportButton=document.querySelector('[data-lc6-week-export]');
const favorites=window.LC6Favorites;
// Deep-linkable week/member/platform/favorites view, all values validated against public records.
const scheduleParams=new URLSearchParams(location.search);
const requestedWeek=scheduleParams.get('week');
const validWeek=key=>/^\d{4}-\d{2}-\d{2}$/.test(key||'')&&Number.isFinite(S.keyToMS(key))&&S.dayKey(S.keyToMS(key))===key&&S.startOfWeek(S.keyToMS(key))===key;
if(list&&validWeek(requestedWeek))monday=requestedWeek;
if(list&&scheduleParams.get('fav')==='1')favoritesOnly=true;
const shareControl=document.querySelector('[data-lc6-share-schedule]');
const shareFeedback=document.querySelector('[data-lc6-share-feedback]');
const nextPanel=document.querySelector('[data-lc6-next-highlight]');
function viewUrl(){const u=new URL(location.href);u.search='';if(monday!==S.startOfWeek())u.searchParams.set('week',monday);if(selectedMember!=='all')u.searchParams.set('member',selectedMember);if(selectedPlatform!=='all')u.searchParams.set('platform',selectedPlatform);if(favoritesOnly)u.searchParams.set('fav','1');return u;}
function syncViewUrl(){if(!list)return;const u=viewUrl();try{history.replaceState(null,'',u.pathname+u.search+u.hash);}catch{}}
async function shareView(){const url=viewUrl().href;let ok=false;
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);ok=true;}}catch{}
 if(!ok){const box=document.createElement('textarea');box.value=url;box.style.position='fixed';box.style.opacity='0';document.body.append(box);box.select();try{ok=document.execCommand('copy');}catch{}box.remove();}
 if(shareFeedback)shareFeedback.textContent=ok?t('共有リンクをコピーしました','Link copied'):t('URLをコピーできませんでした。ブラウザーのアドレス欄から共有してください。','Use your browser address bar to share this view.');
}
function countdown(ms,at){const minutes=Math.max(0,Math.ceil((ms-at)/60000));if(minutes===0)return t('開始予定時刻です','Scheduled start time');if(minutes<60)return t(`あと ${minutes}分`,`In ${minutes} min`);const h=Math.floor(minutes/60),m=minutes%60;if(h<24)return t(`あと ${h}時間${m?m+'分':''}`,`In ${h}h${m?' '+m+'m':''}`);return t(`あと ${Math.floor(h/24)}日`,`In ${Math.floor(h/24)}d`);}
function renderNext(){if(!nextPanel)return;const at=S.now();const upcoming=S.next(at).filter(x=>x.status==='scheduled').slice(0,3);nextPanel.replaceChildren();
 if(!upcoming.length){nextPanel.append(el('p','lc6-next-empty',t('次の公開配信予定はまだありません。','No upcoming published streams yet.')));return;}
 for(const item of upcoming){const a=el('a','lc6-next-item');a.href=item.streamUrl||memberHref(item.member);if(item.streamUrl){a.target='_blank';a.rel='noopener noreferrer';}
  const star=el('span','lc6-next-symbol','✳');const info=el('span','lc6-next-info');info.append(el('strong','',item.title.slice(0,92)),el('span','',`${item.member.name} / ${item.platform||'Streaming'}`));const time=el('span','lc6-next-time');time.append(el('strong','',countdown(item.startMs,at)),el('small','',S.dateTime(item.startMs,S.lang())+' JST'));a.append(star,info,time);nextPanel.append(a);}
}

const weekItems=()=>{const weekEnd=S.addDays(monday,7);return S.plans.filter(s=>S.dayKey(s.startMs)>=monday&&S.dayKey(s.startMs)<weekEnd&&(selectedMember==='all'||s.memberId===selectedMember)&&(selectedPlatform==='all'||s.platform===selectedPlatform)&&(!favoritesOnly||favorites?.has(s.member)));};
function renderWeek(){if(!list)return;const at=S.now(),shown=weekItems();
 const current=S.todayJST(at), parts=[el('span','',`${S.fmt(S.keyToMS?S.keyToMS(monday):Date.parse(monday+'T00:00:00+09:00'),S.lang(),{month:'short',day:'numeric'})} – ${S.fmt(Date.parse(S.addDays(monday,6)+'T00:00:00+09:00'),S.lang(),{month:'short',day:'numeric',year:'numeric'})}`)];
 document.querySelector('[data-lc5-week-title]')?.replaceChildren(...parts);
 const weekdays=S.lang()==='en'?['Mon','Tue','Wed','Thu','Fri','Sat','Sun']:['月','火','水','木','金','土','日'];
 const nodes=[];
 for(let i=0;i<7;i++){
   const day=S.addDays(monday,i);const col=el('section','lc5-day'+(day===current?' today':''));const hd=el('div','lc5-day-heading');hd.append(span('lc5-day-date',`${day.slice(5).replace('-','/')} ${weekdays[i]}`));const dateStreams=shown.filter(s=>S.dayKey(s.startMs)===day);hd.append(span('lc5-day-count',dateStreams.length));col.append(hd);
   if(dateStreams.length)col.append(...dateStreams.map(s=>card(s,true,at)));else col.append(el('p','lc5-day-empty',t('公開予定なし','No streams')));
   nodes.push(col);
 }
 attach(list,nodes);
 const summary=document.querySelector('[data-lc5-summary]');if(summary)summary.textContent=t(`${shown.length}件の公開予定`,`${shown.length} scheduled stream(s)`);
 if(exportButton)exportButton.disabled=!shown.some(s=>s.status==='scheduled'&&s.endMs>at);
 if(favoritesFilter)favoritesFilter.setAttribute('aria-pressed',String(favoritesOnly));
}
if(list){
 if(platformFilter){for(const p of [...new Set(S.plans.map(s=>s.platform).filter(x=>typeof x==='string'&&x.trim()))].sort()){const option=el('option','',p);option.value=p;platformFilter.append(option);}if([...platformFilter.options].some(x=>x.value===scheduleParams.get('platform'))) {selectedPlatform=scheduleParams.get('platform');platformFilter.value=selectedPlatform;}platformFilter.addEventListener('change',()=>{selectedPlatform=platformFilter.value;syncViewUrl();renderWeek();});}
 favoritesFilter?.addEventListener('click',()=>{favoritesOnly=!favoritesOnly;syncViewUrl();renderWeek();});
 exportButton?.addEventListener('click',()=>{const future=weekItems().filter(s=>s.status==='scheduled'&&s.endMs>S.now());window.LC6Calendar?.save(future,`live-craft-${monday}.ics`);});
 const select=document.querySelector('[data-lc5-member-select]');if(select){for(const m of S.publicMembers()){if(!m.id)continue;const option=el('option','',m.name);option.value=m.id;select.append(option);}if([...select.options].some(x=>x.value===scheduleParams.get('member'))) {selectedMember=scheduleParams.get('member');select.value=selectedMember;}select.addEventListener('change',()=>{selectedMember=select.value;syncViewUrl();renderWeek();});}
 document.querySelector('[data-lc5-week-prev]')?.addEventListener('click',()=>{monday=S.addDays(monday,-7);syncViewUrl();renderWeek();});
 document.querySelector('[data-lc5-week-next]')?.addEventListener('click',()=>{monday=S.addDays(monday,7);syncViewUrl();renderWeek();});
 document.querySelector('[data-lc5-week-today]')?.addEventListener('click',()=>{monday=S.startOfWeek();syncViewUrl();renderWeek();});shareControl?.addEventListener('click',shareView);}
const profile=document.querySelector('[data-lc5-member-streams]');
function renderProfile(){if(!profile)return;const id=new URLSearchParams(location.search).get('id');const member=S.publicMembers().find(m=>window.LiveCraftMembers?.key(m)===id);const plans=member?S.memberStreams(member.id).slice(0,4):[];
 if(!member){profile.closest('section').hidden=true;return;}profile.closest('section').hidden=false;
 attach(profile,plans.length?plans.map(s=>card(s,true)):[empty(t('公開された次回配信予定はありません。','No upcoming streams published.'),t('予定が登録されるとここに表示されます。','New plans will appear here.'))]);}
const badges=document.querySelector('.page-members')?document.querySelector('#member-grid'):null;
function renderBadges(){if(!badges)return;const ids=new Set(S.plannedLive().map(s=>s.memberId));badges.querySelectorAll('.member-icon-button[data-lc5-member-id]').forEach(button=>{
 let badge=button.querySelector('.lc5-member-live-badge');const active=ids.has(button.dataset.lc5MemberId);
 if(active){if(!badge){badge=el('span','lc5-member-live-badge',t('LIVE予定','LIVE PLAN'));button.append(badge);}else badge.textContent=t('LIVE予定','LIVE PLAN');}
 else badge?.remove();});}
function render(){renderHome();renderNext();renderWeek();renderProfile();renderBadges();}
document.addEventListener('lc:streams-updated',render);document.addEventListener('lc:language-change',()=>{if(exportButton)exportButton.textContent=t('表示中の予定をカレンダーに保存 ↓','Export visible streams (.ics) ↓');if(favoritesFilter)favoritesFilter.textContent=t('★ お気に入りのみ','★ Favorites only');if(shareControl)shareControl.textContent=t('この表示条件を共有 ↗','Share this view ↗');if(shareFeedback)shareFeedback.textContent='';render();});
document.addEventListener('lc6:favorites-changed',renderWeek);
// Other scripts build the member list synchronously before this script runs.
render();
window.LCStreamWidgets={render,card};
})();
