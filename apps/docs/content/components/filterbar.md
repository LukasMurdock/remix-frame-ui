# FilterBar

Maturity: experimental

## HTML parity

`FilterBar` groups native filter controls and actions in a semantic section.

## Runtime notes

`FilterBar` is layout-only and relies on child controls for behavior.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Region semantics | section with `aria-label="Filters"` |
| Group clarity | title and action grouping |
| Control behavior | delegated to native form controls |

## Keymap spec

- Keyboard behavior is inherited from child controls.
