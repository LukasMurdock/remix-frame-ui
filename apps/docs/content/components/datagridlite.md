# DataGridLite

Maturity: experimental

## When to use

- Uses native table semantics and adds sortable/selectable interaction affordances.
- Supports controlled and uncontrolled sorting and row selection, plus loading and empty states.

## Import

```ts
import { DataGridLite } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { DataGridLite } from "@lukasmurdock/remix-ui-components"

const columns = [
  { key: "service", header: "Service", sortable: true },
  { key: "latency", header: "Latency", align: "right", sortable: true },
]

const rows = [
  { key: "api", cells: { service: "API", latency: "121ms" }, sortValues: { latency: 121 } },
  { key: "worker", cells: { service: "Worker", latency: "410ms" }, sortValues: { latency: 410 } },
]

export function Example() {
  return <DataGridLite columns={columns} rows={rows} defaultSort={{ columnKey: "latency", direction: "asc" }} />
}
```

## HTML parity

`DataGridLite` uses native table semantics and adds sortable/selectable interaction affordances.

## Runtime notes

Supports controlled and uncontrolled sorting and row selection, plus loading and empty states.

## Accessibility matrix

| Requirement         | Behavior                                        |
| ------------------- | ----------------------------------------------- |
| Table semantics     | native `table`, `thead`, `tbody`, and `caption` |
| Sorting semantics   | sortable headers announce `aria-sort`           |
| Selection semantics | row and select-all checkboxes with labels       |

## Keymap spec

- `Tab`: navigate to sorting and selection controls
- `Enter`/`Space`: toggle sort and checkbox states
