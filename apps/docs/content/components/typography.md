# Typography

Maturity: stable

## When to use

- Provides semantic text primitives (`Heading`, `Text`, `Code`) that render native heading, text, and code elements.
- No hydration is required for static content.

## Import

```ts
import { Typography } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Typography } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <Typography as="p" truncate>
      Very long status message that should truncate in narrow layouts.
    </Typography>
  )
}
```

## HTML parity

`Typography` provides semantic text primitives (`Heading`, `Text`, `Code`) that render native heading, text, and code elements.

## Runtime notes

No hydration is required for static content. Optional `truncate` metadata can be used by CSS for ellipsis behavior.

## Accessibility matrix

| Requirement       | Behavior                                                                   |
| ----------------- | -------------------------------------------------------------------------- |
| Heading semantics | `Heading` maps to native `h1` through `h6`                                 |
| Text semantics    | `Text` maps to native text elements (`p`, `span`, `strong`, `em`, `small`) |
| Code semantics    | `Code` maps to native `code` and optional `pre > code`                     |
| Keyboard          | static typography does not add key handlers                                |

## Keymap spec

- No component-level key bindings.
