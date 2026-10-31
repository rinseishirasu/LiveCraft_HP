'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const root=path.resolve(__dirname,'..');
const {apply,readData} = require('../scripts/manage_content.cjs');
const {seedEmptyPublicData} = require('./_fixtures.cjs');
const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'livecraft-v61-'));
try {
 seedEmptyPublicData(fixture);
 apply('members',{id:'member-a',name:'サンプル（仮）',published:'true',extras_json:JSON.stringify({introVideoUrl:'https://example.com/intro',outfits:[{label:'夏衣装',image:'assets/members/summer.webp'}]})},fixture);
 assert.equal(readData('members',fixture)[0].outfits[0].label,'夏衣装');
 assert.throws(()=>apply('members',{id:'member-a',extras_json:JSON.stringify({outfits:[{label:'bad',image:'https://example.com/hack'}]})},fixture), /outfit.image/);
 apply('projects',{id:'project-a',title:'サンプル企画',summary:'公開のみ',description:'案内',status:'ongoing',category:'ゲーム',cover:'assets/projects/project-a.webp',members:'member-a',relatedVideos:'vid-a',published:'true',featured:'true'},fixture);
 let p=readData('projects',fixture)[0];assert.equal(p.title,'サンプル企画');assert.deepEqual(p.members,['member-a']);assert.equal(p.featured,true);
 apply('projects',{id:'project-a',status:'completed',published:'keep',featured:'keep'},fixture);
 p=readData('projects',fixture)[0];assert.equal(p.summary,'公開のみ');assert.equal(p.status,'completed');
 assert.throws(()=>apply('projects',{id:'bad',title:'bad',status:'internal',published:'true'},fixture),/projectStatus/);
 assert.throws(()=>apply('projects',{id:'bad',title:'bad',cover:'assets/private/foo.png',published:'true'},fixture),/cover/);
 apply('projects',{id:'project-a',operation:'hide'},fixture);assert.equal(readData('projects',fixture)[0].published,false);
 apply('projects',{id:'project-a',operation:'delete'},fixture);assert.equal(readData('projects',fixture).length,0);
 for(const f of ['start.html','projects.html','project.html','assets/v61.js','assets/v61.css','assets/projects.js','.github/workflows/manage-projects.yml'])assert.ok(fs.existsSync(path.join(root,f)),`missing ${f}`);
 for(const f of ['start.html','projects.html','project.html'])assert.ok(fs.readFileSync(path.join(root,f),'utf8').includes('assets/v61.js'));
 assert.ok(fs.readFileSync(path.join(root,'scripts/build_site.py'),'utf8').includes("'projects.html'"));
 console.log('PASS: V6.1 public PROJECTS CRUD, legacy data preservation, outfit validation, page assets');
} finally {fs.rmSync(fixture,{recursive:true,force:true});}
