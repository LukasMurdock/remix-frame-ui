# EmptyResults

Maturity: experimental

## When to use

- Communicates filtered/no-match states with optional recovery action.
- Is static by default and supports interactive actions when provided.

## Import

```ts
import { EmptyResults } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { EmptyResults } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <EmptyResults
      description="Try removing one or more filters."
      clearAction={<button type="button">Clear filters</button>}
    />
  )
}
```

## HTML parity

`EmptyResults` communicates filtered/no-match states with optional recovery action.

## Runtime notes

`EmptyResults` is static by default and supports interactive actions when provided.

## Accessibility matrix

| Requirement       | Behavior                            |
| ----------------- | ----------------------------------- |
| Status semantics  | `role="status"` with polite updates |
| Message hierarchy | title + supporting description      |
| Recovery path     | optional clear/reset action region  |

## Keymap spec

- Keyboard behavior is inherited from child action controls.
