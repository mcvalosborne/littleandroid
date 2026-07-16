(function exposeProgress(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LittleAndroidProgress = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createProgressApi() {
  'use strict';

  const SAVE_KEY = 'littleandroid.progress';
  const SAVE_VERSION = 1;

  function defaultProgress() {
    return {
      version: SAVE_VERSION,
      generation: 0,
      discoveredFragments: [],
      collectedFragments: [],
      discoveredNPCs: [],
      complete: false,
    };
  }

  function normalizeStringList(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter(item => typeof item === 'string'))];
  }

  function parseProgress(raw) {
    if (!raw) return defaultProgress();
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!parsed || parsed.version !== SAVE_VERSION) return defaultProgress();
      return {
        version: SAVE_VERSION,
        generation: Number.isSafeInteger(parsed.generation) && parsed.generation >= 0 ? parsed.generation : 0,
        discoveredFragments: normalizeStringList(parsed.discoveredFragments),
        collectedFragments: normalizeStringList(parsed.collectedFragments),
        discoveredNPCs: normalizeStringList(parsed.discoveredNPCs),
        complete: parsed.complete === true,
      };
    } catch {
      return defaultProgress();
    }
  }

  function loadProgress(storage) {
    try {
      return parseProgress(storage && storage.getItem(SAVE_KEY));
    } catch {
      return defaultProgress();
    }
  }

  function mergeProgress(base, incoming, requiredFragmentIds = []) {
    const current = parseProgress(base);
    const next = parseProgress(incoming);
    if (current.generation !== next.generation) {
      return current.generation > next.generation ? current : next;
    }
    const collectedFragments = normalizeStringList([
      ...current.collectedFragments,
      ...next.collectedFragments,
    ]);
    return {
      version: SAVE_VERSION,
      generation: current.generation,
      discoveredFragments: normalizeStringList([
        ...current.discoveredFragments,
        ...next.discoveredFragments,
      ]),
      collectedFragments,
      discoveredNPCs: normalizeStringList([
        ...current.discoveredNPCs,
        ...next.discoveredNPCs,
      ]),
      complete: current.complete || next.complete || (
        requiredFragmentIds.length > 0 &&
        requiredFragmentIds.every(id => collectedFragments.includes(id))
      ),
    };
  }

  function saveProgress(storage, progress) {
    try {
      if (!storage) return false;
      storage.setItem(SAVE_KEY, JSON.stringify(parseProgress(progress)));
      return true;
    } catch {
      return false;
    }
  }

  function clearProgress(storage) {
    try {
      if (!storage) return false;
      storage.removeItem(SAVE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  return Object.freeze({
    SAVE_KEY,
    SAVE_VERSION,
    defaultProgress,
    parseProgress,
    loadProgress,
    mergeProgress,
    saveProgress,
    clearProgress,
  });
});
