# Autocomplete

Maturity: experimental

## HTML parity

`Autocomplete` uses input + listbox semantics and allows free-text entry.

## Runtime notes

Supports controlled and uncontrolled values and emits commit events for suggestions or free text.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Input role | `role="combobox"` with listbox relationship |
| Option semantics | rendered as `role="option"` entries |
| Keyboard support | arrow navigation, Enter commit, Tab suggestion commit, Escape close |

## Keymap spec

- `ArrowDown`/`ArrowUp`: move active suggestion
- `Enter`: commit active suggestion or current free text
- `Tab`: commit highlighted suggestion
- `Escape`: close suggestions
