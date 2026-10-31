'use strict';
// Read-only production-data check. Unlike unit tests, this intentionally reads
// real repository data, but makes NO assumptions about names, order or count.
const assert = require('node:assert/strict');
const {readData} = require('../scripts/manage_content.cjs');
for (const resource of ['members','news','events','videos','collabs','projects','streams']) {
  const rows = readData(resource);
  assert.ok(Array.isArray(rows), `${resource} must be an array`);
  for (const row of rows) {
    assert.ok(row && typeof row==='object' && !Array.isArray(row),
      `${resource} must contain objects`);
  }
}
const config = readData('recruitment');
assert.ok(config && typeof config==='object' && !Array.isArray(config));
console.log('PASS: public content JavaScript loads without assuming fixed records');
