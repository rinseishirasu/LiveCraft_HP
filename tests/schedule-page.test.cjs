/* Ver.5.0.5 regression guard: a schedule is only visible when member data
 * loads before stream-engine.js. Run: node tests/schedule-page.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const html = fs.readFileSync(path.join(root,'schedule.html'),'utf8');
const scripts = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1]);
const dependencies = [
  'assets/members.js',
  'assets/member-routing.js',
  'assets/streams.js',
  'assets/stream-engine.js',
  'assets/stream-widgets.js'
];
for (const f of dependencies) {
  assert.equal(scripts.filter(s=>s===f).length,1,`schedule.html must load exactly one ${f}`);
  assert.ok(fs.existsSync(path.join(root,f)),`Missing file ${f}`);
}
for(let i=1;i<dependencies.length;i++) {
  assert.ok(scripts.indexOf(dependencies[i-1]) < scripts.indexOf(dependencies[i]),
    `${dependencies[i-1]} must load before ${dependencies[i]}`);
}
console.log('Schedule page dependency regression test passed.');
