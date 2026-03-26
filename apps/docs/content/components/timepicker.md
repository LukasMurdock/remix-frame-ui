# TimePicker

Maturity: experimental

## HTML parity

`TimePicker` wraps native `<input type="time">` with min/max/step constraints.

## Runtime notes

Hydration optional for basic usage. Add hydration if you need custom parsing feedback.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Label association | via native `<label for>` and `id` |
| Constraints | native `min`, `max`, and `step` semantics |
| Error wiring | supports `aria-describedby` and `aria-invalid` |

## Keymap spec

- `ArrowUp` / `ArrowDown`: increment or decrement segment
- `Tab`: move to next focus target
