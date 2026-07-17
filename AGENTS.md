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

## Next-step execution priorities

Use the `Next quality milestone` section in the README as the ordered product backlog. Do not mark an item complete based only on implementation; attach the evidence required below.

1. **Visual QA and responsive polish**
   - Verify 1440 by 900, 390 by 844, and 320 by 568 at minimum.
   - Cover first visit, every level, zone select, signal log, objective completion, and campaign completion.
   - Check canvas framing, nonblank rendering, safe areas, text fit, focus visibility, and HUD collisions.
   - Attach screenshots or equivalent browser evidence to the pull request.
2. **Playtesting and tuning**
   - Use at least five first-time players and a consistent observation script.
   - Record time to first input, first discovery, level completion, abandonment, and repeated confusion.
   - Preserve raw notes without personal data and open focused issues for repeated findings.
3. **Accessibility validation**
   - Test keyboard-only operation, screen-reader announcements, 200 percent zoom, reduced motion, and contrast.
   - Run an automated accessibility checker when browser tooling is available.
   - Treat an unreachable objective, trapped focus, missing state announcement, or inaccessible control as release-blocking.
4. **Content depth and continuity**
   - Prefer optional secrets, alternate clue responses, and environmental reactions over longer mandatory collection paths.
   - Give each level at least one optional memorable discovery.
   - Keep transitions concise and make the next objective narratively legible.
   - Preserve existing save compatibility when adding progression state.
5. **Roadmap and community operations**
   - Reconcile issue status after each merged feature; do not leave completed work represented as unchecked future work.
   - Keep one focused deliverable per issue and link its implementation and validation evidence.
   - Validate contributed content as structured data. Never execute contributor-supplied HTML or JavaScript.
6. **Privacy-preserving engagement measurement**
   - Measure only counters needed to evaluate completion, replay, return, and share intent.
   - Keep data local unless a separately reviewed issue defines a transparent collection path.
   - Do not add accounts, fingerprinting, raw interaction histories, or third-party trackers.

For every priority, begin with a reproducible baseline, make the smallest coherent change, run `npm run verify`, and report remaining uncertainty. Preserve static hosting and avoid adding a framework solely to complete roadmap work.

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
