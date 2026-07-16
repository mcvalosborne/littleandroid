'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  SAVE_KEY,
  defaultProgress,
  parseProgress,
  loadProgress,
  mergeProgress,
  saveProgress,
  clearProgress,
} = require('../src/progress.js');

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
}

test('invalid and outdated saves reset safely', () => {
  assert.deepEqual(parseProgress('{broken'), defaultProgress());
  assert.deepEqual(parseProgress({ version: 0, complete: true }), defaultProgress());
});

test('progress normalizes lists and ignores unknown fields', () => {
  const parsed = parseProgress({
    version: 1,
    discoveredFragments: ['a', 'a', 4],
    collectedFragments: ['a'],
    discoveredNPCs: ['scout'],
    complete: true,
    injected: '<script>',
  });
  assert.deepEqual(parsed, {
    version: 1,
    discoveredFragments: ['a'],
    collectedFragments: ['a'],
    discoveredNPCs: ['scout'],
    complete: true,
  });
});

test('progress round-trips and clears through storage', () => {
  const storage = memoryStorage();
  const progress = { ...defaultProgress(), discoveredNPCs: ['OVERSEER'] };
  assert.equal(saveProgress(storage, progress), true);
  assert.equal(storage.getItem(SAVE_KEY) !== null, true);
  assert.deepEqual(loadProgress(storage), progress);
  assert.equal(clearProgress(storage), true);
  assert.deepEqual(loadProgress(storage), defaultProgress());
});

test('progress merges monotonically across stale tabs', () => {
  const firstTab = {
    ...defaultProgress(),
    discoveredFragments: ['field-coil'],
    collectedFragments: ['field-coil'],
  };
  const staleTab = {
    ...defaultProgress(),
    discoveredNPCs: ['OVERSEER'],
  };
  assert.deepEqual(mergeProgress(firstTab, staleTab), {
    ...defaultProgress(),
    discoveredFragments: ['field-coil'],
    collectedFragments: ['field-coil'],
    discoveredNPCs: ['OVERSEER'],
  });
});
