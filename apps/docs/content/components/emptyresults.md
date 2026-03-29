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
