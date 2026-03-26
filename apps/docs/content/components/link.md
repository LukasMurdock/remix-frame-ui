# Link

Maturity: stable

## HTML parity

`Link` renders a native `<a>` with support for `href`, `target`, `rel`, `download`, and `aria-current`.

## Runtime notes

When `onNavigate` is provided, primary-click navigation can be intercepted for client routing. `navigateMode` defaults to internal links only.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | native link role |
| Keyboard Enter | activates navigation |
| Current page state | supports `aria-current` values |
| New tab safety | adds `noopener noreferrer` for `_blank` by default |

## Keymap spec

- `Enter`: activates link navigation
