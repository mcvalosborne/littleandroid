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
if (!html.includes('src/game-content.js')) {
  throw new Error('index.html must load the shared game content');
}
if (!html.includes('src/progress.js')) {
  throw new Error('index.html must load the progress module');
}
if (!html.includes('src/feedback.js')) {
  throw new Error('index.html must load the feedback module');
}
if (!html.includes('src/engagement.js')) {
  throw new Error('index.html must load the engagement module');
}
if (!html.includes('#ui-overlay button{pointer-events:auto}')) {
  throw new Error('Overlay controls must accept pointer input');
}
if (inlineScripts.length !== 1) {
  throw new Error(`Expected one inline runtime script, found ${inlineScripts.length}`);
}

new Function(inlineScripts[0][1]);
require('../src/game-logic.js');
require('../src/game-content.js');
require('../src/progress.js');
require('../src/feedback.js');
require('../src/engagement.js');

console.log('Static checks passed.');
