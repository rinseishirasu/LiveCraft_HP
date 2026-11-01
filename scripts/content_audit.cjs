#!/usr/bin/env node
/* Live Craft 6.3: read-only public-content integrity audit; no personal/private data. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {readData,parseField}=require('./manage_content.cjs');
const ROOT=path.resolve(__dirname,'..');
const types=['members','streams','news','videos','events','collabs','projects'];
const idFormat=/^[a-z0-9][a-z0-9-]{0,63}$/;
function audit(root=ROOT){
 const errors=[],warnings=[],stats={};const data={};
 for(const resource of types){
  try{data[resource]=readData(resource,root);}catch(e){errors.push(`${resource}: 読込失敗 ${e.message}`);data[resource]=[];}
  stats[resource]=data[resource].length;
  const seen=new Set();
  data[resource].forEach((r,i)=>{
    const hint=`${resource}[${i}]`;
    if(!r||typeof r!=='object'||Array.isArray(r)){errors.push(`${hint}: データはオブジェクト形式で登録してください`);return;}
    if(typeof r.id!=='string'||!idFormat.test(r.id)){errors.push(`${hint}: 固定IDの形式が不正です`);}else if(seen.has(r.id)){errors.push(`${resource}: ID重複 ${r.id}`);}else seen.add(r.id);
    if(r.published!==true&&r.published!==false)errors.push(`${hint}: publishedはtrue/falseで指定してください`);
  });
 }
 const members=new Map(data.members.filter(x=>x&&x.published===true&&typeof x.id==='string').map(x=>[x.id,x]));
 const memberByName=new Map(data.members.filter(x=>x&&x.published===true&&typeof x.name==='string').map(x=>[x.name,x]));
 const checkImage=(v,hint)=>{
   if(typeof v!=='string'||!v.trim())return;
   if(!/^assets\/(?:members|streams|projects|videos|events|news|collabs)\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+\.(?:png|jpg|jpeg|webp|avif)$/i.test(v)){
     warnings.push(`${hint}: 画像パスの形式を確認してください (${v.slice(0,100)})`);return;
   }
   const absolute=path.resolve(root,v);
   if(!absolute.startsWith(path.resolve(root,'assets')+path.sep)){
     errors.push(`${hint}: 画像パスがassets外を参照しています`);return;
   }
   if(!fs.existsSync(absolute))warnings.push(`${hint}: 画像ファイルが見つかりません (${v})`);
 };
 for(const m of data.members){if(!m||typeof m!=='object')continue;
  const id=m.id||'(IDなし)';
  if(m.published===true&&!m.name)errors.push(`members/${id}: 公開中メンバーに名前がありません`);
  checkImage(m.avatar,`members/${id}.avatar`);checkImage(m.fullbody,`members/${id}.fullbody`);
  if(m.outfits!==undefined){if(!Array.isArray(m.outfits)||m.outfits.length>8)errors.push(`members/${id}: outfitsは最大8件の配列です`);
   else for(const [i,outfit] of m.outfits.entries()){if(!outfit||typeof outfit!=='object'||Array.isArray(outfit)){errors.push(`members/${id}.outfits[${i}]: 形式不正`);continue;}checkImage(outfit.image,`members/${id}.outfits[${i}]`);}
  }
 }
 for(const s of data.streams){if(!s||s.published!==true)continue;
  const id=s.id||'(IDなし)';
  if(!members.has(s.memberId))errors.push(`streams/${id}: 公開メンバーのID '${String(s.memberId)}' が見つかりません`);
  let start=NaN,end=NaN;
  try{start=Date.parse(parseField(s.startAt,'datetimeJst','startAt'));end=Date.parse(parseField(s.endAt,'datetimeJst','endAt'));}catch(e){errors.push(`streams/${id}: 日時形式が不正です: ${e.message}`);}
  if(Number.isFinite(start)&&Number.isFinite(end)&&(end<=start||end-start>86400000))errors.push(`streams/${id}: 終了日時は開始日時より後、24時間以内にしてください`);
  if(s.repeat==='weekly'||s.repeat==='biweekly'){
   if(!s.repeatUntil)errors.push(`streams/${id}: 定期配信のrepeatUntilがありません`);
   else if(Number.isFinite(start)&&Date.parse(s.repeatUntil+'T00:00:00+09:00')<start-86400000)warnings.push(`streams/${id}: repeatUntilが開始日より前です`);
  }
  checkImage(s.thumbnail,`streams/${id}.thumbnail`);
 }
 for(const resource of ['news','videos','events','collabs','projects'])for(const row of data[resource]){
   if(!row||row.published!==true)continue;
   const id=row.id||'(IDなし)';
   for(const field of ['thumbnail','cover'])checkImage(row[field],`${resource}/${id}.${field}`);
   const ids=Array.isArray(row.members)?row.members:[];
   for(const member of ids){if(typeof member==='string'&&!members.has(member)&&!memberByName.has(member))warnings.push(`${resource}/${id}: 関連メンバー '${member}' が公開メンバーと一致しません`);}
 }
 return {errors,warnings,stats};
}
function report(result){
 const {errors,warnings,stats}=result;
 return `# Live Craft 公開データ整合性チェック\n\n- エラー：${errors.length} 件\n- 注意：${warnings.length} 件\n\n## データ件数\n${Object.entries(stats).map(([k,v])=>`- ${k}: ${v}`).join('\n')}\n\n## エラー\n${errors.length?errors.map(x=>'- '+x).join('\n'):'- なし'}\n\n## 注意（公開を停止しない確認事項）\n${warnings.length?warnings.map(x=>'- '+x).join('\n'):'- なし'}\n`;
}
if(require.main===module){
 const strict=process.argv.includes('--strict');const idx=process.argv.indexOf('--output');const out=idx>=0?process.argv[idx+1]:'';
 const result=audit();const md=report(result);
 if(out){fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,md,'utf8');}
 console.log(`Live Craft audit: ${result.errors.length} errors / ${result.warnings.length} warnings`);
 for(const err of result.errors)console.error('::error::'+err);
 for(const warning of result.warnings.slice(0,15))console.warn('::warning::'+warning);
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,md);
 if(strict&&result.errors.length)process.exitCode=1;
}
module.exports={audit,report};
