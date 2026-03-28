# Splitter

Maturity: experimental

## When to use

- Creates a two-pane resizable layout with a draggable separator handle.
- Supports horizontal and vertical layouts, controlled or uncontrolled size, keyboard resizing, and min/max constraints.

## Import

```ts
import { Splitter } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Splitter } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return <Splitter first={<section>Editor</section>} second={<section>Preview</section>} defaultSize={60} />
}
```

## HTML parity

`Splitter` creates a two-pane resizable layout with a draggable separator handle.

## Runtime notes

Supports horizontal and vertical layouts, controlled or uncontrolled size, keyboard resizing, and min/max constraints.

## Accessibility matrix

| Requirement          | Behavior                                                |
| -------------------- | ------------------------------------------------------- |
| Separator semantics  | handle uses `role="separator"` with value metadata      |
| Keyboard resize      | arrow keys adjust size, `Home` and `End` jump to bounds |
| Orientation metadata | separator announces horizontal or vertical axis         |

## Keymap spec

- `ArrowLeft`/`ArrowRight`: resize horizontal splitter by step
- `ArrowUp`/`ArrowDown`: resize vertical splitter by step
- `Home`: set first pane to minimum size
- `End`: set first pane to maximum size
