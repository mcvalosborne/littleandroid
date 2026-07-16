'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { DIR, oppositeDir, createWorldMap, findPath } = require('../src/game-logic.js');

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
