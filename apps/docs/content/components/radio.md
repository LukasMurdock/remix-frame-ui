# Radio

Maturity: experimental

## HTML parity

`Radio` uses native `<input type="radio">`; `RadioGroup` composes a native `<fieldset>` and `<legend>`.

## Runtime notes

Group behavior depends on shared `name` and browser-native exclusivity. `RadioGroup` supports orientation and `onValueChange` hooks for app state wiring.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Group labeling | native legend support |
| Error support | optional group-level error description |
| Single selection | native radio semantics |

## Keymap spec

- `Tab`: enters/leaves group
- Arrow keys: browser native radio navigation
