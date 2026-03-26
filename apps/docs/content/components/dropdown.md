# Dropdown

Maturity: experimental

## HTML parity

`Dropdown` is a convenience wrapper over menu semantics for action selection.

## Runtime notes

Uses `Menu` behavior for open state, keyboard navigation, item selection callbacks, and dismissal patterns.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Trigger | `aria-haspopup="menu"` and expansion state |
| Menu semantics | role-based `menu` and `menuitem` structure |
| Keyboard support | arrow navigation and Escape close |

## Keymap spec

- `ArrowDown`/`ArrowUp`: open and navigate options
- `Home`/`End`: jump to boundaries
- `Escape`: close and restore trigger focus
