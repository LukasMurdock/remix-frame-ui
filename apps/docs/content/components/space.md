# Space

Maturity: stable

## When to use

- Renders a semantic `<div>` wrapper for consistent spacing between adjacent children.
- Use `size`, `direction`, `align`, and optional wrapping to compose compact action rows or vertical stacks without bespoke spacing utilities.

## Import

```ts
import { Space } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Space } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <Space size="sm" align="center" wrap>
      <button type="button">Approve</button>
      <button type="button">Comment</button>
      <button type="button">Reject</button>
    </Space>
  )
}
```

## HTML parity

`Space` renders a semantic `<div>` wrapper for consistent spacing between adjacent children.

## Runtime notes

Use `size`, `direction`, `align`, and optional wrapping to compose compact action rows or vertical stacks without bespoke spacing utilities.

## Accessibility matrix

| Requirement    | Behavior                                             |
| -------------- | ---------------------------------------------------- |
| Semantics      | neutral grouping container                           |
| Keyboard       | no component-level key handling                      |
| Layout control | data attributes express spacing size and orientation |

## Keymap spec

- No component-level key bindings.
