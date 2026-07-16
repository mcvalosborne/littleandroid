'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  SAVE_KEY,
  SAVE_VERSION,
  defaultProgress,
  parseProgress,
  loadProgress,
  scopeProgressToChallenge,
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
    version: SAVE_VERSION,
    challengeDate: '2026-07-16',
    discoveredFragments: ['a', 'a', 4],
    collectedFragments: ['a'],
    discoveredNPCs: ['scout'],
    complete: true,
    injected: '<script>',
  });
  assert.deepEqual(parsed, {
    version: SAVE_VERSION,
    challengeDate: '2026-07-16',
    discoveredFragments: ['a'],
    collectedFragments: ['a'],
    discoveredNPCs: ['scout'],
    complete: true,
  });
});

test('daily progress restores only for the matching challenge date', () => {
  const completed = {
    ...defaultProgress(),
    challengeDate: '2026-07-15',
    discoveredFragments: ['field-coil'],
    collectedFragments: ['field-coil'],
    complete: true,
  };
  assert.deepEqual(scopeProgressToChallenge(completed, '2026-07-15'), completed);
  assert.deepEqual(scopeProgressToChallenge(completed, '2026-07-16'), {
    ...defaultProgress(),
    challengeDate: '2026-07-16',
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
