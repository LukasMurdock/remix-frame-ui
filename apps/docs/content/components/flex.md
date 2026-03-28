# Flex

Maturity: stable

## When to use

- Renders a semantic `<div>` container for one-dimensional layout composition.
- Use `direction`, `align`, `justify`, `wrap`, and `gap` to compose toolbars, header actions, and inline control groups with consistent spacing.

## Import

```ts
import { Flex } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Flex } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <Flex align="center" justify="between" gap="1rem">
      <span>Build</span>
      <span>Passing</span>
    </Flex>
  )
}
```

## HTML parity

`Flex` renders a semantic `<div>` container for one-dimensional layout composition.

## Runtime notes

Use `direction`, `align`, `justify`, `wrap`, and `gap` to compose toolbars, header actions, and inline control groups with consistent spacing.

## Accessibility matrix

| Requirement    | Behavior                                                      |
| -------------- | ------------------------------------------------------------- |
| Semantics      | neutral container element                                     |
| Keyboard       | no component-level key handling                               |
| Layout control | data attributes express alignment, direction, and wrap intent |

## Keymap spec

- No component-level key bindings.
