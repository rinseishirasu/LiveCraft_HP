'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {seedEmptyPublicData}=require('./_fixtures.cjs');
const {audit}=require('../scripts/content_audit.cjs');
const {summary}=require('../scripts/change_report.cjs');
const {japaneseGuidance}=require('../scripts/manage_content.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'livecraft-v63-'));
const set=(file,variable,rows)=>fs.writeFileSync(path.join(root,'assets',file+'.js'),`window.${variable} = ${JSON.stringify(rows)};`);
try{
 seedEmptyPublicData(root);
 const members=[{id:'creator-a',published:true,name:'配信者🌷',avatar:'assets/members/creator-a/icon.png',fullbody:'assets/members/creator-a/fullbody.png',outfits:[{label:'新衣装',image:'assets/members/creator-a/outfit.png'}]}];
 fs.mkdirSync(path.join(root,'assets/members/creator-a'),{recursive:true});
 for(const n of ['icon','fullbody','outfit'])fs.writeFileSync(path.join(root,'assets/members/creator-a',n+'.png'),'x');
 set('members','LIVE_CRAFT_MEMBERS',members);
 const streams=[{id:'stream-a',published:true,memberId:'creator-a',title:'テスト',startAt:'2026-11-01T10:30:00+09:00',endAt:'2026-11-01T12:00:00+09:00'}];
 set('streams','LIVE_CRAFT_STREAMS',streams);
 let result=audit(root);
 assert.deepEqual(result.errors,[]);
 assert.deepEqual(result.warnings,[]);
 streams[0].memberId='unknown-member';set('streams','LIVE_CRAFT_STREAMS',streams);
 result=audit(root);assert.ok(result.errors.some(x=>x.includes('unknown-member')));
 streams[0].memberId='creator-a';streams[0].endAt='2026-11-01T09:00:00+09:00';set('streams','LIVE_CRAFT_STREAMS',streams);
 result=audit(root);assert.ok(result.errors.some(x=>x.includes('終了日時')));
 streams[0].endAt='2026-11-01T12:00:00+09:00';set('streams','LIVE_CRAFT_STREAMS',streams);
 fs.unlinkSync(path.join(root,'assets/members/creator-a/outfit.png'));
 result=audit(root);assert.equal(result.errors.length,0);assert.ok(result.warnings.some(x=>x.includes('outfit.png')));
 members.push({...members[0]});set('members','LIVE_CRAFT_MEMBERS',members);
 result=audit(root);assert.ok(result.errors.some(x=>x.includes('ID重複')));
 assert.deepEqual(summary([{id:'a',x:1}],[{id:'a',x:2},{id:'b'}],'members'),[{id:'a',kind:'更新',fields:['x']},{id:'b',kind:'追加',fields:[]}]);
 assert.ok(japaneseGuidance('invalid JSON object').includes('JSON'));
 const wf=path.join(__dirname,'../.github/workflows');
 for(const file of fs.readdirSync(wf).filter(x=>x.startsWith('manage-')&&x.endsWith('.yml'))){
  const text=fs.readFileSync(path.join(wf,file),'utf8');
  assert.match(text,/preview_only:/);
  assert.match(text,/preview_only: \$\{\{ inputs.preview_only \}\}/);
 }
 const reusable=fs.readFileSync(path.join(wf,'_manage-and-publish.yml'),'utf8');
 assert.match(reusable,/if: \$\{\{ !inputs.preview_only \}\}/);
 assert.match(reusable,/name: livecraft-preview-/);
 console.log('PASS: V6.3 integrity, nested images, warnings, invalid references, preview mode, diff, Japanese errors');
}finally{fs.rmSync(root,{recursive:true,force:true});}
