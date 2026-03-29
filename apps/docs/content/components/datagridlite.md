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
