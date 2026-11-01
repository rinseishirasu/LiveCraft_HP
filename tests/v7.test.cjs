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
