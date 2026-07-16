(function exposeGameContent(root, factory) {
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  if (root) root.LittleAndroidContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createGameContent() {
  'use strict';

  const SIGNAL_FRAGMENTS = Object.freeze([
    Object.freeze({ id: 'field-coil', name: 'FIELD COIL', x: 2, y: 12 }),
    Object.freeze({ id: 'bridge-relay', name: 'BRIDGE RELAY', x: 14, y: 11 }),
    Object.freeze({ id: 'garden-cell', name: 'GARDEN CELL', x: 10, y: 16 }),
  ]);

  return Object.freeze({ SIGNAL_FRAGMENTS });
});
