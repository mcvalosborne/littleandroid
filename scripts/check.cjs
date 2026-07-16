'use strict';

const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];

if (!/<canvas\b[^>]*\bid="game"[^>]*>/i.test(html)) {
  throw new Error('index.html must contain the game canvas');
}
if (!html.includes('src/game-logic.js')) {
  throw new Error('index.html must load the shared game logic');
}
if (inlineScripts.length !== 1) {
  throw new Error(`Expected one inline runtime script, found ${inlineScripts.length}`);
}

new Function(inlineScripts[0][1]);
require('../src/game-logic.js');

console.log('Static checks passed.');
