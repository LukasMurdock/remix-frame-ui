# Combobox

Maturity: experimental

## When to use

- Let users type and narrow a list of options
- Support keyboard-first option discovery and commit

## Import

```ts
import { Combobox } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Combobox` uses input + listbox semantics for searchable option selection.

## Runtime notes

Requires a visible `label` and supports controlled and uncontrolled value modes with keyboard and pointer selection. Pass `name` when the field should submit through native form posts. `required`, `disabled`, `aria-describedby`, and `aria-invalid` are wired directly to the input.

## Accessibility matrix

| Requirement      | Behavior                                            |
| ---------------- | --------------------------------------------------- |
| Input role       | `role="combobox"` with listbox relationship         |
| Input labeling   | visible label is required and bound to input `id`   |
| Option semantics | rendered as `role="option"` entries                 |
| Keyboard support | arrow navigation, Enter select, Escape close        |
| Enter in forms   | prevents accidental native submit when list is open |

## Keymap spec

- `ArrowDown`/`ArrowUp`: move active option
- `Enter`: commit active option
- `Escape`: close options
