(function exposeFeedback(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LittleAndroidFeedback = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createFeedbackApi() {
  'use strict';

  const SETTINGS_KEY = 'littleandroid.feedback';
  const CUES = Object.freeze({
    scan: [[440, 0], [660, 0.08]],
    discover: [[620, 0], [880, 0.1]],
    collect: [[520, 0], [780, 0.08], [1040, 0.16]],
    complete: [[392, 0], [523, 0.12], [659, 0.24], [784, 0.36]],
    blocked: [[150, 0]],
    interact: [[330, 0], [440, 0.08]],
  });

  function readMuted(storage) {
    try {
      const parsed = JSON.parse(storage && storage.getItem(SETTINGS_KEY));
      return Boolean(parsed && parsed.muted === true);
    } catch {
      return false;
    }
  }

  function writeMuted(storage, muted) {
    try {
      if (!storage) return false;
      storage.setItem(SETTINGS_KEY, JSON.stringify({ muted: Boolean(muted) }));
      return true;
    } catch {
      return false;
    }
  }

  function createFeedbackController(environment, storage) {
    const AudioContextClass = environment.AudioContext || environment.webkitAudioContext;
    const reduceMotion = Boolean(environment.matchMedia && environment.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let context = null;
    let muted = readMuted(storage);

    function unlock() {
      if (muted || !AudioContextClass) return false;
      try {
        context ||= new AudioContextClass();
        if (context.state === 'suspended') {
          const resume = context.resume();
          if (resume && typeof resume.catch === 'function') resume.catch(() => {});
        }
        return true;
      } catch {
        return false;
      }
    }

    function play(name) {
      const cue = CUES[name];
      if (!cue || !unlock()) return false;
      try {
        const start = context.currentTime;
        for (const [frequency, offset] of cue) {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(frequency, start + offset);
          gain.gain.setValueAtTime(0.035, start + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, start + offset + 0.12);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(start + offset);
          oscillator.stop(start + offset + 0.13);
        }
        return true;
      } catch {
        return false;
      }
    }

    function haptic(pattern = 20) {
      if (muted || reduceMotion || !environment.navigator || typeof environment.navigator.vibrate !== 'function') return false;
      return environment.navigator.vibrate(pattern);
    }

    function setMuted(nextMuted) {
      muted = Boolean(nextMuted);
      writeMuted(storage, muted);
      return muted;
    }

    return Object.freeze({
      unlock,
      play,
      haptic,
      isMuted: () => muted,
      setMuted,
      toggleMuted: () => setMuted(!muted),
    });
  }

  return Object.freeze({ SETTINGS_KEY, CUES, readMuted, writeMuted, createFeedbackController });
});
