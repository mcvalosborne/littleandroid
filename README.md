# Little Android

An explorable pixel-art micro-world rendered entirely in the browser. Walk through the river factory zone, scan its residents, and discover the small behaviors that make the settlement feel alive.

**[Play Little Android](https://littleandroid.com)**

## Controls

First-time players receive a short mission briefing for the active zone. Reopen it at any time with the `?` control, or use the `L1`/`L2`/`L3` control to change unlocked zones.

| Action | Input |
| --- | --- |
| Move | `W` `A` `S` `D` or click/tap a destination |
| Scan or interact | `Space` |
| Interact with an adjacent character | Click/tap the character |

The mobile experience supports tap-to-move and a context-sensitive touch action control for scanning, interacting, and linking objectives.

## What is here

- A hand-built 24 by 20 tile world with animated water, vegetation, and factory scenery
- Eight residents with distinct movement and interaction state machines
- Grid-based movement and click-to-move pathfinding
- A radial scan that reveals character identities
- A three-part signal recovery quest with resident hints and daily challenge codes
- A three-level campaign with permanent sequential unlocks:
  - **River Factory:** scan for three hidden signal carriers
  - **Flooded Relay:** activate control banks to open floodgates between platforms
  - **Overgrown Archive:** follow resident clues and restore memories in the daily sequence
- Persistent progress, a discovery journal, replay, and completion sharing
- Optional sound, haptic feedback, touch controls, and reduced-motion support
- No runtime framework, backend, or asset bundle

## Run locally

The production version is a static page. Serve the directory with any static server:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Run the dependency-free verification suite with Node.js 22 or later:

```sh
npm run verify
```

## Project direction

The project is moving from an ambient interactive vignette toward a polished five-minute micro-game. The work is organized in the [master roadmap](https://github.com/mcvalosborne/littleandroid/issues/12):

1. Establish contributor tooling, tests, and review gates.
2. Correct movement and interaction edge cases.
3. Complete mobile, accessibility, and performance work.
4. Add a signal-recovery quest, narrative progression, and sensory polish.
5. Add measured return, sharing, and community contribution loops.

## Next quality milestone

The campaign is functional and tested, but it still needs external validation and greater depth before it should be treated as a finished game. Work through these priorities in order:

1. **Complete visual QA.** Capture and review first-visit, active-play, journal, zone-select, and completion states at 1440 by 900, 390 by 844, and 320 by 568. Resolve HUD overlap, clipped text, unclear controls, and weak visual hierarchy.
2. **Run moderated playtests.** Test with at least five people who have not played before. Record time to first input, first discovery, each level completion, confusion points, abandonment, and qualitative enjoyment. Convert repeated problems into issues.
3. **Audit accessibility.** Complete keyboard-only, reduced-motion, high-zoom, contrast, screen-reader, and automated accessibility checks. Every campaign objective and menu must be operable without a pointer and must announce meaningful state changes.
4. **Deepen each level.** Add optional secrets, stronger puzzle variation, and more environmental reactions without padding the short-session format. Each zone should contain at least one memorable discovery outside its required objective path.
5. **Improve campaign continuity.** Add concise transitions that explain what changed, why the next zone matters, and how resident dialogue reflects earlier restoration work.
6. **Reconcile project tracking.** Update or close completed roadmap issues, split remaining work into focused deliverables, and link implementation pull requests and verification evidence.
7. **Validate engagement responsibly.** Define privacy-preserving completion, replay, return, and share-intent measures; establish a baseline; and avoid accounts, fingerprinting, or raw event histories.
8. **Finish the community pipeline.** Document and test a safe robot, dialogue, or map contribution workflow from proposal through validation and merge.

The milestone is complete when representative desktop and mobile evidence is attached, the five-person test has no repeated critical blocker, no critical accessibility issue remains, roadmap state matches the codebase, and the engagement baseline can be measured without collecting personal data.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Keep changes focused, preserve static hosting, and include verification evidence for interaction or visual changes.

Codex review follows the repository rules in [AGENTS.md](AGENTS.md).

## Privacy

Gameplay progress, preferences, and aggregate engagement counters remain in the visitor's browser. See [PRIVACY.md](PRIVACY.md) for the exact local data and sharing behavior.

## License

Source code and original project assets are available under the [MIT License](LICENSE).
