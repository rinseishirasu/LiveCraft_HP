(() => {
'use strict';
const C=window.LCContent;if(!C)return;
const {create,https,image,records,date,empty}=C;
const lang=()=>window.LC_I18N?.lang?.()||'ja';
const cleanDate=x=>/^\d{4}-\d{2}-\d{2}$/.test(x||'')?x:'';
const videos=records('LIVE_CRAFT_VIDEOS').filter(x=>x.title&&https(x.url));
const events=records('LIVE_CRAFT_EVENTS').filter(x=>x.title&&cleanDate(x.date)).sort((a,b)=>a.date.localeCompare(b.date));
const collabs=records('LIVE_CRAFT_COLLABS').filter(x=>x.title&&cleanDate(x.date)).sort((a,b)=>b.date.localeCompare(a.date));
function linkCard(item,kind){const a=create('a','lc44-content-card');a.href=https(item.url)||'#';if(https(item.url)){a.target='_blank';a.rel='noopener noreferrer';}else a.removeAttribute('href');
  const visual=create('div','lc44-card-art');visual.append(image(item.thumbnail||'', ''));a.append(visual);
  const b=create('div','lc44-card-body');b.append(create('span','lc44-card-kicker',kind==='video'?(item.platform||'VIDEO'):kind==='event'?(date(item.date)+' · '+(item.time||'イベント')):date(item.date)));
  b.append(create('h3','',item.title));if(item.description)b.append(create('p','',item.description));
  if(kind==='video'&&item.member)b.append(create('span','lc44-card-caption',item.member));
  if(kind==='collab'&&Array.isArray(item.members))b.append(create('span','lc44-card-caption',item.members.join(' / ')));
  b.append(create('span','lc44-card-open',https(item.url)?'詳細を開く ↗':'開催情報'));a.append(b);return a;}
const videoRoot=document.querySelector('[data-videos]');
if(videoRoot){const field=document.querySelector('[data-video-search]'),pick=document.querySelector('[data-video-category]');const kinds=['すべて',...new Set(videos.map(x=>x.category||'その他'))];if(pick){kinds.forEach(x=>{let opt=create('option','',x);opt.value=x;pick.append(opt);});}
const render=()=>{const q=(field?.value||'').trim().toLocaleLowerCase('ja');const k=pick?.value||'すべて';const list=videos.filter(x=>(k==='すべて'||(x.category||'その他')===k)&&[x.title,x.member,x.platform,x.description].join(' ').toLocaleLowerCase('ja').includes(q));videoRoot.replaceChildren(...list.map(x=>linkCard(x,'video')));if(!list.length)empty(videoRoot,videos.length?'該当する動画がありません':'動画紹介は準備中です。',videos.length?'条件を変えてお探しください。':'公開を許可された動画を順次掲載します。');};field?.addEventListener('input',render);pick?.addEventListener('change',render);render();}
const collabRoot=document.querySelector('[data-collabs]');if(collabRoot){const field=document.querySelector('[data-collab-search]');const render=()=>{const q=(field?.value||'').trim().toLocaleLowerCase('ja');const list=collabs.filter(x=>[x.title,x.category,x.description,...(Array.isArray(x.members)?x.members:[])].join(' ').toLocaleLowerCase('ja').includes(q));collabRoot.replaceChildren(...list.map(x=>linkCard(x,'collab')));if(!list.length)empty(collabRoot,collabs.length?'該当する企画がありません':'公開アーカイブは準備中です。',collabs.length?'別のキーワードでお試しください。':'公開の許諾がある企画から紹介していきます。');};field?.addEventListener('input',render);render();}
const calendar=document.querySelector('[data-event-calendar]');
if(calendar){const title=document.querySelector('[data-month-label]');const listRoot=document.querySelector('[data-events-list]');const current=new Date();let year=current.getFullYear(),month=current.getMonth();
  const render=()=>{const first=new Date(year,month,1),days=new Date(year,month+1,0).getDate(),offset=(first.getDay()+6)%7;title.textContent=lang()==='en'?new Intl.DateTimeFormat('en-US',{year:'numeric',month:'long',timeZone:'Asia/Tokyo'}).format(new Date(year,month,1)):`${year}年 ${month+1}月`;
  calendar.replaceChildren();(lang()==='en'?['Mon','Tue','Wed','Thu','Fri','Sat','Sun']:['月','火','水','木','金','土','日']).forEach(x=>calendar.append(create('span','lc44-weekday',x)));
  for(let i=0;i<offset;i++)calendar.append(create('span','lc44-calendar-blank'));
  for(let day=1;day<=days;day++){let iso=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;let matches=events.filter(x=>x.date===iso);const cell=create('div','lc44-day'+(matches.length?' has-event':''));cell.append(create('span','lc44-day-num',day));matches.slice(0,2).forEach(x=>{const name=create('span','lc44-event-dot',x.title);name.title=x.title;cell.append(name);});calendar.append(cell);}
  const inMonth=events.filter(x=>x.date.slice(0,7)===`${year}-${String(month+1).padStart(2,'0')}`);listRoot.replaceChildren(...inMonth.map(x=>{const wrap=create('div','lc44-event-row');const info=create('div');info.append(create('span','lc44-card-kicker',`${date(x.date)} ${x.time||''} / ${x.type||'EVENT'}`),create('h3','',x.title),create('p','',x.description||''));wrap.append(info);if(https(x.url)){const a=create('a','lc44-event-link','詳細 ↗');a.href=https(x.url);a.rel='noopener noreferrer';a.target='_blank';wrap.append(a);}return wrap;}));if(!inMonth.length)empty(listRoot,'この月の公開予定はありません。','未掲載のイベントやメンバー限定の予定は表示されません。');};
  document.querySelector('[data-prev-month]')?.addEventListener('click',()=>{const d=new Date(year,month-1,1);year=d.getFullYear();month=d.getMonth();render();});
  document.querySelector('[data-next-month]')?.addEventListener('click',()=>{const d=new Date(year,month+1,1);year=d.getFullYear();month=d.getMonth();render();});
  document.addEventListener('lc:language-change',render);render();}
const homeVideo=document.querySelector('[data-home-videos]');if(homeVideo){const set=videos.filter(x=>x.featured===true);const chosen=(set.length?set:videos).slice(0,3);if(chosen.length){homeVideo.replaceChildren(...chosen.map(x=>linkCard(x,'video')));}else empty(homeVideo,'配信・動画の紹介は準備中です。','公開されたおすすめ動画がここに並びます。');}
const homeEvents=document.querySelector('[data-home-events]');if(homeEvents){const today=new Date().toISOString().slice(0,10);const chosen=events.filter(x=>x.date>=today).slice(0,3);homeEvents.replaceChildren(...chosen.map(x=>linkCard(x,'event')));if(!chosen.length)empty(homeEvents,'現在ご案内できる公開イベントはありません。','開催が決まり次第こちらでお知らせします。');}
})();
