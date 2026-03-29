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
