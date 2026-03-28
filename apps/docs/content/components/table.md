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

## Example

```tsx
import { Table } from "@lukasmurdock/remix-ui-components"

const columns = [
  { key: "name", header: "Name" },
  { key: "status", header: "Status" },
]

const rows = [
  { key: "1", cells: { name: "Release 1.2", status: "Running" } },
  { key: "2", cells: { name: "Release 1.3", status: "Success" } },
]

export function ReleaseTable() {
  return <Table caption="Recent releases" columns={columns} rows={rows} />
}
```

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
