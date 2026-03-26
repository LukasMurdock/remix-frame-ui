# Slider

Maturity: experimental

## HTML parity

`Slider` wraps native `<input type="range">` for continuous or stepped selection.

## Runtime notes

Hydration optional unless you need live value updates via `onValueChange`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Native semantics | uses native range input with `slider` role mapping |
| Value constraints | supports `min`, `max`, and `step` |
| Error wiring | supports `aria-describedby` and `aria-invalid` |

## Keymap spec

- `ArrowLeft` / `ArrowDown`: decrement value
- `ArrowRight` / `ArrowUp`: increment value
- `Home` / `End`: jump to min or max
