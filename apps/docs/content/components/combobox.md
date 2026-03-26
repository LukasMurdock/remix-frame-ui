# Combobox

Maturity: experimental

## HTML parity

`Combobox` uses input + listbox semantics for searchable option selection.

## Runtime notes

Supports controlled and uncontrolled value modes with keyboard and pointer selection.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Input role | `role="combobox"` with listbox relationship |
| Option semantics | rendered as `role="option"` entries |
| Keyboard support | arrow navigation, Enter select, Escape close |

## Keymap spec

- `ArrowDown`/`ArrowUp`: move active option
- `Enter`: commit active option
- `Escape`: close options
