'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  DIR,
  oppositeDir,
  createWorldMap,
  findPath,
  entityOccupiesTile,
  isTileReserved,
  tickTimedItems,
  isGateOpen,
  canCollectObjective,
} = require('../src/game-logic.js');

test('direction helpers remain stable', () => {
  assert.deepEqual(DIR.north, { dx: 0, dy: -1 });
  assert.equal(oppositeDir('east'), 'west');
});

test('world generation is deterministic for a seed', () => {
  const first = createWorldMap(77);
  const second = createWorldMap(77);
  assert.deepEqual(first, second);
  assert.equal(first.width, 24);
  assert.equal(first.height, 20);
});

test('pathfinding routes around blocked tiles', () => {
  const blocked = new Set(['1,0']);
  const isWalkable = (x, y) => x >= 0 && y >= 0 && x < 3 && y < 3 && !blocked.has(`${x},${y}`);
  const path = findPath(0, 0, 2, 0, isWalkable);
  assert.deepEqual(path, [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 0 },
  ]);
});

test('pathfinding chooses a nearby walkable target for scenery clicks', () => {
  const isWalkable = (x, y) => x === 1 && y === 2;
  assert.deepEqual(findPath(1, 2, 2, 2, isWalkable), [{ x: 1, y: 2 }]);
});

test('moving entities reserve their source and destination tiles', () => {
  const moving = {
    tileX: 9,
    tileY: 11,
    moving: true,
    moveToX: 10,
    moveToY: 11,
  };
  assert.equal(entityOccupiesTile(moving, 9, 11), true);
  assert.equal(entityOccupiesTile(moving, 10, 11), true);
  assert.equal(isTileReserved([moving], 10, 11), true);
  assert.equal(isTileReserved([moving], 10, 11, moving), false);
});

test('timed labels use elapsed time instead of frame count', () => {
  const items = [{ timer: 2 }, { timer: 0.25 }];
  const remaining = tickTimedItems(items, 0.5);
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].timer, 1.5);
});

test('relay gates open only after their linked objective', () => {
  const gate = { x: 8, y: 10, after: 'intake-relay' };
  assert.equal(isGateOpen(gate, []), false);
  assert.equal(isGateOpen(gate, ['spillway-relay']), false);
  assert.equal(isGateOpen(gate, ['intake-relay']), true);
});

test('archive objectives enforce the configured daily sequence', () => {
  const order = ['root-index', 'canopy-memory', 'moss-ledger'];
  assert.equal(canCollectObjective('sequence', order, [], 'canopy-memory'), false);
  assert.equal(canCollectObjective('sequence', order, [], 'root-index'), true);
  assert.equal(canCollectObjective('sequence', order, ['root-index'], 'canopy-memory'), true);
  assert.equal(canCollectObjective('gates', order, [], 'moss-ledger'), true);
});
