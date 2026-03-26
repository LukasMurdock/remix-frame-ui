# DataTable

Maturity: experimental

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

## Example: FilterPanel integration

```ts
import {
  composeDataTableRowFilter,
  createDataTableContainsFilter,
  createDataTableEqualsFilter,
  type DataTableRow,
} from "@remix-frame-ui/remix"

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
