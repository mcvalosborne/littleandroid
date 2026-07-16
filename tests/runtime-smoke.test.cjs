'use strict';

const fs = require('node:fs');
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const LittleAndroidLogic = require('../src/game-logic.js');
const LittleAndroidContent = require('../src/game-content.js');
const LittleAndroidProgress = require('../src/progress.js');

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
}

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
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {},
    textContent: '',
    focus() {},
    showModal() {},
    close() {},
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    addEventListener: (name, handler) => { listeners[name] = handler; },
    getContext: () => context2d,
  });
  const elements = {
    game: element(),
    coords: element(),
    hint: element(),
    emote: element(),
    status: element(),
    'action-button': element(),
    quest: element(),
    'quest-reset': element(),
    'journal-button': element(),
    'journal-dialog': element(),
    'journal-list': element(),
    'journal-close': element(),
  };
  const sandbox = {
    LittleAndroidLogic,
    LittleAndroidContent,
    LittleAndroidProgress,
    console,
    Date,
    Math,
    setTimeout,
    clearTimeout,
    innerWidth: 800,
    innerHeight: 600,
    document: { hidden: false, body: element(), getElementById: id => elements[id] },
    window: {
      innerWidth: 800,
      innerHeight: 600,
      devicePixelRatio: 2,
      localStorage: memoryStorage(),
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

  const keyboardTargets = vm.runInContext(`({
    game: shouldHandleGameKey(null),
    canvas: shouldHandleGameKey({ closest: () => null }),
    control: shouldHandleGameKey({ closest: () => ({}) }),
  })`, sandbox);
  assert.deepEqual(
    { ...keyboardTargets },
    { game: true, canvas: true, control: false },
  );

  const retrieval = vm.runInContext(`
    const fragment = signalFragments[0];
    player.tileX = fragment.x;
    player.tileY = fragment.y - 1;
    player.renderX = player.tileX;
    player.renderY = player.tileY;
    playerStartMove('south');
    const hiddenBlocked = player.state;
    player.state = 'IDLE';
    triggerScanPulse();
    updateScanPulse(1);
    playerStartMove('south');
    const blocked = player.state;
    player.state = 'IDLE';
    performAction();
    ({ discovered: fragment.discovered, hiddenBlocked, blocked, collected: fragment.collected });
  `, sandbox);
  assert.deepEqual(
    { ...retrieval },
    { discovered: true, hiddenBlocked: 'BLOCKED', blocked: 'BLOCKED', collected: true },
  );

  const resetBehavior = vm.runInContext(`
    discoveredNPCs.add('OVERSEER');
    const cancelled = requestQuestReset(() => false);
    const retained = fragment.collected && discoveredNPCs.has('OVERSEER');
    const accepted = requestQuestReset(() => true);
    ({ cancelled, retained, accepted, cleared: !fragment.collected && discoveredNPCs.size === 0 });
  `, sandbox);
  assert.deepEqual(
    { ...resetBehavior },
    { cancelled: false, retained: true, accepted: true, cleared: true },
  );

  const completion = vm.runInContext(`
    for (const fragment of signalFragments) {
      fragment.discovered = true;
      collectFragment(fragment);
    }
    ({ complete: quest.complete, collected: signalFragments.filter(fragment => fragment.collected).length });
  `, sandbox);
  assert.deepEqual({ ...completion }, { complete: true, collected: 3 });
  assert.equal(elements.quest.textContent, 'FACTORY ONLINE');

  const replay = vm.runInContext(`
    player.tileX = signalFragments[0].x;
    player.tileY = signalFragments[0].y;
    const refused = resetQuest();
    player.tileX = 4;
    player.tileY = 6;
    const accepted = resetQuest();
    ({ refused, accepted, collected: signalFragments.filter(fragment => fragment.collected).length });
  `, sandbox);
  assert.deepEqual({ ...replay }, { refused: false, accepted: true, collected: 0 });
});

test('NPC movement rejects a destination reserved earlier in the frame', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const context2d = new Proxy(
    { measureText: text => ({ width: String(text).length * 9 }) },
    { get: (target, key) => key in target ? target[key] : () => {} },
  );
  const element = () => ({
    style: {}, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, textContent: '', focus() {}, showModal() {}, close() {},
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    addEventListener() {}, getContext: () => context2d,
  });
  const elements = { game: element(), coords: element(), hint: element(), emote: element(), status: element(), 'action-button': element(), quest: element(), 'quest-reset': element(), 'journal-button': element(), 'journal-dialog': element(), 'journal-list': element(), 'journal-close': element() };
  const sandbox = {
    LittleAndroidLogic, LittleAndroidContent, LittleAndroidProgress, console, Date, Math, setTimeout, clearTimeout,
    document: { hidden: false, body: element(), getElementById: id => elements[id] },
    window: { innerWidth: 800, innerHeight: 600, devicePixelRatio: 1, localStorage: memoryStorage(), addEventListener() {} },
    requestAnimationFrame() {},
  };
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  const result = vm.runInContext(`
    npcs.length = 0;
    const first = makeNPC('worker', 9, 11, 'east');
    const second = makeNPC('worker', 11, 11, 'west');
    const fragment = signalFragments[0];
    const fragmentSeeker = makeNPC('worker', fragment.x - 1, fragment.y, 'east');
    npcs.push(first, second, fragmentSeeker);
    ({
      first: npcStartMove(first, 'east', 200),
      second: npcStartMove(second, 'west', 200),
      fragment: npcStartMove(fragmentSeeker, 'east', 200),
    });
  `, sandbox);
  assert.deepEqual({ ...result }, { first: true, second: false, fragment: false });
});

test('interaction waits for a moving NPC to finish its tile step', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const context2d = new Proxy(
    { measureText: text => ({ width: String(text).length * 9 }) },
    { get: (target, key) => key in target ? target[key] : () => {} },
  );
  const element = () => ({
    style: {}, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, textContent: '', focus() {}, showModal() {}, close() {},
    getBoundingClientRect: () => ({ left: 0, top: 0 }), addEventListener() {},
    getContext: () => context2d,
  });
  const elements = { game: element(), coords: element(), hint: element(), emote: element(), status: element(), 'action-button': element(), quest: element(), 'quest-reset': element(), 'journal-button': element(), 'journal-dialog': element(), 'journal-list': element(), 'journal-close': element() };
  const sandbox = {
    LittleAndroidLogic, LittleAndroidContent, LittleAndroidProgress, console, Date, Math, setTimeout, clearTimeout,
    document: { hidden: false, body: element(), getElementById: id => elements[id] },
    window: { innerWidth: 800, innerHeight: 600, devicePixelRatio: 1, localStorage: memoryStorage(), addEventListener() {} },
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
