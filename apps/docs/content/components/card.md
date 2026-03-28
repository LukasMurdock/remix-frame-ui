# Card

Maturity: experimental

## When to use

- Provides semantic section structure with optional header and footer regions.
- Is presentational and requires no hydration by default.

## Import

```ts
import { Card } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Card } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <Card title="Release status" subtitle="Updated 2 minutes ago" footer="Last deployed by CI">
      All quality gates passed.
    </Card>
  )
}
```

## HTML parity

`Card` provides semantic section structure with optional header and footer regions.

## Runtime notes

`Card` is presentational and requires no hydration by default.

## Accessibility matrix

| Requirement        | Behavior                           |
| ------------------ | ---------------------------------- |
| Landmark semantics | uses `<section>` wrapper           |
| Heading support    | optional title rendered as heading |
| Content grouping   | header/body/footer separation      |

## Keymap spec

- No component-specific keyboard behavior; delegates to child controls.
