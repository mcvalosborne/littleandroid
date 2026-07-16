'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { readMuted, writeMuted, createFeedbackController } = require('../src/feedback.js');

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('mute preference persists and tolerates invalid data', () => {
  const storage = memoryStorage();
  assert.equal(readMuted(storage), false);
  assert.equal(writeMuted(storage, true), true);
  assert.equal(readMuted(storage), true);
  storage.setItem('littleandroid.feedback', '{bad');
  assert.equal(readMuted(storage), false);
});

test('feedback is a safe no-op when browser APIs are unavailable', () => {
  const storage = memoryStorage();
  const controller = createFeedbackController({}, storage);
  assert.equal(controller.play('scan'), false);
  assert.equal(controller.haptic(), false);
  assert.equal(controller.toggleMuted(), true);
  assert.equal(readMuted(storage), true);
});
