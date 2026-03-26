# Checkbox

Maturity: experimental

## HTML parity

`Checkbox` renders native `<input type="checkbox">` and keeps default submit value `on` when no value is provided.

## Runtime notes

Hydration optional. Static checked state works server-only.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | native checkbox role |
| Checked state | native `checked` / `defaultChecked` |
| Submission | native name/value semantics |

## Keymap spec

- `Space`: toggles checked state
