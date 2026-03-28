# DataTable

Maturity: experimental

## When to use

- Render large tabular datasets with sort, selection, and pagination in one surface
- Compose declarative row filtering from external filter UI (for example `FilterPanel`)

## Import

```ts
import {
  DataTable,
  composeDataTableRowFilter,
  createDataTableContainsFilter,
  createDataTableEqualsFilter,
} from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

### Basic usage

```tsx
import { DataTable } from "@lukasmurdock/remix-ui-components"

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "status", header: "Status", sortable: true },
]

const rows = [
  { key: "1", cells: { name: "Release 1.2", status: "Running" } },
  { key: "2", cells: { name: "Release 1.3", status: "Success" } },
]

export function ReleasesTable() {
  return <DataTable columns={columns} rows={rows} pageSize={10} selectable />
}
```

### FilterPanel integration

```ts
import {
  composeDataTableRowFilter,
  createDataTableContainsFilter,
  createDataTableEqualsFilter,
  type DataTableRow,
} from "@lukasmurdock/remix-ui-components"

type Filters = {
  query: string
  status: "all" | "success" | "running" | "failed"
}

function toRowFilter(filters: Filters) {
  return composeDataTableRowFilter(
    createDataTableContainsFilter(["name"], filters.query),
    createDataTableEqualsFilter("status", filters.status, "all"),
  )
}

const rowFilter = toRowFilter({ query: "1.2", status: "running" })
const visibleRows: DataTableRow[] = rowFilter ? allRows.filter(rowFilter) : allRows
```

## HTML parity

`DataTable` provides a full data surface with sorting, selection, and pagination controls.

## Runtime notes

Supports loading, error, and empty states with controlled or uncontrolled sort/selection/page state.
Pairs cleanly with `FilterPanel` by filtering source rows before sort and pagination.
Accepts `rowFilter` for declarative row-level filtering in component usage.
Use `createDataTableContainsFilter`, `createDataTableEqualsFilter`, and `composeDataTableRowFilter` to build filter predicates from UI state.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Table semantics | uses native table structure with sortable column metadata |
| Selection support | optional row and page-level checkbox selection |
| Pagination control | previous and next controls keep page state bounded |

## Keymap spec

- `Tab`: move between sortable headers, selection checkboxes, and pagination controls
- `Enter`/`Space`: activate sortable headers and controls
