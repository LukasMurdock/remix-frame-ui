# FormFieldset

Maturity: experimental

## HTML parity

`FormFieldset` wraps related controls in native `<fieldset>` and `<legend>` semantics.

## Runtime notes

Supports one- or two-column grouping for logically related inputs.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Group semantics | native `fieldset` and `legend` establish control relationships |
| Description wiring | optional description connects via `aria-describedby` |
| Layout grouping | grouped controls remain keyboard-linear |

## Keymap spec

- `Tab`: move through controls in grouped order
