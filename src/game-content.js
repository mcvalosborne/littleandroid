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

  const LEVELS = Object.freeze([
    Object.freeze({
      id: 'river-factory',
      number: 1,
      name: 'RIVER FACTORY',
      mode: 'scan',
      seed: 77,
      spawn: Object.freeze({ x: 4, y: 6, facing: 'south' }),
      objectiveLabel: 'SIGNALS',
      completeLabel: 'FACTORY ONLINE',
      briefing: 'Three signal carriers are dark. Explore the river factory, scan for their locations, and recover all three.',
      objectives: SIGNAL_FRAGMENTS,
      gates: Object.freeze([]),
      sign: Object.freeze({ x: 2, y: 3, width: 6, active: 'ROBOTS', complete: 'ONLINE' }),
      npcs: Object.freeze([
        Object.freeze({ type: 'worker', x: 3, y: 4, facing: 'south', label: 'UNIT-47' }),
        Object.freeze({ type: 'worker', x: 6, y: 4, facing: 'east', label: 'UNIT-12' }),
        Object.freeze({ type: 'scout', x: 8, y: 8, facing: 'south', label: 'RECON-3', patrol: Object.freeze([{x:8,y:8,f:'south'},{x:12,y:8,f:'east'},{x:12,y:6,f:'north'},{x:8,y:6,f:'west'}]) }),
        Object.freeze({ type: 'elder', x: 5, y: 3, facing: 'south', label: 'OVERSEER' }),
        Object.freeze({ type: 'farmer', x: 3, y: 14, facing: 'south', label: 'OLD DALE' }),
        Object.freeze({ type: 'mechanic', x: 9, y: 5, facing: 'north', label: 'SPARKS' }),
        Object.freeze({ type: 'child', x: 6, y: 12, facing: 'south', label: 'LIL BIT' }),
        Object.freeze({ type: 'dog', x: 7, y: 11, facing: 'east', label: 'GOOD BOY' }),
      ]),
    }),
    Object.freeze({
      id: 'flooded-relay',
      number: 2,
      name: 'FLOODED RELAY',
      mode: 'gates',
      spawn: Object.freeze({ x: 3, y: 10, facing: 'east' }),
      objectiveLabel: 'RELAYS',
      completeLabel: 'CURRENT ROUTED',
      briefing: 'The relay platforms are isolated. Activate each control bank to open the next floodgate and route current across the water.',
      objectives: Object.freeze([
        Object.freeze({ id: 'intake-relay', name: 'INTAKE RELAY', x: 5, y: 6, visible: true }),
        Object.freeze({ id: 'spillway-relay', name: 'SPILLWAY RELAY', x: 12, y: 14, visible: true }),
        Object.freeze({ id: 'tower-relay', name: 'TOWER RELAY', x: 20, y: 6, visible: true }),
      ]),
      gates: Object.freeze([
        Object.freeze({ x: 8, y: 10, after: 'intake-relay' }),
        Object.freeze({ x: 16, y: 10, after: 'spillway-relay' }),
      ]),
      sign: Object.freeze({ x: 9, y: 7, width: 7, active: 'RELAY', complete: 'ROUTED' }),
      npcs: Object.freeze([
        Object.freeze({ type: 'mechanic', x: 3, y: 6, facing: 'east', label: 'VALVE' }),
        Object.freeze({ type: 'worker', x: 11, y: 5, facing: 'south', label: 'PUMP-8' }),
        Object.freeze({ type: 'scout', x: 18, y: 13, facing: 'north', label: 'WADER', patrol: Object.freeze([{x:18,y:13,f:'north'},{x:21,y:13,f:'east'},{x:21,y:9,f:'north'},{x:18,y:9,f:'west'}]) }),
      ]),
    }),
    Object.freeze({
      id: 'overgrown-archive',
      number: 3,
      name: 'OVERGROWN ARCHIVE',
      mode: 'sequence',
      seed: 191,
      spawn: Object.freeze({ x: 3, y: 10, facing: 'north' }),
      objectiveLabel: 'MEMORY',
      completeLabel: 'ARCHIVE AWAKE',
      briefing: 'The archive terminals answer only in sequence. Speak with its residents, follow the current clue, and wake all three memories.',
      objectives: Object.freeze([
        Object.freeze({ id: 'root-index', name: 'ROOT INDEX', x: 4, y: 5, visible: true, clue: 'WEST WING · ABOVE THE OLD STONE' }),
        Object.freeze({ id: 'moss-ledger', name: 'MOSS LEDGER', x: 12, y: 6, visible: true, clue: 'CENTRAL COURT · NORTH OF THE BROKEN WALL' }),
        Object.freeze({ id: 'canopy-memory', name: 'CANOPY MEMORY', x: 20, y: 15, visible: true, clue: 'EAST GROVE · BELOW THE LAST ARCH' }),
      ]),
      gates: Object.freeze([]),
      sign: Object.freeze({ x: 9, y: 9, width: 7, active: 'ARCHIVE', complete: 'AWAKE' }),
      npcs: Object.freeze([
        Object.freeze({ type: 'elder', x: 5, y: 10, facing: 'west', label: 'CURATOR', clue: true }),
        Object.freeze({ type: 'farmer', x: 11, y: 12, facing: 'north', label: 'GROUNDSKEEP', clue: true }),
        Object.freeze({ type: 'scout', x: 19, y: 8, facing: 'south', label: 'INDEXER', clue: true, patrol: Object.freeze([{x:19,y:8,f:'south'},{x:21,y:8,f:'east'},{x:21,y:12,f:'south'},{x:19,y:12,f:'west'}]) }),
      ]),
    }),
  ]);

  const LEVEL_IDS = Object.freeze(LEVELS.map(level => level.id));

  function getLevel(levelId) {
    return LEVELS.find(level => level.id === levelId) || LEVELS[0];
  }

  return Object.freeze({ SIGNAL_FRAGMENTS, NPC_DIALOGUE, LEVELS, LEVEL_IDS, getLevel });
});
