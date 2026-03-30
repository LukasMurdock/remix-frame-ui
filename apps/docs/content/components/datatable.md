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
Supports row-level interaction callbacks: `onRowClick`, `onRowEnter`, `onRowKeyActivate`, and `onRowAction`.
Use `selectionMode` (`none` | `single` | `multiple`) for selection behavior; `selectable` remains a `multiple` alias.
Enable `selectOnRowClick` to toggle selection from row interaction (single mode defaults this on and hides checkbox chrome).
`surface` and `density` emit `data-surface` and `data-density` for style hooks.
Use `dataSource.fetch(query, { signal })` for first-class server loading with cancellation and stale-response protection.
`dataSource` query includes `page`, `pageSize`, `sort`, `filterText`, and `filterColumnKeys` and resets to page 1 on sort/filter changes.
`@lukasmurdock/remix-ui-styles` publishes semver-stable DataTable `data-part` hooks and `--rf-data-table-*` CSS variables for wrapper/header/rows/sort/footer customization.

## Accessibility matrix

| Requirement        | Behavior                                                                    |
| ------------------ | --------------------------------------------------------------------------- |
| Table semantics    | uses native table structure with sortable column metadata                   |
| Row interaction    | optional row activation callbacks with focusable row semantics              |
| Selection support  | `none` / `single` / `multiple`, with page-level checkbox only in `multiple` |
| Pagination control | previous and next controls keep page state bounded                          |

## Keymap spec

- `Tab`: move between sortable headers, selection checkboxes, and pagination controls
- `Enter`/`Space`: activate sortable headers and controls
- `Enter`/`Space` on focused row: fires row key activation and row action callbacks
