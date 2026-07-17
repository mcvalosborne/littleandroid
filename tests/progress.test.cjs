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
  mergeProgress,
  saveProgress,
  clearProgress,
  CAMPAIGN_KEY,
  createLevelStorage,
  defaultCampaign,
  parseCampaign,
  loadCampaign,
  saveCampaign,
  isLevelUnlocked,
  completeCampaignLevel,
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
    generation: 0,
    discoveredFragments: ['a'],
    collectedFragments: ['a'],
    discoveredNPCs: ['scout'],
    complete: true,
  });
});

test('version one saves migrate resident discoveries', () => {
  const migrated = parseProgress({
    version: 1,
    discoveredFragments: ['field-coil'],
    collectedFragments: ['field-coil'],
    discoveredNPCs: ['OVERSEER'],
    complete: true,
  });
  assert.deepEqual(migrated, {
    ...defaultProgress(),
    discoveredFragments: ['field-coil'],
    collectedFragments: ['field-coil'],
    discoveredNPCs: ['OVERSEER'],
    complete: true,
  });
  assert.deepEqual(scopeProgressToChallenge(migrated, '2026-07-16'), {
    ...migrated,
    challengeDate: '2026-07-16',
  });
});

test('daily progress restores only for the matching challenge date', () => {
  const completed = {
    ...defaultProgress(),
    challengeDate: '2026-07-15',
    discoveredFragments: ['field-coil'],
    collectedFragments: ['field-coil'],
    discoveredNPCs: ['OVERSEER'],
    complete: true,
  };
  assert.deepEqual(scopeProgressToChallenge(completed, '2026-07-15'), completed);
  const rolled = scopeProgressToChallenge(completed, '2026-07-16');
  assert.deepEqual(rolled, {
    ...defaultProgress(),
    challengeDate: '2026-07-16',
    generation: 1,
    discoveredNPCs: ['OVERSEER'],
  });
  assert.deepEqual(mergeProgress(rolled, completed, ['field-coil']), rolled);
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
  assert.deepEqual(mergeProgress(firstTab, staleTab, ['field-coil']), {
    ...defaultProgress(),
    discoveredFragments: ['field-coil'],
    collectedFragments: ['field-coil'],
    discoveredNPCs: ['OVERSEER'],
    complete: true,
  });
});

test('a newer reset generation defeats stale tab writes', () => {
  const reset = { ...defaultProgress(), generation: 2 };
  const stale = {
    ...defaultProgress(),
    generation: 1,
    collectedFragments: ['field-coil'],
    complete: true,
  };
  assert.deepEqual(mergeProgress(reset, stale, ['field-coil']), reset);
});

test('level storage isolates saves while preserving the original river key', () => {
  const storage = memoryStorage();
  const river = createLevelStorage(storage, 'river-factory');
  const relay = createLevelStorage(storage, 'flooded-relay');
  river.setItem(SAVE_KEY, 'river');
  relay.setItem(SAVE_KEY, 'relay');
  assert.equal(storage.getItem(SAVE_KEY), 'river');
  assert.equal(storage.getItem(`${SAVE_KEY}.flooded-relay`), 'relay');
  assert.equal(river.getItem(SAVE_KEY), 'river');
  assert.equal(relay.getItem(SAVE_KEY), 'relay');
});

test('campaign completion unlocks levels sequentially', () => {
  const ids = ['river-factory', 'flooded-relay', 'overgrown-archive'];
  const initial = defaultCampaign(ids);
  assert.equal(isLevelUnlocked(initial, ids[0], ids), true);
  assert.equal(isLevelUnlocked(initial, ids[1], ids), false);

  const afterRiver = completeCampaignLevel(initial, ids[0], ids);
  assert.equal(isLevelUnlocked(afterRiver, ids[1], ids), true);
  assert.equal(isLevelUnlocked(afterRiver, ids[2], ids), false);

  const storage = memoryStorage();
  assert.equal(saveCampaign(storage, { ...afterRiver, activeLevelId: ids[1] }, ids), true);
  assert.equal(storage.getItem(CAMPAIGN_KEY) !== null, true);
  assert.deepEqual(loadCampaign(storage, ids), { ...afterRiver, activeLevelId: ids[1] });
  assert.deepEqual(parseCampaign('{broken', ids), initial);
});
