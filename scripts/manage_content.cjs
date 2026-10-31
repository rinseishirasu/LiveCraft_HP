#!/usr/bin/env node
/*
 * Live Craft 5.1 GitHub Actions content editor.
 * Inputs are delivered as JSON through FORM_JSON environment variable, never
 * interpolated into shell commands. Every managed path and JS global is fixed.
 * This writes only public-site data. Never submit personal/applicant secrets.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const SOURCES = Object.freeze({
  streams: ['assets/streams.js', 'LIVE_CRAFT_STREAMS'],
  members: ['assets/members.js', 'LIVE_CRAFT_MEMBERS'],
  news: ['assets/news.js', 'LIVE_CRAFT_NEWS'],
  videos: ['assets/videos.js', 'LIVE_CRAFT_VIDEOS'],
  events: ['assets/events.js', 'LIVE_CRAFT_EVENTS'],
  collabs: ['assets/collabs.js', 'LIVE_CRAFT_COLLABS'],
  recruitment: ['assets/config.js', 'LIVE_CRAFT_CONFIG']
});
const FIELDS = Object.freeze({
  streams: { memberId:'string', title:'string', platform:'string', streamUrl:'url', startAt:'datetimeJst', endAt:'datetimeJst', status:'status', thumbnail:'image:streams' },
  members: { name:'string', generation:'generation', role:'string', agency:'string', primaryPlatform:'string', primaryPlatformUrl:'url', avatar:'image:members', fullbody:'image:members', genres:'csv', bio:'string', featured:'boolchoice' },
  news: { title:'string', date:'date', category:'string', summary:'string', body:'paragraphs', link:'url', thumbnail:'image:news', publishAt:'datetime' },
  videos: { title:'string', member:'string', platform:'string', category:'string', date:'date', url:'url', thumbnail:'image:videos', description:'string', featured:'boolchoice', publishAt:'datetime' },
  events: { title:'string', date:'date', time:'time', type:'string', description:'string', url:'url', thumbnail:'image:events', publishAt:'datetime' },
  collabs: { title:'string', date:'date', category:'string', description:'string', members:'csv', url:'url', thumbnail:'image:collabs', publishAt:'datetime' }
});
const MEMBER_EXTRA_FIELDS = Object.freeze({
  catchphrase:'string', birthday:'birthday', debutDate:'date', fanName:'string', fanMark:'string', streamTag:'string', fanArtTag:'string', hobbies:'csvOrArray', memberColor:'hex', colorName:'string', schedule:'string', scheduleUrl:'url', introVideoUrl:'url', illustrator:'string', illustratorUrl:'url', links:'links', featured:'boolean', genres:'arrayStrings', bio:'string', role:'string', agency:'string', primaryPlatform:'string', primaryPlatformUrl:'url', avatar:'image:members', fullbody:'image:members'
});
const RECORD_IDS = /^[a-z0-9][a-z0-9-]{0,63}$/;
function fail(message) { throw new Error(message); }
function sourceFor(resource) { if (!Object.hasOwn(SOURCES, resource)) fail('Unknown resource'); return SOURCES[resource]; }
function readData(resource, root=ROOT) {
  const [filename, variable] = sourceFor(resource);
  const content = fs.readFileSync(path.join(root, filename), 'utf8');
  if (content.length > 2_000_000) fail('Data source too large');
  const sandbox = { window: Object.create(null) };
  vm.runInNewContext(content, sandbox, { timeout: 700, filename });
  const obj = sandbox.window[variable];
  if (resource === 'recruitment' ? (!obj || Array.isArray(obj) || typeof obj !== 'object') : !Array.isArray(obj)) fail(`${filename} has unexpected data format`);
  return JSON.parse(JSON.stringify(obj));
}
function writeData(resource, data, root=ROOT) {
  const [filename, variable] = sourceFor(resource);
  const banner = `/* Live Craft Ver.5.1 | Public ${resource} data. Managed from GitHub Actions.\n * Repository files and Git history are public. Do not store private or unapproved information.\n */\n`;
  fs.writeFileSync(path.join(root, filename), `${banner}window.${variable} = ${JSON.stringify(data, null, 2)};\n`, 'utf8');
  return filename;
}
function str(s, name, limit=1000) {
  if (typeof s !== 'string') fail(`${name} must be text`);
  if (s.length > limit) fail(`${name} too long (max ${limit})`);
  return s.trim();
}
function parseField(value, type, field) {
  if (type === 'string') return str(value, field, ['bio','body','description','summary','schedule'].includes(field) ? 6000 : 500);
  if (type === 'csv') return str(value,field,2000).split(/[,、\n]+/).map(x=>x.trim()).filter(Boolean).slice(0,30);
  if (type === 'arrayStrings' || type === 'csvOrArray') {
    if (Array.isArray(value)) return value.map(x=>str(x,field,120)).filter(Boolean).slice(0,30);
    if (type === 'csvOrArray' && typeof value === 'string') return parseField(value,'csv',field);
    fail(`${field} must be an array`);
  }
  if (type === 'paragraphs') return str(value,field,12000).split(/\n\s*\n|\r?\n/).map(x=>x.trim()).filter(Boolean).slice(0,60);
  if (type === 'url') {
    const s=str(value,field,1200); if (!s) return '';
    let uri; try { uri = new URL(s); } catch { fail(`${field}: invalid URL`); }
    if (uri.protocol !== 'https:' || !uri.hostname || uri.username || uri.password) fail(`${field}: HTTPS public URL required`);
    return s;
  }
  if (type.startsWith('image:')) {
    const s=str(value,field,300), directory=type.split(':')[1];
    if (s && !new RegExp(`^assets/${directory}/[a-zA-Z0-9_.-]+\\.(png|jpg|jpeg|webp|avif)$`).test(s)) fail(`${field}: place image under assets/${directory}/`);
    return s;
  }
  if (type === 'generation') {
    const n=Number(value); if (!Number.isSafeInteger(n) || n < 1 || n>999) fail('generation must be a positive number <=999'); return n;
  }
  if (type === 'date') {
    const s=str(value,field,20); if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || !Number.isFinite(Date.parse(s+'T00:00:00Z')) || new Date(s+'T00:00:00Z').toISOString().slice(0,10)!==s) fail(`${field}: use YYYY-MM-DD`); return s;
  }
  if (type === 'birthday') { const s=str(value,field,8); if (!/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(s)) fail(`${field}: use MM-DD`); return s; }
  if (type === 'time') { const s=str(value,field,5); if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s)) fail(`${field}: use HH:MM`); return s; }
  if (type === 'datetime' || type === 'datetimeJst') {
    const s=str(value,field,40);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/.test(s) || !Number.isFinite(Date.parse(s))) fail(`${field}: use offset-aware ISO8601`);
    if (type==='datetimeJst' && !s.endsWith('+09:00')) fail(`${field}: use +09:00 (JST)`);
    return s;
  }
  if (type==='hex') { const s=str(value,field,7); if(!/^#[0-9a-fA-F]{6}$/.test(s)) fail(`${field}: use #RRGGBB`); return s; }
  if (type==='status') { const s=str(value,field,20); if(!['scheduled','cancelled','postponed','ended'].includes(s)) fail('invalid status'); return s; }
  if (type==='boolean') { if(typeof value!=='boolean') fail(`${field}: boolean required`); return value; }
  if (type==='boolchoice') { if(value==='keep') return undefined; if(value==='true'||value===true)return true; if(value==='false'||value===false)return false;fail(`${field}: expected true/false/keep`); }
  if (type==='links') {
    if (!Array.isArray(value)||value.length>10) fail('links must be an array of 10 or fewer');
    return value.map(link => {
      if(!link || typeof link!=='object'||Array.isArray(link))fail('each link must be an object');
      return { label: str(link.label,'link.label',80), url:parseField(link.url,'url','link.url') };
    });
  }
  fail(`Unknown field type ${type}`);
}
function validateRecord(resource, row) {
  if (!row || typeof row!=='object' || Array.isArray(row)) fail('invalid record');
  if(!RECORD_IDS.test(row.id||''))fail('ID must use lowercase letters, digits or hyphens (1–64 characters)');
  if(row.published!==true && row.published!==false)fail('published must be true/false');
  if (resource==='members') {
    if(!str(row.name||'','name',200)) fail('name required');
    if(row.avatar && row.fullbody && row.avatar===row.fullbody) fail('avatar and fullbody must be different image paths');
    if(row.primaryPlatformUrl && !row.primaryPlatform) fail('primaryPlatform is required when primaryPlatformUrl is provided');
  } else if(resource==='streams') {
    for(const key of ['memberId','title','startAt','endAt'])if(!str(row[key]||'',key,500))fail(`${key} required`);
    if(!RECORD_IDS.test(row.memberId))fail('invalid memberId');
    if(parseField(row.startAt,'datetimeJst','startAt')>=parseField(row.endAt,'datetimeJst','endAt')){
      // ISO strings with identical timezone offset are lexically ordered.
      fail('endAt must be later than startAt');
    }
    if(!['scheduled','cancelled','postponed','ended'].includes(row.status||'scheduled'))fail('invalid status');
  } else if (!str(row.title||'','title',500)) fail('title required');
  if(['news','events','collabs'].includes(resource) && row.published && !row.date) fail('date is required for published entries');
  if(resource==='videos' && row.published && !row.url) fail('a public video URL is required');
}
function apply(resource, form, root=ROOT) {
  if (!form || typeof form!=='object' || Array.isArray(form)) fail('Form data must be an object');
  if (resource==='recruitment') return applyRecruitment(form,root);
  if (!Object.hasOwn(FIELDS,resource))fail('Unknown resource');
  const operation = form.operation || 'upsert';
  if (!['upsert','hide','delete'].includes(operation))fail('Unknown operation');
  const id = str(form.id||'','id',64);
  if(!RECORD_IDS.test(id))fail('ID: lowercase letters, digits and hyphens only, max 64');
  const rows=readData(resource,root);
  // Existing manually registered data may predate stable IDs. Require a safe
  // audit/migration before mutating any record so a delete cannot target the
  // wrong duplicate or an unidentified entry.
  const existingIds=new Set();
  for(const row of rows){
    if(!row || typeof row!=='object' || Array.isArray(row) || !RECORD_IDS.test(row.id||'') || existingIds.has(row.id)){
      fail(`${resource}: legacy entry has a missing/invalid/duplicate ID. Run the Existing Data audit and ID migration before editing.`);
    }
    existingIds.add(row.id);
  }
  const idx=rows.findIndex(x=>x && x.id===id);
  if(operation==='delete') {
    if(idx<0) fail(`ID not found: ${id}`);
    rows.splice(idx,1);
  } else if(operation==='hide') {
    if(idx<0) fail(`ID not found: ${id}`);
    rows[idx].published=false;
  } else {
    const rec=idx>=0 ? {...rows[idx]} : {id,published:false};
    for(const [field,type] of Object.entries(FIELDS[resource])) {
      if(!Object.hasOwn(form,field) || form[field]==='' || form[field]===null || form[field]==='keep') continue;
      if(form[field]==='__CLEAR__') {
        if(['name','title','memberId','startAt','endAt'].includes(field))fail(`${field} cannot be cleared`);
        delete rec[field];
        continue;
      }
      const parsed=parseField(form[field],type,field);
      if(parsed!==undefined)rec[field]=parsed;
    }
    if(resource==='members' && form.extras_json && String(form.extras_json).trim()) {
      let extras;try{extras=JSON.parse(form.extras_json);}catch{fail('extras_json: invalid JSON object');}
      if(!extras || typeof extras!=='object'||Array.isArray(extras))fail('extras_json must be an object');
      for(const [field,value] of Object.entries(extras)) {
        if(!Object.hasOwn(MEMBER_EXTRA_FIELDS,field))fail(`extras_json: unknown/disallowed key ${field}`);
        rec[field]=parseField(value,MEMBER_EXTRA_FIELDS[field],field);
      }
    }
    const pub=form.published || 'keep';
    if(!['true','false','keep'].includes(pub))fail('published must be true/false/keep');
    if(pub!=='keep')rec.published=pub==='true';
    validateRecord(resource,rec);
    if(resource==='streams') {
      if(!rec.status)rec.status='scheduled';
    }
    if(resource==='streams' && rec.published) {
      const members=readData('members',root);
      if(!members.some(m=>m && m.published===true && m.id===rec.memberId))fail(`memberId '${rec.memberId}' is not a public member`);
    }
    if(idx>=0)rows[idx]=rec;else rows.push(rec);
  }
  if(new Set(rows.map(x=>x.id)).size!==rows.length)fail('Duplicate ids in data');
  return {target:writeData(resource,rows,root),operation,id,count:rows.length};
}
function applyRecruitment(form,root=ROOT) {
  const config=readData('recruitment',root);
  const mode=form.recruitmentMode;
  if(mode && mode!=='keep') {
    if(!['manual','paused','scheduled'].includes(mode))fail('invalid recruitment mode');
    config.recruitmentMode=mode;
  }
  const open=form.recruitmentOpen||'keep';
  if(!['keep','true','false'].includes(open))fail('invalid recruitmentOpen');
  if(open!=='keep')config.recruitmentOpen=open==='true';
  for(const [field,type] of Object.entries({applicationUrl:'url',contactUrl:'url',recruitmentStartAt:'datetime',recruitmentEndAt:'datetime',rulesEffectiveDate:'string',rulesVersion:'string'})) {
    if(!Object.hasOwn(form,field) || !form[field] || form[field]==='keep')continue;
    if(form[field]==='__CLEAR__') {
      if(['applicationUrl','contactUrl','recruitmentStartAt','recruitmentEndAt'].includes(field)){config[field]='';continue;}
      fail(`Cannot clear ${field}`);
    }
    config[field]=parseField(form[field],type,field);
  }
  if(config.recruitmentMode==='scheduled') {
    if(!config.recruitmentStartAt || !config.recruitmentEndAt)fail('Scheduled mode requires start and end');
    if(Date.parse(config.recruitmentEndAt)<=Date.parse(config.recruitmentStartAt))fail('End must be later than start');
  }
  return {target:writeData('recruitment',config,root),operation:'configure',id:'recruitment'};
}
function main(){
  const resource=process.env.RESOURCE,raw=process.env.FORM_JSON;
  if(!resource||!raw)fail('RESOURCE and FORM_JSON required');
  const result=apply(resource,JSON.parse(raw));
  const output=process.env.GITHUB_OUTPUT;
  if(output)fs.appendFileSync(output,`target=${result.target}\noperation=${result.operation}\n`);
  console.log(`Validated ${resource}: ${result.operation} ${result.id || ''}; file ${result.target}`);
}
if(require.main===module){try{main();}catch(err){console.error('Live Craft management error:',err.message);process.exitCode=1;}}
module.exports={apply,readData,writeData,parseField,validateRecord,sourceFor};
