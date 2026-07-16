'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { SIGNAL_FRAGMENTS, NPC_DIALOGUE } = require('../src/game-content.js');
const { createWorldMap } = require('../src/game-logic.js');

test('signal fragments have unique identities and walkable positions', () => {
  const { map, width, height } = createWorldMap(77);
  const blockedTiles = new Set([4, 5, 6, 7, 8, 9, 11, 13, 14, 17]);
  const ids = new Set();
  const positions = new Set();

  for (const fragment of SIGNAL_FRAGMENTS) {
    assert.equal(ids.has(fragment.id), false, `duplicate id: ${fragment.id}`);
    ids.add(fragment.id);
    const position = `${fragment.x},${fragment.y}`;
    assert.equal(positions.has(position), false, `duplicate position: ${position}`);
    positions.add(position);
    assert.ok(fragment.x >= 0 && fragment.x < width);
    assert.ok(fragment.y >= 0 && fragment.y < height);
    assert.equal(blockedTiles.has(map[fragment.y][fragment.x]), false, `${fragment.name} must be walkable`);
  }
});

test('every resident type has active and completed dialogue', () => {
  for (const type of ['worker', 'scout', 'elder', 'farmer', 'mechanic', 'child', 'dog']) {
    assert.equal(typeof NPC_DIALOGUE[type].active, 'string');
    assert.equal(typeof NPC_DIALOGUE[type].complete, 'string');
    assert.ok(NPC_DIALOGUE[type].active.length > 0);
    assert.ok(NPC_DIALOGUE[type].complete.length > 0);
  }
});
