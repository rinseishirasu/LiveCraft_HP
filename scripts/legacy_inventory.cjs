#!/usr/bin/env node
/* GitHub Actions: view existing public-site records and add missing stable IDs. */
'use strict';
const fs = require('node:fs');
const {readData, writeData} = require('./manage_content.cjs');
const TYPES = ['members','streams','news','videos','events','collabs','projects','recruitment'];
const ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const safe = x => String(x ?? '').replace(/[\r\n\t]/g, ' ').slice(0,140);
const md = x => safe(x).replace(/[|]/g,'\\|').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/`/g,'\\`');
function typesFor(input) {
  if(input === 'all')return TYPES;
  if(!TYPES.includes(input))throw new Error('Unknown resource');
  return [input];
}
function inspect(resource, root) {
  const data = readData(resource,root);
  if(resource === 'recruitment') return {resource,kind:'settings',count:1,entries:[{id:'recruitment',title:'募集・公式設定',status:'登録済み',keys:Object.keys(data)}]};
  const memberIds=resource==='streams' ? new Set(readData('members',root).map(m=>m?.id).filter(x=>typeof x==='string'&&x.trim())) : null;
  const counts=new Map();
  for(const row of data)if(row && typeof row.id ==='string' && row.id.trim())counts.set(row.id,(counts.get(row.id)||0)+1);
  const entries = data.map((row,index)=>{
    const malformed = !row || typeof row!=='object' || Array.isArray(row);
    const id = malformed?'':(typeof row.id==='string'?row.id.trim():'');
    const missingId=!id;
    const invalidId=!!id && !ID_RE.test(id);
    const duplicateId=!!id && counts.get(id)>1;
    const missingPublished=malformed||typeof row.published!=='boolean';
    const unresolvedMember=resource==='streams' && !malformed && (!row.memberId || !memberIds.has(row.memberId));
    const status=malformed?'データ形式エラー':duplicateId?'ID重複・要手動修正':invalidId?'ID不正・要手動修正':missingId?'ID未設定・補完可能':missingPublished?'公開状態未設定・補完可能':unresolvedMember?'メンバー参照先不明':'OK';
    const title=malformed?'(形式エラー)':safe(row.name || row.title || '(タイトル未設定)');
    const searchable=malformed?'':[
      id,row.name,row.title,row.agency,row.primaryPlatform,row.memberId,row.category
    ].filter(v=>typeof v==='string').join(' ').toLowerCase();
    return {index:index+1,id,title,status,published:missingPublished?'未設定':row.published,
      missingId,invalidId,duplicateId,missingPublished,malformed,unresolvedMember,searchable};
  });
  return {resource,kind:'records',count:entries.length,entries};
}
function inspectAll(resources,root,query='') {
  const needle=String(query).trim().toLowerCase().slice(0,100);
  return {query:needle,items:resources.map(resource=>{
    const item=inspect(resource,root);
    return {...item,entries:item.kind==='records' && needle ? item.entries.filter(r=>r.searchable.includes(needle)) : item.entries};
  })};
}
function candidateIds(rows,resource) {
  const used=new Set(rows.map(row=>typeof row?.id==='string'?row.id.trim():'').filter(Boolean));
  const result=new Map();
  rows.forEach((row,i)=>{
    if(typeof row?.id==='string' && row.id.trim())return;
    const base=`legacy-${resource}-${String(i+1).padStart(4,'0')}`;
    let next=base,n=2;
    while(used.has(next))next=`${base}-${n++}`;
    used.add(next);
    result.set(i,next);
  });
  return result;
}
function migrate(resource,root){
  if(resource==='recruitment')return {resource,addedIds:0,publishedFixed:0,changed:false};
  const overview=inspect(resource,root);
  if(overview.entries.some(r=>r.malformed||r.invalidId||r.duplicateId))throw new Error(`${resource}: invalid/duplicate IDs or malformed records. Inspect before manually repairing. No changes made.`);
  const rows=readData(resource,root);
  const assignments=candidateIds(rows,resource);
  let publishedFixed=0;
  rows.forEach((row,i)=>{
    if(assignments.has(i))row.id=assignments.get(i);
    if(typeof row.published!=='boolean'){
      row.published=false;
      publishedFixed++;
    }
  });
  const changed=assignments.size>0 || publishedFixed>0;
  if(changed)writeData(resource,rows,root);
  return {resource,addedIds:assignments.size,publishedFixed,changed};
}
function summary(report,mode='inspect',changes=[]){
  const lines=['# Live Craft | 登録済みデータ確認','','操作：'+(mode==='inspect'?'**一覧確認（変更なし）**':'**ID補完・公開フラグ補完**'),''];
  if(report.query)lines.push(`検索: \`${md(report.query)}\``,'');
  if(changes.length){
    lines.push('| データ | 新たに補完したID | 公開フラグ未設定を非公開化 |','|---|---:|---:|');
    for(const c of changes)lines.push(`| ${c.resource} | ${c.addedIds} | ${c.publishedFixed} |`);
    lines.push('');
  }
  for(const item of report.items){
    lines.push(`## ${item.resource}：全${item.count}件`,'');
    if(item.kind==='settings'){
      lines.push('募集・公式設定は「募集・公式設定管理」で既存値の部分更新ができます。','');
      continue;
    }
    if(!item.entries.length){lines.push('一致する登録はありません。','');continue;}
    lines.push('| 行 | 編集に使うID | 名前・タイトル | 公開状態 | チェック結果 |','|---:|---|---|---|---|');
    for(const r of item.entries.slice(0,120)){
      const visibility=r.published===true?'公開':r.published===false?'非公開':'未設定';
      lines.push(`| ${r.index} | \`${md(r.id||'(未設定)')}\` | ${md(r.title)} | ${visibility} | ${md(r.status)} |`);
    }
    if(item.entries.length>120)lines.push('',`表示は先頭120件までです。全件は下部のJSONレポートをダウンロードしてください。`);
    if(item.entries.some(r=>r.missingId))lines.push('',`**ID未設定の登録があります。** 先にmode=migrateで固定IDを補完できます。`);
    if(item.entries.some(r=>r.invalidId||r.duplicateId||r.malformed))lines.push('',`**自動補完できないデータがあります。** IDの重複・不正・レコード形式はGitHub Code画面で確認してください。`);
    if(item.entries.some(r=>r.unresolvedMember))lines.push('',`**メンバー参照先が見つからない配信予定があります。** streams.jsのmemberIdをmembers.jsの固定IDと照合してください。推測で自動変更はしません。`);
    lines.push('');
  }
  lines.push('## 既存登録の編集','','1. この一覧から対象のIDを確認。','2. Actions内の「メンバー管理」「NEWS管理」などを開く。','3. `operation=upsert` と同じIDを入力して、変更する項目だけ記入。','4. `published=keep` で公開状態を維持。空欄は原則既存の値を維持します。','','**注意：** GitHubで公開するソースやActionsのログに個人情報・未発表情報を載せないでください。','');
  return lines.join('\n');
}
function main(){
  const mode=process.env.MODE||'inspect';
  if(!['inspect','migrate'].includes(mode))throw new Error('Unknown mode');
  const selection=typesFor(process.env.RESOURCE||'all');
  const query=process.env.QUERY||'';
  if(mode==='migrate' && query.trim())throw new Error('ID補完では検索欄を空にしてください。');
  if(mode==='migrate'){
    // Check all relevant files before writing any of them.
    const problematic=selection.filter(r=>r!=='recruitment').map(r=>inspect(r,process.cwd())).filter(r=>r.entries.some(x=>x.invalidId||x.duplicateId||x.malformed));
    if(problematic.length)throw new Error('Existing IDs need manual review in: '+problematic.map(r=>r.resource).join(', '));
  }
  const changes=mode==='migrate'?selection.map(r=>migrate(r,process.cwd())):[];
  const report=inspectAll(selection,process.cwd(),query);
  if(process.env.REPORT_JSON)fs.writeFileSync(process.env.REPORT_JSON,JSON.stringify(report,null,2)+'\n','utf8');
  const text=summary(report,mode,changes);
  if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,text+'\n');
  else console.log(text);
}
if(require.main===module){try{main();}catch(e){console.error('Legacy management:',e.message);process.exitCode=1;}}
module.exports={inspect,inspectAll,migrate,candidateIds,summary};
