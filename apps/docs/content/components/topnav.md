# TopNav

Maturity: experimental

## HTML parity

`TopNav` provides horizontal application navigation with active-state highlighting.

## Runtime notes

Supports compact mode, disabled entries, and default active-item fallback to first enabled route.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Landmark semantics | uses `nav` with explicit top navigation label |
| Active state | active entry exposes `aria-current="page"` |
| Keyboard behavior | native link keyboard behavior without custom handlers |

## Keymap spec

- No custom key handling; uses native link keyboard behavior
