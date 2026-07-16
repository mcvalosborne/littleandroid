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
      devicePixelRatio: 2,
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
  assert.equal(elements.game.width, 1600);
  assert.equal(elements.game.height, 1200);
});

test('NPC movement rejects a destination reserved earlier in the frame', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const context2d = new Proxy(
    { measureText: text => ({ width: String(text).length * 9 }) },
    { get: (target, key) => key in target ? target[key] : () => {} },
  );
  const element = () => ({
    style: {}, classList: { add() {}, remove() {} }, textContent: '',
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    addEventListener() {}, getContext: () => context2d,
  });
  const elements = { game: element(), coords: element(), hint: element(), emote: element() };
  const sandbox = {
    LittleAndroidLogic, console, Date, Math, setTimeout, clearTimeout,
    document: { hidden: false, getElementById: id => elements[id] },
    window: { innerWidth: 800, innerHeight: 600, devicePixelRatio: 1, addEventListener() {} },
    requestAnimationFrame() {},
  };
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  const result = vm.runInContext(`
    npcs.length = 0;
    const first = makeNPC('worker', 9, 11, 'east');
    const second = makeNPC('worker', 11, 11, 'west');
    npcs.push(first, second);
    ({ first: npcStartMove(first, 'east', 200), second: npcStartMove(second, 'west', 200) });
  `, sandbox);
  assert.deepEqual({ ...result }, { first: true, second: false });
});

test('interaction waits for a moving NPC to finish its tile step', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const context2d = new Proxy(
    { measureText: text => ({ width: String(text).length * 9 }) },
    { get: (target, key) => key in target ? target[key] : () => {} },
  );
  const element = () => ({
    style: {}, classList: { add() {}, remove() {} }, textContent: '',
    getBoundingClientRect: () => ({ left: 0, top: 0 }), addEventListener() {},
    getContext: () => context2d,
  });
  const elements = { game: element(), coords: element(), hint: element(), emote: element() };
  const sandbox = {
    LittleAndroidLogic, console, Date, Math, setTimeout, clearTimeout,
    document: { hidden: false, getElementById: id => elements[id] },
    window: { innerWidth: 800, innerHeight: 600, devicePixelRatio: 1, addEventListener() {} },
    requestAnimationFrame() {},
  };
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  const state = vm.runInContext(`
    const target = makeNPC('worker', 4, 7, 'south');
    target.moving = true;
    target.moveToX = 5;
    target.moveToY = 7;
    npcs.length = 0;
    npcs.push(target);
    requestPlayerInteraction(target);
    const waiting = player.state;
    target.moving = false;
    target.tileX = 4;
    target.tileY = 7;
    update(0.016);
    ({ waiting, afterStep: player.state });
  `, sandbox);
  assert.deepEqual({ ...state }, { waiting: 'WAITING_INTERACTION', afterStep: 'INTERACTING' });
});
