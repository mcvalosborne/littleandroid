# Little Android Repository Guidance

## Product intent

Little Android is a small, handcrafted browser world. Preserve its quiet pixel-art identity, immediate interaction, and static hosting model. Prefer focused improvements over framework or dependency growth.

## Engineering conventions

- Keep runtime code understandable without a large toolchain.
- Separate world data, state transitions, input, and rendering when adding modules.
- Keep game-state updates deterministic where practical; inject time and randomness into testable logic.
- Use elapsed time for behavior and animation durations. Do not assume 60 Hz.
- Treat touch, keyboard, and pointer input as equal product surfaces.
- Preserve current behavior unless the linked issue explicitly changes it.
- Add tests for movement, pathfinding, collisions, persistence, and progression when those areas change.
- For visual work, verify at desktop and phone viewports and include screenshots or equivalent evidence.

## Verification

Run every command documented in the README and package scripts that applies to the change. A pull request must state what was run and what could not be run.

## Review guidelines

Prioritize correctness, accessibility, regressions, and missing tests. Treat the following as P1 findings:

- Two entities can occupy or reserve the same tile.
- A change can lose, corrupt, or unintentionally reset player progress.
- Core movement, scan, or interaction is unavailable to keyboard or touch users.
- HUD content overlaps or becomes unusable at supported phone sizes.
- Timed behavior changes with display refresh rate.
- The game loop continues expensive work while the page is hidden.
- Untrusted contributed data can inject HTML or JavaScript.

Also verify that new dependencies are justified, static deployment remains functional, and user-facing changes include appropriate feedback rather than silent state changes.
