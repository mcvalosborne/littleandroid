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

  const NPC_DIALOGUE = Object.freeze({
    worker: Object.freeze({ active: 'THE LINE IS QUIET. THREE CARRIERS ARE STILL DARK.', complete: 'CURRENT STABLE. GOOD WORK, UNIT-01.' }),
    scout: Object.freeze({ active: 'I SAW A PULSE NEAR THE BRIDGE. SCAN FROM THE PATH.', complete: 'PERIMETER CLEAR. THE SIGNAL HOLDS.' }),
    elder: Object.freeze({ active: 'OLD NETWORKS WAKE IN PIECES. LISTEN FOR ALL THREE.', complete: 'THE FACTORY REMEMBERS ITS NAME.' }),
    farmer: Object.freeze({ active: 'SOMETHING HUMS WEST OF THE FIELD. NOT A BEE.', complete: 'EVEN THE SEEDLINGS CAN FEEL THAT CURRENT.' }),
    mechanic: Object.freeze({ active: 'BRING ME THE RELAYS AND I CAN CLOSE THE CIRCUIT.', complete: 'ONLINE AND CLEAN. THAT WILL DO.' }),
    child: Object.freeze({ active: 'I FOUND A SHINY NOISE! THEN IT RAN SOUTH.', complete: 'YOU MADE THE BIG SIGN CHANGE!' }),
    dog: Object.freeze({ active: 'HAPPY STATIC. WARM TRAIL. GOOD TRAIL.', complete: 'FACTORY GOOD. YOU GOOD.' }),
  });

  return Object.freeze({ SIGNAL_FRAGMENTS, NPC_DIALOGUE });
});
