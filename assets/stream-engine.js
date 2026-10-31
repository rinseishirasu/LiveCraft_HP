/* Ver.5.0: published plans, not verified broadcasts. No external API usage. */
(() => {
  'use strict';
  const safeLink = value => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };
  const jstISO = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])T([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?\+09:00$/;
  function parseJST(v) {
    if(typeof v !== 'string' || !jstISO.test(v)) return NaN;
    const ms = Date.parse(v);
    if(!Number.isFinite(ms)) return NaN;
    const expected = v.slice(0, 10);
    return dayKey(ms) === expected ? ms : NaN;
  }
  const dayKey = ms => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(ms)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`; };
  const now = () => Date.now();
  const publicMembers = () => window.LiveCraftMembers?.publicMembers?.() || (Array.isArray(window.LIVE_CRAFT_MEMBERS) ? window.LIVE_CRAFT_MEMBERS.filter(x=>x?.published===true && x.id && x.name) : []);
  const memberMap = new Map(publicMembers().filter(m => typeof m.id === 'string').map(m=>[m.id,m]));
  const raw = Array.isArray(window.LIVE_CRAFT_STREAMS) ? window.LIVE_CRAFT_STREAMS : [];
  const statuses = new Set(['scheduled','cancelled','postponed','ended']);
  const basePlans = raw.filter(s => {
    if(!s || s.published!==true || typeof s.id!=='string' || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(s.id) || !memberMap.has(s.memberId) || typeof s.title !== 'string' || !s.title.trim()) return false;
    const start = parseJST(s.startAt), end = parseJST(s.endAt);
    return Number.isFinite(start) && Number.isFinite(end) && end>start && end-start<=24*60*60*1000 && statuses.has(s.status || 'scheduled');
  }).map(s=>({...s,startMs:parseJST(s.startAt),endMs:parseJST(s.endAt),member:memberMap.get(s.memberId),streamUrl:safeLink(s.streamUrl),status:s.status||'scheduled'})).sort((a,b)=>a.startMs-b.startMs);
  // Expand public weekly / biweekly series as individual occurrences. Japan uses a fixed +09:00 offset.
  // A single source record produces at most 53 instances; no hidden future data is exposed.
  const plans=basePlans.flatMap(s=>{
    if(!['weekly','biweekly'].includes(s.repeat) || !/^\d{4}-\d{2}-\d{2}$/.test(s.repeatUntil||''))return [s];
    const last=Date.parse(s.repeatUntil+'T00:00:00+09:00');
    if(!Number.isFinite(last) || last<s.startMs-86400000 || last-s.startMs>367*86400000)return [s];
    const every=s.repeat==='weekly'?7:14;
    const result=[];
    for(let i=0;i<53;i++){
      const ms=s.startMs+i*every*86400000;
      if(dayKey(ms)>s.repeatUntil)break;
      const occurrence={...s,id:i===0?s.id:`${s.id}-${dayKey(ms)}`,startMs:ms,endMs:s.endMs+i*every*86400000,seriesId:s.id,occurrence:i};
      result.push(occurrence);
    }
    return result.length?result:[s];
  }).sort((a,b)=>a.startMs-b.startMs);
  const stateAt = (s, at=now()) => {
    if(s.status !== 'scheduled') return s.status;
    if(at>=s.endMs) return 'finished';
    if(at>=s.startMs) return 'scheduled-live';
    if(at>=s.startMs-30*60*1000) return 'soon';
    return 'upcoming';
  };
  const plannedLive = (at=now()) => plans.filter(s=>stateAt(s,at)==='scheduled-live');
  const next = (at=now()) => plans.filter(s=>['upcoming','soon'].includes(stateAt(s,at)));
  const memberStreams = (id,at=now())=>plans.filter(s=>s.memberId===id && (s.endMs>at || ['cancelled','postponed'].includes(s.status) && s.startMs > at-86400000));
  const fmt = (ms, lang='ja',options={}) => new Intl.DateTimeFormat(lang==='en'?'en-US':'ja-JP',{timeZone:'Asia/Tokyo',...options}).format(ms);
  const dateTime = (ms, lang='ja')=>fmt(ms,lang,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const timeOnly = (ms,lang='ja')=>fmt(ms,lang,{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const todayJST = (ms=now()) => dayKey(ms);
  const keyToMS = key => Date.parse(`${key}T00:00:00+09:00`);
  const startOfWeek = (ms=now()) => {const key=dayKey(ms);const weekDay=(new Date(`${key}T00:00:00Z`).getUTCDay()+6)%7;return dayKey(keyToMS(key)-weekDay*86400000);};
  const addDays = (key,n)=>dayKey(keyToMS(key)+n*86400000);
  const lang = ()=>window.LC_I18N?.lang?.() || 'ja';
  const t = (ja,en)=>lang()==='en'?en:ja;
  const stateLabel = state => ({'scheduled-live':t('LIVE予定','SCHEDULED LIVE'),soon:t('まもなく','STARTING SOON'),upcoming:t('配信予定','UPCOMING'),finished:t('終了予定','SCHEDULE ENDED'),cancelled:t('中止','CANCELLED'),postponed:t('延期','POSTPONED'),ended:t('手動終了','ENDED')})[state] || '';
  const notify = () => document.dispatchEvent(new CustomEvent('lc:streams-updated'));
  // Runtime refresh after returning to a tab or crossing minute boundaries.
  setInterval(notify,30000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)notify();});
  window.LCStream = Object.freeze({plans,publicMembers,memberMap,parseJST,dayKey,todayJST,keyToMS,startOfWeek,addDays,now,stateAt,plannedLive,next,memberStreams,fmt,dateTime,timeOnly,stateLabel,safeLink,lang,t});
})();
