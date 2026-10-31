'use strict';
// Test-only, deterministic data. Never copy actual published member/content data
// into unit-test fixtures: GitHub repositories may already contain real records.
const fs = require('node:fs');
const path = require('node:path');
const VARIABLES = Object.freeze({
  members:'LIVE_CRAFT_MEMBERS',
  streams:'LIVE_CRAFT_STREAMS',
  news:'LIVE_CRAFT_NEWS',
  videos:'LIVE_CRAFT_VIDEOS',
  events:'LIVE_CRAFT_EVENTS',
  collabs:'LIVE_CRAFT_COLLABS',
  config:'LIVE_CRAFT_CONFIG'
});
function seedEmptyPublicData(root) {
  const assets = path.join(root, 'assets');
  fs.mkdirSync(assets, {recursive:true});
  for (const [key, variable] of Object.entries(VARIABLES)) {
    const initial = key==='config'
      ? {recruitmentOpen:false, recruitmentMode:'manual', applicationUrl:'', contactUrl:'', rulesEffectiveDate:'未定', rulesVersion:'1.0'}
      : [];
    fs.writeFileSync(path.join(assets, `${key}.js`),
      `window.${variable} = ${JSON.stringify(initial, null, 2)};\n`, 'utf8');
  }
}
module.exports = {seedEmptyPublicData};
