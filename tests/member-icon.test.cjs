// Ver.5.0.3 member icon and fullbody separation tests.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const base=path.join(__dirname,'..','assets');
const script=fs.readFileSync(path.join(base,'member-routing.js'),'utf8');
const scope={window:{},document:{baseURI:'https://example.com/live-craft/'},URL,URLSearchParams,encodeURIComponent};
vm.runInNewContext(script,scope);
const r=scope.window.LiveCraftMembers;
assert.equal(r.safeProfileIcon({avatar:'assets/members/icon.webp',fullbody:'assets/members/standing.webp'}),'assets/members/icon.webp');
assert.equal(r.safeProfileIcon({avatar:'assets/members/standing.webp',fullbody:'assets/members/standing.webp'}),null);
assert.equal(r.safeProfileIcon({fullbody:'assets/members/standing.webp'}),null);
assert.equal(r.safeProfileIcon({avatar:'../unsafe.png',fullbody:'assets/members/standing.webp'}),null);
for(const js of ['members-page.js','profile-ui.js']){
 const code=fs.readFileSync(path.join(base,js),'utf8');
 assert.match(code,/avatarPath\(member\.avatar\) !== fullbodyPath\(member\.fullbody\)/);
 assert.match(code,/const fullbody = fullbodyPath\(member\.fullbody\)/);
}
console.log('Member icon image separation: all checks passed');
