'use strict';

const fs = require('node:fs');
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const LittleAndroidLogic = require('../src/game-logic.js');

test('runtime initializes and renders a frame', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const listeners = {};
  let nextFrame;
  const context2d = new Proxy(
    { measureText: text => ({ width: String(text).length * 9 }) },
    { get: (target, key) => key in target ? target[key] : () => {} },
  );
  const element = () => ({
    style: {},
    classList: { add() {}, remove() {} },
    textContent: '',
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    addEventListener: (name, handler) => { listeners[name] = handler; },
    getContext: () => context2d,
  });
  const elements = {
    game: element(),
    coords: element(),
    hint: element(),
    emote: element(),
  };
  const sandbox = {
    LittleAndroidLogic,
    console,
    Date,
    Math,
    setTimeout,
    clearTimeout,
    innerWidth: 800,
    innerHeight: 600,
    document: { getElementById: id => elements[id] },
    window: {
      innerWidth: 800,
      innerHeight: 600,
      addEventListener: (name, handler) => { listeners[`window:${name}`] = handler; },
    },
    requestAnimationFrame: handler => { nextFrame = handler; },
  };

  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  nextFrame(16);

  const snapshot = vm.runInContext(
    '({ playerX: player.tileX, playerY: player.tileY, state: player.state, npcCount: npcs.length })',
    sandbox,
  );
  assert.deepEqual({ ...snapshot }, { playerX: 4, playerY: 6, state: 'IDLE', npcCount: 8 });
});
