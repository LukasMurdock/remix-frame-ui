# Breadcrumbs

Maturity: experimental

## HTML parity

`Breadcrumbs` provides hierarchical navigation with a current-page marker.

## Runtime notes

If no item is marked current, the final item becomes the current page.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Landmark semantics | uses a `nav` region with breadcrumb label |
| Hierarchy | renders list semantics via ordered list items |
| Current page | marks active entry with `aria-current="page"` |

## Keymap spec

- No custom key handling; links use standard browser keyboard behavior
