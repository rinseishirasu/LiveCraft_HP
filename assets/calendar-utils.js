/* Live Craft 6.0 / standards-based .ics export, no third-party API. */
((root) => {
 'use strict';
 const escapeICS=value=>String(value??'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 function fold(line){const encoded=new TextEncoder();let out='',part='',limit=75;for(const char of line){if(encoded.encode(part+char).length>limit){out+=part+'\r\n ';part=char;limit=74;}else part+=char;}return out+part;}
 const utc=ms=>new Date(ms).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const valid=s=>s&&s.status==='scheduled'&&typeof s.id==='string'&&Number.isFinite(s.startMs)&&Number.isFinite(s.endMs)&&s.endMs>s.startMs;
 function make(plans,siteUrl='https://example.invalid/'){
  const source=Array.isArray(plans)?plans:[];
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Live Craft//Stream Schedule//JA','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Live Craft 配信予定'];
  const anchor=new URL(siteUrl,'https://example.invalid/');
  for(const s of source.filter(valid)){
   const summary=`${s.member?.name||'Live Craft'} | ${s.title||'配信予定'}`;
   const url=typeof s.streamUrl==='string'&&/^https:\/\//i.test(s.streamUrl)?s.streamUrl:'';
   const description=[`主要媒体: ${s.platform||'未設定'}`,s.description||'',url,'予定をもとにした情報です。実際の配信状況は保証しません。'].filter(Boolean).join('\n');
   const uid=`${String(s.id).replace(/[^a-zA-Z0-9-]/g,'-')}@${anchor.hostname||'livecraft.local'}`;
   lines.push('BEGIN:VEVENT',`UID:${escapeICS(uid)}`,`DTSTAMP:${utc(Date.now())}`,`DTSTART:${utc(s.startMs)}`,`DTEND:${utc(s.endMs)}`,`SUMMARY:${escapeICS(summary)}`,`DESCRIPTION:${escapeICS(description)}`);
   if(url)lines.push(`URL:${escapeICS(url)}`);
   lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
 }
 function save(plans,filename='live-craft-streams.ics'){
  if(!Array.isArray(plans)||!plans.some(valid))return false;
  const blob=new Blob(['\uFEFF',make(plans,root.location?.href||'https://livecraft.local/')],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);const link=root.document.createElement('a');link.href=url;link.download=filename;link.style.display='none';root.document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return true;
 }
 const api=Object.freeze({make,save,escapeICS,valid});
 root.LC6Calendar=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
