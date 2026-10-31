'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const vm=require('node:vm');
const root=path.resolve(__dirname,'..');const {apply,readData}=require('../scripts/manage_content.cjs');const {seedEmptyPublicData}=require('./_fixtures.cjs');
const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'livecraft-v62-'));
try{
 seedEmptyPublicData(fixture);
 apply('members',{id:'creator-one',name:'架空テスト',generation:'1',published:'true',fanClubUrl:'https://example.com/fans',fanClubLabel:'ファンクラブ',extras_json:JSON.stringify({birthday:'02-28',debutDate:'2024-01-10',fanMark:'✳',streamTag:'#配信'})},fixture);
 const member=readData('members',fixture)[0];assert.equal(member.fanClubLabel,'ファンクラブ');assert.equal(member.streamTag,'#配信');
 assert.throws(()=>apply('members',{id:'creator-one',fanClubUrl:'javascript:alert(1)'},fixture),/HTTPS/);
 apply('streams',{id:'recurring',memberId:'creator-one',title:'毎週配信',startAt:'2026-11-01T20:00:00+09:00',endAt:'2026-11-01T22:00:00+09:00',repeat:'weekly',repeatUntil:'2026-11-30',status:'scheduled',published:'true'},fixture);
 const record=readData('streams',fixture)[0];assert.equal(record.repeat,'weekly');assert.equal(record.repeatUntil,'2026-11-30');
 assert.throws(()=>apply('streams',{id:'recurring',repeatUntil:'2028-11-01'},fixture),/366 days/);
 apply('streams',{id:'recurring',repeat:'none'},fixture);
 assert.equal(readData('streams',fixture)[0].repeatUntil,undefined,'turning off repeat clears end date');
 assert.throws(()=>apply('streams',{id:'recurring',repeat:'weekly'},fixture),/repeatUntil required/);
 const engine=fs.readFileSync(path.join(root,'assets/stream-engine.js'),'utf8');
 const context={Date,Intl,URL,Set,Map,RegExp,Number,Array,Object,CustomEvent:class{},setInterval(){},document:{addEventListener(){},dispatchEvent(){}},window:{LIVE_CRAFT_MEMBERS:[{id:'creator-one',name:'架空テスト',published:true}],LIVE_CRAFT_STREAMS:[{...record,published:true}]}};
 vm.createContext(context);vm.runInContext(engine,context);
 const plans=context.window.LCStream.plans;assert.equal(plans.length,5,'Nov 1,8,15,22,29 recurring weekly');
 assert.deepEqual(Array.from(plans.map(p=>context.window.LCStream.dayKey(p.startMs))),['2026-11-01','2026-11-08','2026-11-15','2026-11-22','2026-11-29']);
 assert.equal(new Set(plans.map(x=>x.id)).size,5,'unique occurrence ids');
 const ics=require('../assets/calendar-utils.js');assert.equal((ics.make(Array.from(plans)).match(/BEGIN:VEVENT/g)||[]).length,5,'calendar receives five occurrences');
 for(const x of ['fan.html','anniversaries.html','archives.html','assets/fan-experience.js','assets/archives.js','assets/v62.css'])assert.ok(fs.existsSync(path.join(root,x)),`Missing ${x}`);
 for(const x of ['schedule.html','member.html','index.html','fan.html','anniversaries.html','archives.html'])assert.ok(fs.readFileSync(path.join(root,x),'utf8').includes('assets/v62.css'),`${x} missing style`);
 assert.ok(fs.readFileSync(path.join(root,'scripts/build_site.py'),'utf8').includes("'anniversaries.html'"));
 assert.ok(fs.readFileSync(path.join(root,'scripts/build_site.py'),'utf8').includes("'archives.html'"));
 console.log('PASS V6.2: fan metadata, URL safety, weekly recurrence, date limit, .ics, new pages');
}finally{fs.rmSync(fixture,{recursive:true,force:true});}
