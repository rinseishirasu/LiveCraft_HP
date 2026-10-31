'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {inspect,inspectAll,migrate}=require('../scripts/legacy_inventory.cjs');
const {apply,readData}=require('../scripts/manage_content.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'livecraft-legacy-'));
try{
  fs.mkdirSync(path.join(root,'assets'),{recursive:true});
  for(const key of ['members','news','streams','events','videos','collabs','config']){
    fs.copyFileSync(path.join(__dirname,'..','assets',key+'.js'),path.join(root,'assets',key+'.js'));
  }
  fs.writeFileSync(path.join(root,'assets/members.js'),`window.LIVE_CRAFT_MEMBERS = [
   {name:'旧メンバー🌷', generation:2, agency:'個人勢',published:true,links:[{label:'YouTube',url:'https://example.com'}],customOldField:'keep'},
   {name:'未公開メンバー', bio:'昔の自己紹介', published:false},
   {id:'existing-a',name:'ID登録済み',published:true,bio:'変えない'}
  ];`);
  fs.writeFileSync(path.join(root,'assets/news.js'),`window.LIVE_CRAFT_NEWS = [
  {title:'昔の記事',date:'2026-10-21',body:['段落A','段落B'],published:true},
  {id:'legacy-news-0002',title:'もともと同じ候補のID',published:false},
  {title:'公開未設定の記事',summary:'個人情報なし'}];`);
  fs.writeFileSync(path.join(root,'assets/streams.js'),`window.LIVE_CRAFT_STREAMS = [
  {id:'stream-one',memberId:'existing-a',title:'配信',startAt:'2026-11-01T20:00:00+09:00',endAt:'2026-11-01T22:00:00+09:00',published:true}];`);
  const before=inspect('members',root);
  assert.equal(before.count,3);
  assert.equal(before.entries[0].status,'ID未設定・補完可能');
  assert.equal(inspectAll(['members'],root,'個人勢').items[0].entries.length,1);
  assert.throws(()=>apply('members',{id:'existing-a',bio:'change'},root),/legacy entry/);
  const members=migrate('members',root);
  assert.equal(members.addedIds,2);
  assert.equal(members.publishedFixed,0);
  const memberRows=readData('members',root);
  assert.equal(memberRows[0].id,'legacy-members-0001');
  assert.equal(memberRows[0].published,true);
  assert.equal(memberRows[0].customOldField,'keep');
  assert.deepEqual(memberRows[0].links,[{label:'YouTube',url:'https://example.com'}]);
  assert.equal(memberRows[1].bio,'昔の自己紹介');
  assert.equal(memberRows[2].id,'existing-a');
  assert.equal(migrate('members',root).changed,false);
  apply('members',{id:'legacy-members-0001',bio:'新しい紹介',published:'keep'},root);
  assert.equal(readData('members',root)[0].agency,'個人勢');
  assert.equal(readData('members',root)[0].bio,'新しい紹介');
  const news=migrate('news',root);
  assert.equal(news.addedIds,2);
  assert.equal(news.publishedFixed,1);
  const newsRows=readData('news',root);
  assert.deepEqual(newsRows[0].body,['段落A','段落B']);
  assert.equal(newsRows[0].published,true);
  assert.equal(newsRows[2].published,false);
  assert.notEqual(newsRows[2].id,'legacy-news-0002');
  const noChange=migrate('streams',root);
  assert.equal(noChange.changed,false);
  const previous=fs.readFileSync(path.join(root,'assets/events.js'),'utf8');
  fs.writeFileSync(path.join(root,'assets/events.js'),"window.LIVE_CRAFT_EVENTS = [{id:'dup',title:'A'},{id:'dup',title:'B'}];");
  assert.throws(()=>migrate('events',root),/invalid\/duplicate/);
  assert.equal(readData('events',root).length,2);
  fs.writeFileSync(path.join(root,'assets/events.js'),previous);
  console.log('PASS: legacy discovery, search, safe ID generation, unchanged old fields, guard, collision avoidance, repeat migration');
} finally{fs.rmSync(root,{recursive:true,force:true});}
