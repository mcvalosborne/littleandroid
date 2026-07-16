# Little Android

An explorable pixel-art micro-world rendered entirely in the browser. Walk through the river factory zone, scan its residents, and discover the small behaviors that make the settlement feel alive.

**[Play Little Android](https://littleandroid.com)**

## Controls

First-time players receive a short mission briefing. Reopen it at any time with the `?` control.

| Action | Input |
| --- | --- |
| Move | `W` `A` `S` `D` or click/tap a destination |
| Scan or interact | `Space` |
| Interact with an adjacent character | Click/tap the character |

The current mobile experience supports tap-to-move. A dedicated touch action control is tracked in [issue #2](https://github.com/mcvalosborne/littleandroid/issues/2).

## What is here

- A hand-built 24 by 20 tile world with animated water, vegetation, and factory scenery
- Eight residents with distinct movement and interaction state machines
- Grid-based movement and click-to-move pathfinding
- A radial scan that reveals character identities
- A three-part signal recovery quest with resident hints and daily challenge codes
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

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Keep changes focused, preserve static hosting, and include verification evidence for interaction or visual changes.

Codex review follows the repository rules in [AGENTS.md](AGENTS.md).

## Privacy

Gameplay progress, preferences, and aggregate engagement counters remain in the visitor's browser. See [PRIVACY.md](PRIVACY.md) for the exact local data and sharing behavior.

## License

Source code and original project assets are available under the [MIT License](LICENSE).
