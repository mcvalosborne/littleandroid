'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { SIGNAL_FRAGMENTS, NPC_DIALOGUE, LEVELS, LEVEL_IDS } = require('../src/game-content.js');
const { createWorldMap, createLevelMap, findPath, isGateOpen } = require('../src/game-logic.js');

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

test('all campaign levels have unique objectives on valid map tiles', () => {
  assert.deepEqual(LEVEL_IDS, ['river-factory', 'flooded-relay', 'overgrown-archive']);
  for (const level of LEVELS) {
    const world = createLevelMap(level.id, level.seed);
    const ids = new Set();
    for (const objective of level.objectives) {
      assert.equal(ids.has(objective.id), false, `${level.id} has duplicate objective ${objective.id}`);
      ids.add(objective.id);
      assert.ok(objective.x >= 0 && objective.x < world.width);
      assert.ok(objective.y >= 0 && objective.y < world.height);
      assert.equal([4, 5, 6, 7, 8, 9, 11, 13, 14, 17, 18].includes(world.map[objective.y][objective.x]), false);
    }
    assert.equal(level.objectives.length, 3);
  }
});

test('flooded relay gates connect its three platforms in order', () => {
  const relay = LEVELS[1];
  const world = createLevelMap(relay.id);
  assert.deepEqual(relay.gates.map(gate => world.map[gate.y][gate.x]), [18, 18]);
  assert.deepEqual(relay.gates.map(gate => gate.after), ['intake-relay', 'spillway-relay']);
});

test('every level objective is reachable under its progression rules', () => {
  const blockedTiles = new Set([4, 5, 6, 7, 8, 9, 11, 13, 14, 17]);
  for (const level of LEVELS) {
    const world = createLevelMap(level.id, level.seed);
    const collected = [];
    let position = level.spawn;
    const walkable = (x, y) => {
      if (x < 0 || y < 0 || x >= world.width || y >= world.height) return false;
      const tile = world.map[y][x];
      if (tile === 18) {
        const gate = level.gates.find(item => item.x === x && item.y === y);
        return isGateOpen(gate, collected);
      }
      return !blockedTiles.has(tile);
    };
    for (const objective of level.objectives) {
      const path = findPath(position.x, position.y, objective.x, objective.y, walkable, { allowNearest: false });
      assert.ok(path.length > 0, `${objective.name} must be reachable in ${level.name}`);
      collected.push(objective.id);
      position = objective;
    }
  }
});
