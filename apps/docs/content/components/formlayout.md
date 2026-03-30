# FormLayout

Maturity: experimental

## When to use

- Provides structured form sections with optional heading, description, and actions.
- Use `columns` for responsive-like grouping while keeping native `<form>` semantics.

## Import

```ts
import { FormLayout } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`FormLayout` provides structured form sections with optional heading, description, and actions.

## Runtime notes

Use `columns` for grouped desktop layouts while keeping native `<form>` semantics. Action rows align with start by default for top-to-bottom completion flow.

## Accessibility matrix

| Requirement      | Behavior                                                                       |
| ---------------- | ------------------------------------------------------------------------------ |
| Native semantics | renders a native `<form>` container                                            |
| Context wiring   | optional title and description map to `aria-labelledby` and `aria-describedby` |
| Action grouping  | actions render as a dedicated footer row                                       |
| Mobile behavior  | multi-column layouts collapse to one column on narrow viewports                |

## Keymap spec

- `Tab`: move between form controls
- `Enter`: submit focused form when submit button is present
