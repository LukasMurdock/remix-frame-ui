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

## Example

See demos on this page for complete `FormLayout` usage patterns.

## HTML parity

`FormLayout` provides structured form sections with optional heading, description, and actions.

## Runtime notes

Use `columns` for responsive-like grouping while keeping native `<form>` semantics.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Native semantics | renders a native `<form>` container |
| Context wiring | optional title and description map to `aria-labelledby` and `aria-describedby` |
| Action grouping | actions render as a dedicated footer row |

## Keymap spec

- `Tab`: move between form controls
- `Enter`: submit focused form when submit button is present

