# Select

Maturity: experimental

## HTML parity

`Select` is native `<select>` only in v1. No custom combobox replacement.

## Runtime notes

Server-rendered by default; browser handles interaction semantics.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | native select/listbox behavior |
| Option disabling | native `disabled` |
| Required | native constraint validation |

## Keymap spec

- Arrow keys: option navigation
- `Enter`: commits selection (platform dependent)
