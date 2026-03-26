# Input

Maturity: experimental

## HTML parity

`Input` is a native `<input>` wrapper limited to text-like types in v1.

## Runtime notes

No hydration required unless composed with dynamic event behavior.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Label association | via `<label for>` and `id` |
| Error wiring | supports `aria-describedby` and `aria-invalid` |
| Keyboard input | native text editing behavior |

## Keymap spec

- Printable keys: updates value
- `Tab`: next focus target
