# DataGridLite

Maturity: experimental

## HTML parity

`DataGridLite` uses native table semantics and adds sortable/selectable interaction affordances.

## Runtime notes

Supports controlled and uncontrolled sorting and row selection, plus loading and empty states.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Table semantics | native `table`, `thead`, `tbody`, and `caption` |
| Sorting semantics | sortable headers announce `aria-sort` |
| Selection semantics | row and select-all checkboxes with labels |

## Keymap spec

- `Tab`: navigate to sorting and selection controls
- `Enter`/`Space`: toggle sort and checkbox states
