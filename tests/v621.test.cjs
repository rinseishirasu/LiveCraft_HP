'use strict';
// Ver.6.2.1 regression: nested member image paths are accepted for LOOK BOOK,
// traversal remains blocked, and Actions never references absent test files.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const {apply, readData} = require('../scripts/manage_content.cjs');
const {seedEmptyPublicData} = require('./_fixtures.cjs');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'livecraft-v621-'));
try {
  seedEmptyPublicData(temp);
  const avatar = 'assets/members/creator-a/icon.png';
  const fullbody = 'assets/members/creator-a/full-body.png';
  const outfits = [
    {label: '魔法の衣装', image: 'assets/members/creator-a/magic.png'},
    {label: '別衣装', image: 'assets/members/creator-a/looks/alternate.webp'}
  ];
  apply('members', {
    id: 'creator-a', name: 'テスト配信者', published: 'true',
    avatar, fullbody, extras_json: JSON.stringify({outfits})
  }, temp);
  const saved = readData('members', temp)[0];
  assert.equal(saved.avatar, avatar);
  assert.equal(saved.fullbody, fullbody);
  assert.equal(saved.outfits.length, 2);
  assert.deepEqual(saved.outfits, outfits);

  // UPDATE does not erase existing fields or the already registered LOOK BOOK.
  apply('members', {id: 'creator-a', role: 'メンバー'}, temp);
  const updated = readData('members', temp)[0];
  assert.equal(updated.outfits.length, 2);
  assert.equal(updated.fullbody, fullbody);

  // Client-side validation must agree with the GitHub Actions writer.
  const context = {
    window: {}, document: {baseURI: 'https://example.com/'},
    URL, URLSearchParams, encodeURIComponent
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/member-routing.js'), 'utf8'), context);
  const routing = context.window.LiveCraftMembers;
  assert.equal(routing.safeAvatar(fullbody), fullbody);
  assert.equal(routing.safeAvatar(outfits[1].image), outfits[1].image);
  assert.equal(routing.safeProfileIcon(updated), avatar);
  for (const unsafe of [
    'assets/members/../secret.png',
    'assets/members/creator-a/../secret.png',
    'assets/members/creator-a//image.png',
    'https://example.com/image.png',
    'assets/members/creator-a/image.svg'
  ]) {
    assert.equal(routing.safeAvatar(unsafe), null, `unsafe path accepted: ${unsafe}`);
    assert.throws(() => apply('members', {
      id: 'creator-a', extras_json: JSON.stringify({outfits: [{label: 'NG', image: unsafe}]})
    }, temp), /outfit\.image/);
  }
  const ui = fs.readFileSync(path.join(root, 'assets/v61.js'), 'utf8');
  assert.match(ui, /M\.safeAvatar\(image\)/, 'LOOK BOOK must use nested-path-aware validator');

  // Future releases must not invoke or require test scripts absent from packages.
  const workflowsDir = path.join(root, '.github/workflows');
  for (const file of fs.readdirSync(workflowsDir).filter(x => /\.ya?ml$/.test(x))) {
    const yaml = fs.readFileSync(path.join(workflowsDir, file), 'utf8');
    for (const [relative] of yaml.matchAll(/tests\/[A-Za-z0-9_.-]+\.test\.cjs/g)) {
      assert.ok(fs.existsSync(path.join(root, relative)), `${file} references missing ${relative}`);
    }
  }
  console.log('PASS V6.2.1: nested LOOK BOOK images, safe paths, partial updates, referenced tests present');
} finally {
  fs.rmSync(temp, {recursive: true, force: true});
}
