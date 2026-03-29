# Table

Maturity: experimental

## When to use

- Render static tabular content without sorting, selection, or pagination behavior
- Build straightforward data views where native table semantics are sufficient

## Import

```ts
import { Table } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Table` uses native table semantics with `caption`, `thead`, and `tbody`.

## Runtime notes

`Table` is static by default and supports empty-state rows without hydration.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Header semantics | column headers use `scope="col"` |
| Caption support | optional table caption |
| Empty rows | full-width empty row fallback |

## Keymap spec

- Keyboard behavior follows native table and child control semantics.
