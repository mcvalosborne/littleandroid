'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createDailyChallenge,
  parseMetrics,
  createLocalMetrics,
  completionText,
} = require('../src/engagement.js');

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('daily challenges are deterministic and retain every fragment', () => {
  const ids = ['a', 'b', 'c'];
  const first = createDailyChallenge('2026-07-16', ids);
  const second = createDailyChallenge('2026-07-16', ids);
  assert.deepEqual(first, second);
  assert.deepEqual([...first.order].sort(), ids);
  assert.match(first.code, /^D20260716-\d{4}$/);
  assert.notEqual(
    createDailyChallenge('2026-06-05', ids).code,
    createDailyChallenge('2027-01-01', ids).code,
  );
});

test('local metrics count without storing event payloads', () => {
  const metrics = createLocalMetrics(memoryStorage());
  assert.equal(metrics.increment('sessions'), 1);
  assert.equal(metrics.increment('sessions'), 2);
  assert.equal(metrics.markOnce('first_scan'), true);
  assert.equal(metrics.markOnce('first_scan'), false);
  assert.deepEqual(metrics.snapshot(), { counters: { sessions: 2, first_scan: 1 } });
  assert.deepEqual(parseMetrics('{bad'), { counters: {} });
});

test('completion copy contains only challenge and public URL', () => {
  assert.equal(
    completionText('D20260716-0042'),
    'I restored the Little Android factory (D20260716-0042). Explore it at https://littleandroid.com',
  );
});
