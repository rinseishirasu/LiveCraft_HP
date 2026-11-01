#!/usr/bin/env node
/* Local-only change review: show changes by field, not personal values in logs. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {readData,sourceFor}=require('./manage_content.cjs');
const ROOT=path.resolve(__dirname,'..');
function summary(oldValue,newValue,resource){
 const rows=Array.isArray(newValue)&&Array.isArray(oldValue);
 if(!rows){const before=oldValue||{},after=newValue||{};return [{id:'設定',kind:'更新',fields:Object.keys(after).filter(k=>JSON.stringify(before[k])!==JSON.stringify(after[k]))}];}
 const first=new Map(oldValue.filter(x=>x&&x.id).map(x=>[x.id,x]));
 const after=new Map(newValue.filter(x=>x&&x.id).map(x=>[x.id,x]));
 const changes=[];
 for(const [id,row] of after){if(!first.has(id)){changes.push({id,kind:'追加',fields:Object.keys(row).filter(x=>x!=='id')});continue;}
  const previous=first.get(id);
  const fields=[...new Set([...Object.keys(row),...Object.keys(previous)])].filter(k=>JSON.stringify(row[k])!==JSON.stringify(previous[k]));
  if(fields.length)changes.push({id,kind:'更新',fields});
 }
 for(const [id] of first)if(!after.has(id))changes.push({id,kind:'削除',fields:[]});
 return changes;
}
function generate(root=ROOT,resource,outputDir='review'){
 const [file,variable]=sourceFor(resource);
 const source=execFileSync('git',['show',`HEAD:${file}`],{cwd:root,encoding:'utf8',maxBuffer:3_000_000});
 const sandbox={window:Object.create(null)};vm.runInNewContext(source,sandbox,{timeout:700});
 const before=JSON.parse(JSON.stringify(sandbox.window[variable]));const after=readData(resource,root);
 const changes=summary(before,after,resource);
 const lines=['# Live Craft 6.3 / 更新差分プレビュー','',`対象: \`${file}\``,`変更レコード数: ${changes.length}`,'',...changes.map(x=>`- ${x.kind} \`${x.id}\`：${x.fields.join(' / ')||'レコード削除'}`),'','**プレビューのみ**の場合、GitHubへ保存・公開されません。',''];
 const directory=path.resolve(root,outputDir);fs.mkdirSync(directory,{recursive:true});
 const reportPath=path.join(directory,'change-summary.md');fs.writeFileSync(reportPath,lines.join('\n'),'utf8');
 const patch=execFileSync('git',['diff','--no-ext-diff','--',file],{cwd:root,encoding:'utf8',maxBuffer:3_000_000});
 fs.writeFileSync(path.join(directory,'change.patch'),patch,'utf8');
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,lines.join('\n'));
 console.log('Change review:',changes.map(x=>`${x.id}: ${x.fields.join(',')||x.kind}`).join('; ')||'no changes');
 return changes;
}
if(require.main===module){try{generate(ROOT,process.env.RESOURCE);}catch(e){console.error('差分レポート失敗:',e.message);process.exitCode=1;}}
module.exports={summary,generate};
