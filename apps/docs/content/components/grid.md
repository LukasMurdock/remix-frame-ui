# Grid

Maturity: stable

## When to use

- Renders a semantic `<div>` grid container, and `GridItem` renders semantic `<div>` cells.
- Use `columns`, `gap`, and item `span` values to compose responsive dashboard blocks, form sections, and analytics tiles.

## Import

```ts
import { Grid } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos on this page for complete `Grid` usage patterns.

## HTML parity

`Grid` renders a semantic `<div>` grid container, and `GridItem` renders semantic `<div>` cells.

## Runtime notes

Use `columns`, `gap`, and item `span` values to compose responsive dashboard blocks, form sections, and analytics tiles.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Semantics | neutral layout container and item elements |
| Keyboard | no component-level key handling |
| Layout control | data attributes express columns, alignment, and item spans |

## Keymap spec

- No component-level key bindings.

