# Switch

Maturity: experimental

## HTML parity

`Switch` renders native `<input type="checkbox">` with `role="switch"` for a toggle UI.

## Runtime notes

Hydration optional. Static checked state works server-only.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | native checkbox with `role="switch"` |
| Checked state | native `checked` / `defaultChecked` |
| Submission | native name/value semantics (`on` default) |

## Keymap spec

- `Space`: toggles checked state
