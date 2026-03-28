# Avatar

Maturity: experimental

## When to use

- Renders an image or text fallback token for user identity surfaces.
- When `src` is provided, avatar renders an `<img>`.

## Import

```ts
import { Avatar } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Avatar } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return <Avatar name="Ada Lovelace" status="online" size="lg" />
}
```

## HTML parity

`Avatar` renders an image or text fallback token for user identity surfaces.

## Runtime notes

When `src` is provided, avatar renders an `<img>`. Otherwise it falls back to generated initials from `name`.

## Accessibility matrix

| Requirement          | Behavior                                                  |
| -------------------- | --------------------------------------------------------- |
| Image alternative    | supports explicit `alt` text and defaults to `name`       |
| Fallback readability | initials generated from provided name                     |
| Status hinting       | optional status data attribute for visual presence states |

## Keymap spec

- No component-level key bindings.
