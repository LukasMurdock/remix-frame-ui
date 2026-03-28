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

## Example

```tsx
import { FloatingPanel } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <FloatingPanel anchors={[120, 260, 420]} defaultHeight={260}>
      <h2 style="margin:0;">Nearby points</h2>
      <ul style="margin:0;padding-left:1.1rem;display:grid;gap:.4rem;">
        <li>Warehouse A - 3 min</li>
        <li>Warehouse B - 8 min</li>
        <li>Warehouse C - 12 min</li>
      </ul>
    </FloatingPanel>
  )
}
```

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
