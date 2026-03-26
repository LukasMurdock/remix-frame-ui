# Form

Maturity: stable

## HTML parity

`Form` renders a native `<form>` and preserves `action`, `method`, `encType`, and `noValidate` behavior.

## Runtime notes

Use `busy` to express pending submissions via `aria-busy` and a `data-busy` attribute. `FormErrorSummary` renders an alert region for submission validation errors.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Form semantics | native form submission and field grouping |
| Busy state | `aria-busy="true"` when pending |
| Error summary | assertive `role="alert"` region for validation issues |
| Keyboard Enter | submits according to native form rules |

## Keymap spec

- `Enter`: native submit behavior from focused submit-capable controls
