# DataList

Maturity: experimental

## HTML parity

`DataList` renders a semantic list with title, description, metadata, and actions.

## Runtime notes

`DataList` is presentational and does not require hydration unless child actions are interactive.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| List semantics | native `ul`/`li` structure |
| Empty handling | dedicated empty-state fallback |
| Action support | optional per-row action region |

## Keymap spec

- Keyboard behavior is inherited from focusable child controls.
