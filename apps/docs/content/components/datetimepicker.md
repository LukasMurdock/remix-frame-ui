# DateTimePicker

Maturity: experimental

## HTML parity

`DateTimePicker` composes native date and time inputs and emits a combined local datetime value.

## Runtime notes

Hydration optional for native behavior. Use hydration when listening to `onValueChange`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Native semantics | uses native `date` and `time` inputs |
| Combined submission | optional hidden input supports single `name` payload |
| Error wiring | supports `aria-describedby` and `aria-invalid` |

## Keymap spec

- `Tab`: move between date and time fields
- `Arrow` keys: adjust focused field segments
