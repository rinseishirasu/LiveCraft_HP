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
 const src=window.LiveCraftMembers?.safeAvatar?.(s.member.avatar);if(src){const img=el('img');img.src=src;img.alt='';img.loading='lazy';art.append(img);}else art.append(span('lc5-avatar-fallback','LC'));
 const name=el('a','lc5-stream-member',s.member.name);name.href=memberHref(s.member);
 const meta=el('div','lc5-stream-meta');meta.append(name,span('lc5-platform',String(s.platform||'Streaming').slice(0,30)));
 top.append(art,meta,span('lc5-stream-status status-'+status,S.stateLabel(status)));item.append(top);
 item.append(el('h3','lc5-stream-title',s.title.slice(0,130)));
 const when=el('p','lc5-stream-time',`${S.dateTime(s.startMs,S.lang())} – ${S.timeOnly(s.endMs,S.lang())} JST`);item.append(when);
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
const list=document.querySelector('[data-lc5-week-list]');let monday=S.startOfWeek();let selectedMember='all';
function renderWeek(){if(!list)return;const at=S.now(), weekEnd=S.addDays(monday,7);const shown=S.plans.filter(s=>S.dayKey(s.startMs)>=monday && S.dayKey(s.startMs)<weekEnd && (selectedMember==='all'||s.memberId===selectedMember));
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
}
if(list){const select=document.querySelector('[data-lc5-member-select]');if(select){for(const m of S.publicMembers()){if(!m.id)continue;const option=el('option','',m.name);option.value=m.id;select.append(option);}select.addEventListener('change',()=>{selectedMember=select.value;renderWeek();});}
 document.querySelector('[data-lc5-week-prev]')?.addEventListener('click',()=>{monday=S.addDays(monday,-7);renderWeek();});
 document.querySelector('[data-lc5-week-next]')?.addEventListener('click',()=>{monday=S.addDays(monday,7);renderWeek();});
 document.querySelector('[data-lc5-week-today]')?.addEventListener('click',()=>{monday=S.startOfWeek();renderWeek();});}
const profile=document.querySelector('[data-lc5-member-streams]');
function renderProfile(){if(!profile)return;const id=new URLSearchParams(location.search).get('id');const member=S.publicMembers().find(m=>window.LiveCraftMembers?.key(m)===id);const plans=member?S.memberStreams(member.id).slice(0,4):[];
 if(!member){profile.closest('section').hidden=true;return;}profile.closest('section').hidden=false;
 attach(profile,plans.length?plans.map(s=>card(s,true)):[empty(t('公開された次回配信予定はありません。','No upcoming streams published.'),t('予定が登録されるとここに表示されます。','New plans will appear here.'))]);}
const badges=document.querySelector('.page-members')?document.querySelector('#member-grid'):null;
function renderBadges(){if(!badges)return;const ids=new Set(S.plannedLive().map(s=>s.memberId));badges.querySelectorAll('.member-icon-button[data-lc5-member-id]').forEach(button=>{
 let badge=button.querySelector('.lc5-member-live-badge');const active=ids.has(button.dataset.lc5MemberId);
 if(active){if(!badge){badge=el('span','lc5-member-live-badge',t('LIVE予定','LIVE PLAN'));button.append(badge);}else badge.textContent=t('LIVE予定','LIVE PLAN');}
 else badge?.remove();});}
function render(){renderHome();renderWeek();renderProfile();renderBadges();}
document.addEventListener('lc:streams-updated',render);document.addEventListener('lc:language-change',render);
// Other scripts build the member list synchronously before this script runs.
render();
window.LCStreamWidgets={render,card};
})();
