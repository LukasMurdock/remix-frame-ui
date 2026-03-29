# Select

Maturity: experimental

## When to use

- Offer finite option selection with native browser semantics
- Keep keyboard and assistive behavior fully delegated to `<select>`

## Import

```ts
import { Select } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

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
