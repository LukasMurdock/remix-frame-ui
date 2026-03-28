# Skeleton

Maturity: experimental

## When to use

- Provides non-interactive loading placeholders for content blocks.
- Supports configurable line count and optional pulse animation.

## Import

```ts
import { Skeleton } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Skeleton } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return <Skeleton lines={4} animated />
}
```

## HTML parity

`Skeleton` provides non-interactive loading placeholders for content blocks.

## Runtime notes

Supports configurable line count and optional pulse animation.

## Accessibility matrix

| Requirement     | Behavior                                              |
| --------------- | ----------------------------------------------------- |
| Non-interactive | rendered with `aria-hidden="true"`                    |
| Visual rhythm   | line count controls placeholder density               |
| Motion safety   | animation can be disabled and respects reduced motion |

## Keymap spec

- No key handling; decorative loading placeholder
