# Contributing

## Before starting

1. Check the [roadmap](https://github.com/mcvalosborne/littleandroid/issues/12) and existing issues.
2. Comment on an issue before taking broad or overlapping work.
3. Keep one behavioral objective per pull request.

## Local workflow

The current production page has no build step. Serve the repository and open it in a browser:

```sh
python3 -m http.server 8000
```

Before submitting, exercise movement, click-to-move, scanning, and at least one NPC interaction. Use the repository's automated checks as they are introduced under issue #4.

## Pull requests

- Link the issue with `Closes #<number>` when the work fully satisfies it.
- Explain the behavioral change and important implementation decisions.
- List automated and manual verification.
- Include desktop and phone evidence for visual changes.
- Keep unrelated formatting and refactors out of the patch.
- Resolve or explicitly discuss P0/P1 review findings before merge.

## Design principles

- Preserve the restrained pixel-art palette and compact HUD.
- Keep controls discoverable without tutorial modals.
- Do not require audio, fine motor precision, or color perception to progress.
- Prefer data-driven additions for characters, dialogue, and discoveries.

## Community content

Only submit work you have the right to license under the project's MIT License. Credit collaborators and sources in the pull request. Do not include personal data, tracking identifiers, or unreviewed executable content.
