# FloatingPanel

Maturity: experimental
Platform: mobile

## When to use

- Present secondary map or list context in a draggable panel without leaving the current screen.
- Snap between predefined heights while keeping touch interactions focused on one surface.

## Import

```ts
import { FloatingPanel } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`FloatingPanel` renders a semantic `<section>` with a keyboard-focusable resize separator and scrollable body content.

## Runtime notes

Supports controlled (`height`) and uncontrolled (`defaultHeight`) modes, snap anchors, pointer dragging, and keyboard height stepping.

## Accessibility matrix

| Requirement      | Behavior                                                      |
| ---------------- | ------------------------------------------------------------- |
| Region semantics | root uses `role="region"` with configurable `aria-label`      |
| Resize semantics | handle uses `role="separator"` with min/max/current values    |
| Keyboard support | `ArrowUp`/`ArrowDown`, `Home`, and `End` move between anchors |

## Keymap spec

- `ArrowUp`/`ArrowDown`: step to adjacent anchors based on placement
- `Home`: snap to minimum anchor
- `End`: snap to maximum anchor
