'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {apply,readData} = require('../scripts/manage_content.cjs');
const {seedEmptyPublicData} = require('./_fixtures.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'livecraft-actions-'));
seedEmptyPublicData(root);
function run(resource,form){ return apply(resource,form,root); }
function one(resource){ return readData(resource,root)[0]; }
function throws(resource,form,pattern){ assert.throws(()=>run(resource,form),pattern); }
try {
  run('members',{id:'m-a',name:'てすと🌷',generation:'2',avatar:'assets/members/a.webp',fullbody:'assets/members/b.webp',agency:'個人勢',primaryPlatform:'YouTube',genres:'歌,雑談',published:'true',featured:'true',extras_json:JSON.stringify({links:[{label:'YouTube',url:'https://youtube.com/@abc'}],birthday:'04-15',memberColor:'#B387EF'})});
  assert.equal(one('members').name,'てすと🌷');
  assert.deepEqual(one('members').genres,['歌','雑談']);
  assert.equal(one('members').birthday,'04-15');
  assert.equal(one('members').published,true);
  run('members',{id:'m-a',bio:'hello',published:'keep',featured:'keep'});
  assert.equal(one('members').avatar,'assets/members/a.webp');
  assert.equal(one('members').featured,true);
  throws('members',{id:'m-a',avatar:'assets/members/b.webp',published:'keep'},/avatar and fullbody/);
  throws('members',{id:'bad-name',name:'',published:'true'},/name required/);
  throws('members',{id:'x',name:'x',extras_json:'{"secret":"bad"}'},/unknown\/disallowed/);
  throws('members',{id:'x',name:'x',primaryPlatformUrl:'http://evil.invalid'},/HTTPS public URL/);
  run('members',{id:'m-b',name:'未公開',published:'false'});
  throws('streams',{id:'s-fail',memberId:'m-b',title:'未公開',startAt:'2026-11-01T20:00:00+09:00',endAt:'2026-11-01T21:00:00+09:00',published:'true'},/not a public member/);
  run('streams',{id:'stream-1',memberId:'m-a',title:'ゲーム 🎮',platform:'YouTube',startAt:'2026-11-01T20:00:00+09:00',endAt:'2026-11-01T22:00:00+09:00',published:'true'});
  assert.equal(one('streams').status,'scheduled');
  run('streams',{id:'stream-1',status:'cancelled',published:'keep'});
  run('streams',{id:'stream-1',title:'変更',status:'keep',published:'keep'});
  assert.equal(one('streams').status,'cancelled');
  throws('streams',{id:'bad-stream',memberId:'m-a',title:'x',startAt:'2026-11-01T22:00:00+09:00',endAt:'2026-11-01T20:00:00+09:00'},/endAt/);
  run('news',{id:'news-1',title:'発表',date:'2026-11-01',body:'1段落\n2段落',published:'true'});
  assert.deepEqual(one('news').body,['1段落','2段落']);
  run('news',{id:'news-1',summary:'概要',published:'keep'});
  assert.deepEqual(one('news').body,['1段落','2段落']);
  run('videos',{id:'video-1',title:'サンプル動画',url:'https://example.com/watch?v=1',published:'true'});
  run('events',{id:'event-1',title:'ライブ企画',date:'2026-11-02',time:'20:00',published:'true'});
  run('collabs',{id:'collab-1',title:'合作',date:'2026-11-03',members:'A, B',published:'true'});
  assert.deepEqual(one('collabs').members,['A','B']);
  run('videos',{id:'video-1',operation:'hide'});
  assert.equal(one('videos').published,false);
  run('news',{id:'news-1',operation:'delete'});
  assert.equal(readData('news',root).length,0);
  throws('news',{id:'nonexistent',operation:'delete'},/not found/);
  throws('events',{id:'evt-invalid',title:'x',date:'2026-02-30',published:'true'},/YYYY-MM-DD/);
  run('recruitment',{recruitmentMode:'manual',recruitmentOpen:'true',applicationUrl:'https://forms.example.com/application',rulesVersion:'1.1'});
  assert.equal(readData('recruitment',root).recruitmentOpen,true);
  run('recruitment',{recruitmentMode:'paused',applicationUrl:'__CLEAR__'});
  assert.equal(readData('recruitment',root).applicationUrl,'');
  assert.equal(readData('recruitment',root).rulesVersion,'1.1');
  // Regression: the real GitHub repository may already contain public members.
  // Updating or adding records must not depend on the first array element.
  const existingRoot = fs.mkdtempSync(path.join(os.tmpdir(),'livecraft-existing-test-'));
  try {
    seedEmptyPublicData(existingRoot);
    fs.writeFileSync(path.join(existingRoot,'assets/members.js'),
      `window.LIVE_CRAFT_MEMBERS = [
        {id:'existing-member',name:'既存メンバー',published:true,
         bio:'元の紹介文',links:[{label:'公式',url:'https://example.com'}],customOldField:'保持'}
      ];\n`, 'utf8');
    apply('members',{id:'new-member',name:'てすと🌷',published:'true'},existingRoot);
    let members = readData('members',existingRoot);
    assert.equal(members.length,2);
    assert.equal(members.find(x=>x.id==='existing-member').bio,'元の紹介文');
    assert.equal(members.find(x=>x.id==='new-member').name,'てすと🌷');
    apply('members',{id:'existing-member',agency:'個人勢',published:'keep'},existingRoot);
    members = readData('members',existingRoot);
    const oldMember = members.find(x=>x.id==='existing-member');
    assert.equal(oldMember.agency,'個人勢');
    assert.equal(oldMember.bio,'元の紹介文');
    assert.equal(oldMember.customOldField,'保持');
    assert.deepEqual(oldMember.links,[{label:'公式',url:'https://example.com'}]);
  } finally {fs.rmSync(existingRoot,{recursive:true,force:true});}
  console.log('PASS: 7 managed resources, isolated fixtures, populated-repository regression, safe merges, validations');
} finally { fs.rmSync(root,{recursive:true,force:true}); }
