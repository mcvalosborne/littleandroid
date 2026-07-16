# Privacy

Little Android does not send gameplay analytics to a server.

The game stores the following data locally in the visitor's browser:

- discovered and collected signal IDs;
- scanned resident names;
- quest completion state;
- sound preference;
- aggregate counters such as sessions, first scan, completions, replays, and share intent.

These values contain no account identifier, free-form input, location, or device fingerprint. They are used only by the local experience and can be removed by clearing site data or resetting the journey where applicable. The game continues to work when browser storage is unavailable.

The share action uses the browser's native share sheet or clipboard only after the visitor activates it. Shared text contains the daily challenge code and the public project URL.

The page currently requests display fonts from Google Fonts. That external request is separate from gameplay measurement and is tracked for reliability/privacy review in issue #17.
