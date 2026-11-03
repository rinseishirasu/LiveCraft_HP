'use strict';
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pages=fs.readdirSync(root).filter(x=>x.endsWith('.html'));
assert.equal(pages.length,24,'Existing 24 public HTML pages must be retained');
for(const p of pages){const s=read(p);assert.match(s, /version-seven/,p+' missing new theme marker');assert.match(s, /assets\/v7\.css/,p+' missing v7 theme CSS');assert.match(s,/assets\/v7\.js/,p+' missing v7 enhancements');}
const front=read('index.html');assert.match(front, /lc7-pulse-strip/);assert.match(front,/members\.html/);assert.match(front,/projects\.html/);
const studioHtml=read('studio/index.html');assert.match(studioHtml,/CREATOR DESK 7\.0/);assert.match(studioHtml,/公開前/);assert.match(studioHtml,/studio\.js/);
const studioJs=read('studio/studio.js');for(const k of ['members','streams','projects','news','videos','events','collabs'])assert.ok(studioJs.includes(k+':{'),k+' missing');
for(const pattern of [/\beval\s*\(/,/localStorage/,/sessionStorage/,/fetch\s*\(/,/XMLHttpRequest/,/github_pat_/,/ghp_[A-Za-z0-9]/])assert.doesNotMatch(studioJs,pattern,'Do not use privileged or remote management in the public-only editor');
assert.match(studioJs,/JSON\.parse/);assert.match(studioJs,/JSON\.stringify/);assert.match(studioJs,/createObjectURL/);assert.match(studioJs,/\/\^https:/);
const build=read('scripts/build_site.py');assert.match(build, /copytree\(ROOT\/'studio'/);
const dataFiles=['members.js','streams.js','projects.js','news.js','videos.js','events.js','collabs.js'];dataFiles.forEach(f=>assert.ok(fs.existsSync(path.join(root,'assets',f))));
console.log('PASS V7.0: 24 public pages retain hooks, responsive theme, local-only Creator Desk, 7 data editors, and build integration');

// Ver.7.0.5 generation colors: 11 explicit presets, including GEN 00, consistent throughout UI.
const vm=require('node:vm');
const sandbox={window:{}};
vm.runInNewContext(read('assets/generation-colors.js'),sandbox);
const gens=sandbox.window.LiveCraftGenerationColors;
assert.equal(gens.presets.length,11);
assert.deepEqual(Array.from(gens.presets,p=>p.generation),Array.from({length:11},(_,i)=>i));
assert.equal(new Set(Array.from(gens.presets,p=>p.accent)).size,11,'Generation accents must be distinct');
for(const p of gens.presets){
 for(const key of ['accent','soft','dark'])assert.match(p[key],/^#[0-9A-F]{6}$/i);
 assert.equal(gens.presetFor(p.generation).name,p.name);
 assert.equal(gens.labelFor(p.generation),`${p.generation}期生`);
}
assert.equal(gens.generationOf({generation:0}),0);
assert.equal(gens.generationOf({}),null);
assert.equal(gens.presetFor(11),null);
assert.equal(gens.accentFor(11),gens.unassigned.accent);
const routeScope={window:{LiveCraftGenerationColors:gens},document:{baseURI:'https://example.com/'},URL,URLSearchParams,encodeURIComponent};
vm.runInNewContext(read('assets/member-routing.js'),routeScope);
assert.equal(routeScope.window.LiveCraftMembers.generationColor({generation:0}),gens.presets[0].accent);
assert.equal(routeScope.window.LiveCraftMembers.generationColor({generation:10}),gens.presets[10].accent);
for(const p of ['index.html','members.html','member.html']) {
 const page=read(p);
 assert.ok(page.indexOf('assets/generation-colors.js') < page.indexOf('assets/member-routing.js'),'Palette must load before routing: '+p);
}
assert.match(read('studio/index.html'),/assets\/generation-colors\.js/);
assert.match(read('studio/studio.js'),/generation-palette-guide/);
assert.match(read('assets/members-page.js'),/member\.generation >= 0/);
assert.match(read('assets/v41.js'),/generationColors\?\.accentFor/);
assert.match(read('assets/profile-ui.js'),/member\.generation >= 0/);
console.log('PASS V7.0.5: 0–10 generation presets, 0 not unassigned, matching member/home/studio colors');
