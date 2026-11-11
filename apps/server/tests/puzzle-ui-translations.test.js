'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const dataDir = resolve(__dirname, '../src/data');
const webDir = resolve(__dirname, '../../web');
const sourceFiles = [
  'app/puzzle/page.client.tsx',
  'app/puzzle/ranking/page.tsx',
  'app/puzzle/archive/page.tsx',
  'app/puzzle/mypage/page.tsx',
  'components/puzzle/header.tsx',
  'components/puzzle/footer.tsx',
  'components/puzzle/language-toggle.tsx',
];

test('puzzle translation seeds have unique keys and two complete languages', () => {
  const keys = new Set();
  for (let i = 1; i <= 6; i++) {
    const rows = JSON.parse(readFileSync(resolve(dataDir, `puzzle-ui-translations-0${i}.json`), 'utf8'));
    for (const row of rows) {
      assert.equal(typeof row.key, 'string');
      assert.ok(row.key.startsWith('puzzle.'), row.key);
      assert.ok(typeof row.ko === 'string' && row.ko.trim(), row.key);
      assert.ok(typeof row.en === 'string' && row.en.trim(), row.key);
      assert.ok(!keys.has(row.key), `Duplicate translation: ${row.key}`);
      keys.add(row.key);
    }
  }
  for (const key of ['puzzle.metadata.pageTitle', 'puzzle.metadata.description', 'puzzle.metadata.shareTitle']) {
    assert.ok(keys.has(key), key);
  }
  const missing = [];
  for (const path of sourceFiles) {
    const source = readFileSync(resolve(webDir, path), 'utf8');
    for (const match of source.matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) {
      if (!keys.has(match[1])) missing.push(`${path}: ${match[1]}`);
    }
  }
  assert.deepEqual(missing, []);
});
