(function exposeEngagement(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LittleAndroidEngagement = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createEngagementApi() {
  'use strict';

  const METRICS_KEY = 'littleandroid.metrics';

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    return function random() {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function createDailyChallenge(date, fragmentIds) {
    const dateKey = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
    const seed = hashString(dateKey);
    const random = seededRandom(seed);
    const order = [...fragmentIds];
    for (let index = order.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(random() * (index + 1));
      [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    }
    return {
      dateKey,
      code: `D${dateKey.replace(/-/g, '')}-${String(seed % 10000).padStart(4, '0')}`,
      order,
    };
  }

  function parseMetrics(raw) {
    try {
      const parsed = JSON.parse(raw || '{}');
      const counters = {};
      for (const [name, value] of Object.entries(parsed.counters || {})) {
        if (Number.isFinite(value) && value >= 0) counters[name] = value;
      }
      return { counters };
    } catch {
      return { counters: {} };
    }
  }

  function createLocalMetrics(storage) {
    let state;
    try { state = parseMetrics(storage && storage.getItem(METRICS_KEY)); }
    catch { state = { counters: {} }; }

    function persist() {
      try {
        if (storage) storage.setItem(METRICS_KEY, JSON.stringify(state));
      } catch {}
    }

    function increment(name) {
      state.counters[name] = (state.counters[name] || 0) + 1;
      persist();
      return state.counters[name];
    }

    function markOnce(name) {
      if (state.counters[name]) return false;
      state.counters[name] = 1;
      persist();
      return true;
    }

    return Object.freeze({
      increment,
      markOnce,
      snapshot: () => JSON.parse(JSON.stringify(state)),
    });
  }

  function completionText(challengeCode) {
    return `I restored the Little Android factory (${challengeCode}). Explore it at https://littleandroid.com`;
  }

  return Object.freeze({
    METRICS_KEY,
    hashString,
    createDailyChallenge,
    parseMetrics,
    createLocalMetrics,
    completionText,
  });
});
