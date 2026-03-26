# SideNav

Maturity: experimental

## HTML parity

`SideNav` provides sectioned application navigation with active-state highlighting.

## Runtime notes

Supports compact mode and optional nested child items within a section.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Landmark semantics | uses `nav` with explicit side navigation label |
| Active state | active entry exposes `aria-current="page"` |
| Hierarchy | supports nested list structure for grouped routes |

## Keymap spec

- No custom key handling; uses native link keyboard behavior
