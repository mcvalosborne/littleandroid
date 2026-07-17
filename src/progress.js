(function exposeProgress(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LittleAndroidProgress = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createProgressApi() {
  'use strict';

  const SAVE_KEY = 'littleandroid.progress';
  const CAMPAIGN_KEY = 'littleandroid.campaign';
  const SAVE_VERSION = 2;

  function defaultProgress() {
    return {
      version: SAVE_VERSION,
      challengeDate: '',
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
      if (!parsed || (parsed.version !== SAVE_VERSION && parsed.version !== 1)) return defaultProgress();
      return {
        version: SAVE_VERSION,
        challengeDate: typeof parsed.challengeDate === 'string' ? parsed.challengeDate : '',
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

  function scopeProgressToChallenge(progress, challengeDate) {
    const normalized = parseProgress(progress);
    if (!normalized.challengeDate) return { ...normalized, challengeDate };
    if (normalized.challengeDate === challengeDate) return normalized;
    return {
      ...defaultProgress(),
      challengeDate,
      generation: normalized.generation + 1,
      discoveredNPCs: normalized.discoveredNPCs,
    };
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
      challengeDate: next.challengeDate || current.challengeDate,
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

  function createLevelStorage(storage, levelId) {
    const levelKey = levelId === 'river-factory' ? SAVE_KEY : `${SAVE_KEY}.${levelId}`;
    return Object.freeze({
      getItem(key) {
        return storage && storage.getItem(key === SAVE_KEY ? levelKey : key);
      },
      setItem(key, value) {
        if (storage) storage.setItem(key === SAVE_KEY ? levelKey : key, value);
      },
      removeItem(key) {
        if (storage) storage.removeItem(key === SAVE_KEY ? levelKey : key);
      },
    });
  }

  function defaultCampaign(levelIds = []) {
    return {
      activeLevelId: levelIds[0] || 'river-factory',
      completedLevelIds: [],
    };
  }

  function parseCampaign(raw, levelIds = []) {
    const fallback = defaultCampaign(levelIds);
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!parsed || typeof parsed !== 'object') return fallback;
      const completedLevelIds = normalizeStringList(parsed.completedLevelIds)
        .filter(levelId => levelIds.includes(levelId));
      return {
        activeLevelId: levelIds.includes(parsed.activeLevelId) ? parsed.activeLevelId : fallback.activeLevelId,
        completedLevelIds,
      };
    } catch {
      return fallback;
    }
  }

  function loadCampaign(storage, levelIds = []) {
    try { return parseCampaign(storage && storage.getItem(CAMPAIGN_KEY), levelIds); }
    catch { return defaultCampaign(levelIds); }
  }

  function saveCampaign(storage, campaign, levelIds = []) {
    try {
      if (!storage) return false;
      storage.setItem(CAMPAIGN_KEY, JSON.stringify(parseCampaign(campaign, levelIds)));
      return true;
    } catch {
      return false;
    }
  }

  function isLevelUnlocked(campaign, levelId, levelIds = []) {
    const index = levelIds.indexOf(levelId);
    if (index <= 0) return index === 0;
    const normalized = parseCampaign(campaign, levelIds);
    return normalized.completedLevelIds.includes(levelIds[index - 1]);
  }

  function completeCampaignLevel(campaign, levelId, levelIds = []) {
    const normalized = parseCampaign(campaign, levelIds);
    if (!levelIds.includes(levelId)) return normalized;
    return {
      ...normalized,
      completedLevelIds: normalizeStringList([...normalized.completedLevelIds, levelId]),
    };
  }

  return Object.freeze({
    SAVE_KEY,
    CAMPAIGN_KEY,
    SAVE_VERSION,
    defaultProgress,
    parseProgress,
    loadProgress,
    scopeProgressToChallenge,
    mergeProgress,
    saveProgress,
    clearProgress,
    createLevelStorage,
    defaultCampaign,
    parseCampaign,
    loadCampaign,
    saveCampaign,
    isLevelUnlocked,
    completeCampaignLevel,
  });
});
