# Menu

Maturity: experimental

## HTML parity

`Menu` is action-menu scope only and uses menu/menuitem semantics.

## Runtime notes

Menu supports controlled and uncontrolled state with an `onSelect` callback for item activation. Keyboard dismissal (`Escape`) and trigger toggling are hydrated.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Trigger | `aria-haspopup="menu"` |
| Items | `role="menuitem"` |
| Disabled items | native disabled on item button |

## Keymap spec

- Arrow keys: move focus between items
- `Escape`: close menu
- `Enter`/`Space`: activate focused item
