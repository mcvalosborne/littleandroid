(function exposeGameLogic(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LittleAndroidLogic = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createGameLogic() {
  'use strict';

  const DIR = Object.freeze({
    south: Object.freeze({ dx: 0, dy: 1 }),
    north: Object.freeze({ dx: 0, dy: -1 }),
    east: Object.freeze({ dx: 1, dy: 0 }),
    west: Object.freeze({ dx: -1, dy: 0 }),
  });

  const OPPOSITE_DIR = Object.freeze({
    south: 'north',
    north: 'south',
    east: 'west',
    west: 'east',
  });

  function oppositeDir(direction) {
    return OPPOSITE_DIR[direction];
  }

  function mulberry32(seed) {
    return function random() {
      let value = seed |= 0;
      seed = value + 0x6D2B79F5 | 0;
      value = Math.imul(seed ^ seed >>> 15, 1 | seed);
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function createWorldMap(seed = 77) {
    const width = 24;
    const height = 20;
    const map = Array.from({ length: height }, () => Array(width).fill(0));
    const random = mulberry32(seed);

    for (let y = 1; y <= 5; y++) {
      for (let x = 1; x <= 8; x++) map[y][x] = y === 1 ? 9 : 8;
    }
    map[0][3] = 11;
    map[0][7] = 11;
    map[5][4] = 10;
    map[5][5] = 10;

    for (let y = 0; y < height; y++) {
      map[y][17] = 17;
      map[y][18] = 5;
      map[y][19] = 4;
      map[y][20] = 5;
      map[y][21] = 17;
    }

    for (let x = 17; x <= 21; x++) {
      map[9][x] = 13;
      map[10][x] = 12;
      map[11][x] = 12;
      map[12][x] = 13;
    }

    for (let y = 6; y <= 10; y++) {
      map[y][4] = 2;
      map[y][5] = 2;
    }
    for (let x = 5; x <= 17; x++) {
      map[10][x] = 2;
      map[11][x] = 2;
    }

    const grassPatches = [
      [10, 2, 14, 5],
      [12, 6, 16, 9],
      [1, 13, 6, 17],
      [8, 14, 13, 18],
    ];
    for (const [x1, y1, x2, y2] of grassPatches) {
      for (let y = y1; y <= Math.min(y2, height - 1); y++) {
        for (let x = x1; x <= Math.min(x2, width - 1); x++) {
          if (map[y][x] === 0 && random() < 0.6) map[y][x] = 1;
        }
      }
    }

    const trees = [
      [15, 2], [16, 4], [15, 6], [16, 8], [15, 14], [16, 16],
      [13, 3], [14, 7], [13, 13], [14, 17], [3, 8], [7, 7],
      [10, 8], [1, 11], [8, 12], [11, 1], [12, 3],
    ];
    for (const [x, y] of trees) {
      if (y >= 0 && y < height && x < width) {
        if (map[y][x] === 0 || map[y][x] === 1) map[y][x] = 6;
        if (y + 1 < height && (map[y + 1][x] === 0 || map[y + 1][x] === 1)) {
          map[y + 1][x] = 7;
        }
      }
    }

    for (const [x, y] of [[12, 10], [2, 15], [9, 17], [16, 13]]) {
      if (map[y][x] === 0 || map[y][x] === 1) map[y][x] = 14;
    }
    if (map[9][6] === 0 || map[9][6] === 2) map[9][6] = 15;
    if (map[6][3] === 0) map[6][3] = 16;

    return { width, height, map };
  }

  function createFloodedRelayMap() {
    const width = 24;
    const height = 20;
    const map = Array.from({ length: height }, () => Array(width).fill(5));

    const carvePlatform = (x1, y1, x2, y2, tile) => {
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) map[y][x] = tile;
      }
    };
    carvePlatform(1, 3, 7, 16, 2);
    carvePlatform(9, 2, 15, 17, 10);
    carvePlatform(17, 3, 22, 16, 2);

    for (const x of [7, 8, 9, 15, 16, 17]) map[10][x] = 12;
    map[10][8] = 18;
    map[10][16] = 18;

    for (const [x, y] of [[2, 4], [6, 15], [10, 3], [14, 16], [18, 4], [21, 15]]) {
      map[y][x] = 15;
    }
    for (const [x, y] of [[3, 8], [12, 8], [20, 12]]) map[y][x] = 10;

    return { width, height, map };
  }

  function createOvergrownArchiveMap(seed = 191) {
    const width = 24;
    const height = 20;
    const map = Array.from({ length: height }, () => Array(width).fill(0));
    const random = mulberry32(seed);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (random() < 0.38) map[y][x] = 1;
      }
    }
    for (let x = 0; x < width; x++) {
      map[0][x] = 14;
      map[height - 1][x] = 14;
    }
    for (let y = 0; y < height; y++) {
      map[y][0] = 14;
      map[y][width - 1] = 14;
    }

    for (let y = 1; y <= 14; y++) map[y][8] = 8;
    for (const y of [5, 11]) map[y][8] = 2;
    for (let y = 5; y <= 18; y++) map[y][16] = 8;
    for (const y of [9, 15]) map[y][16] = 2;
    for (let x = 8; x <= 16; x++) map[9][x] = 9;
    map[9][12] = 2;

    for (const [x, y] of [[3, 2], [6, 3], [3, 15], [6, 17], [11, 2], [14, 4], [11, 14], [14, 17], [19, 2], [21, 7], [19, 17]]) {
      map[y][x] = 6;
      if (y + 1 < height - 1) map[y + 1][x] = 7;
    }
    for (const [x, y] of [[4, 8], [12, 4], [20, 11]]) map[y][x] = 15;

    return { width, height, map };
  }

  function createLevelMap(levelId, seed) {
    if (levelId === 'flooded-relay') return createFloodedRelayMap();
    if (levelId === 'overgrown-archive') return createOvergrownArchiveMap(seed || 191);
    return createWorldMap(seed || 77);
  }

  function findPath(startX, startY, endX, endY, isWalkable, options = {}) {
    const sx = Math.round(startX);
    const sy = Math.round(startY);
    let ex = Math.round(endX);
    let ey = Math.round(endY);

    if (!isWalkable(ex, ey)) {
      if (options.allowNearest === false) return [];
      let best = null;
      let bestDistance = Infinity;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          if (!isWalkable(ex + dx, ey + dy)) continue;
          const distance = dx * dx + dy * dy;
          if (distance < bestDistance) {
            bestDistance = distance;
            best = { x: ex + dx, y: ey + dy };
          }
        }
      }
      if (!best) return [];
      ex = best.x;
      ey = best.y;
    }

    const key = (x, y) => `${x},${y}`;
    const heuristic = (x, y) => Math.abs(x - ex) + Math.abs(y - ey);
    const open = [{ x: sx, y: sy, g: 0, f: heuristic(sx, sy), parent: null }];
    const closed = new Set();
    const bestCost = { [key(sx, sy)]: 0 };
    let iterations = 0;

    while (open.length > 0 && iterations < 3000) {
      iterations++;
      open.sort((a, b) => a.f - b.f);
      const current = open.shift();
      if (current.x === ex && current.y === ey) {
        const path = [];
        for (let node = current; node; node = node.parent) {
          path.unshift({ x: node.x, y: node.y });
        }
        return path;
      }

      closed.add(key(current.x, current.y));
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const x = current.x + dx;
        const y = current.y + dy;
        const tileKey = key(x, y);
        if (closed.has(tileKey) || !isWalkable(x, y)) continue;
        const cost = current.g + 1;
        if (bestCost[tileKey] !== undefined && cost >= bestCost[tileKey]) continue;
        bestCost[tileKey] = cost;
        open.push({ x, y, g: cost, f: cost + heuristic(x, y), parent: current });
      }
    }

    return [];
  }

  function entityOccupiesTile(entity, x, y) {
    if (!entity) return false;
    if (Math.round(entity.tileX) === x && Math.round(entity.tileY) === y) return true;
    const inTransit = entity.moving || entity.state === 'WALKING';
    return Boolean(
      inTransit &&
      Math.round(entity.moveToX) === x &&
      Math.round(entity.moveToY) === y,
    );
  }

  function isTileReserved(entities, x, y, excludedEntity = null) {
    return entities.some(entity => (
      entity !== excludedEntity && entityOccupiesTile(entity, x, y)
    ));
  }

  function tickTimedItems(items, deltaSeconds) {
    for (const item of items) item.timer -= deltaSeconds;
    return items.filter(item => item.timer > 0);
  }

  function isGateOpen(gate, collectedObjectiveIds) {
    return Boolean(gate && Array.isArray(collectedObjectiveIds) && collectedObjectiveIds.includes(gate.after));
  }

  function canCollectObjective(mode, orderedObjectiveIds, collectedObjectiveIds, objectiveId) {
    if (mode !== 'sequence') return true;
    const nextId = orderedObjectiveIds.find(id => !collectedObjectiveIds.includes(id));
    return nextId === objectiveId;
  }

  return Object.freeze({
    DIR,
    oppositeDir,
    mulberry32,
    createWorldMap,
    createFloodedRelayMap,
    createOvergrownArchiveMap,
    createLevelMap,
    findPath,
    entityOccupiesTile,
    isTileReserved,
    tickTimedItems,
    isGateOpen,
    canCollectObjective,
  });
});
