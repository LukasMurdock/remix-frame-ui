# DataTable

Maturity: experimental

## HTML parity

`DataTable` provides a full data surface with sorting, selection, and pagination controls.

## Runtime notes

Supports loading, error, and empty states with controlled or uncontrolled sort/selection/page state.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Table semantics | uses native table structure with sortable column metadata |
| Selection support | optional row and page-level checkbox selection |
| Pagination control | previous and next controls keep page state bounded |

## Keymap spec

- `Tab`: move between sortable headers, selection checkboxes, and pagination controls
- `Enter`/`Space`: activate sortable headers and controls
