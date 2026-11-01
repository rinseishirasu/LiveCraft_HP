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
 apply('members',{id:'member-a',extras_json:JSON.stringify({fullbody:'assets/members/member-a/fullbody.png',avatar:'assets/members/member-a/icon.png',outfits:[{label:'春衣装',image:'assets/members/member-a/spring.webp'},{label:'夏衣装',image:'assets/members/member-a/looks/summer.png'}]})},fixture);
 let changedMember=readData('members',fixture)[0];
 assert.equal(changedMember.outfits.length,2);
 assert.equal(changedMember.outfits[1].image,'assets/members/member-a/looks/summer.png');
 assert.equal(changedMember.fullbody,'assets/members/member-a/fullbody.png');
 assert.throws(()=>apply('members',{id:'member-a',extras_json:JSON.stringify({outfits:[{label:'bad',image:'assets/members/member-a/../secret.png'}]})},fixture),/outfit.image/);

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

// LOOK BOOK subdirectory visual rendering regression: execute the real UI script with a small DOM fixture.
{
 const vm=require('node:vm');
 class FakeElement {
   constructor(tag='div'){this.tagName=tag;this.children=[];this.attributes={};this.listeners={};this.hidden=false;this.textContent='';}
   append(...nodes){this.children.push(...nodes);}
   replaceChildren(...nodes){this.children=[...nodes];}
   addEventListener(name,fn){this.listeners[name]=fn;}
   setAttribute(name,value){this.attributes[name]=value;}
   querySelectorAll(name){return name==='button'?this.children.filter(x=>x.tagName==='button'):[];}
 }
 const view=new FakeElement(),tabs=new FakeElement(),video=new FakeElement(),intro=new FakeElement();
 const outfitSection=new FakeElement(),profile=new FakeElement();
 outfitSection.hidden=true;
 outfitSection.querySelector=selector=>({
   '[data-lc61-outfit-view]':view,'[data-lc61-outfit-tabs]':tabs
 })[selector]||null;
 profile.hidden=true;
 profile.querySelector=selector=>({
   '[data-lc61-intro-video]':intro,'[data-lc61-outfit-section]':outfitSection,
   '.lc61-profile-video':video
 })[selector]||null;
 const document={baseURI:'https://example.com/',createElement:tag=>new FakeElement(tag),
   querySelector:selector=>selector==='[data-lc61-profile-extra]'?profile:null};
 const window={LIVE_CRAFT_MEMBERS:[{
   id:'member-a',name:'Fixture member',published:true,generation:1,
   fullbody:'assets/members/member-a/full-body.png',
   outfits:[{label:'Magic',image:'assets/members/member-a/fullbody-magic.png'},
            {label:'Remake',image:'assets/members/member-a/looks/remake.webp'}]
 }],LCContent:{records:()=>[],https:()=>null}};
 const ctx={window,document,URL,URLSearchParams,location:{search:'?id=member-a'},encodeURIComponent};
 vm.runInNewContext(fs.readFileSync(path.join(root,'assets/member-routing.js'),'utf8'),ctx);
 vm.runInNewContext(fs.readFileSync(path.join(root,'assets/v61.js'),'utf8'),ctx);
 assert.equal(profile.hidden,false,'profile extra should be visible');
 assert.equal(outfitSection.hidden,false,'LOOK BOOK should be visible');
 assert.equal(tabs.children.length,3,'main image and two outfits must appear');
 assert.equal(view.children[0].src,'assets/members/member-a/full-body.png');
 tabs.children[2].listeners.click();
 assert.equal(view.children[0].src,'assets/members/member-a/looks/remake.webp');
 assert.equal(tabs.children[2].attributes['aria-pressed'],'true');
 console.log('PASS: LOOK BOOK subdirectory visual rendering and outfit switching');
}
