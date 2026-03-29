# InfiniteScroll

Maturity: experimental
Platform: mobile

## When to use

- Load long feed content in batches without pagination controls.
- Keep users in a continuous reading flow for timeline and activity lists.

## Import

```ts
import { InfiniteScroll } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`InfiniteScroll` keeps a native scroll container and emits loading behavior as the user nears the end.

## Runtime notes

Supports controlled or uncontrolled loading state with optional completion text when no more items are available.

## Accessibility matrix

| Requirement          | Behavior                                                    |
| -------------------- | ----------------------------------------------------------- |
| Status announcements | footer uses polite live region messaging                    |
| Keyboard support     | list content remains keyboard-scrollable and tab-order safe |
| Feed continuity      | loads additional rows without forcing pagination navigation |

## Keymap spec

- No custom keyboard shortcuts
- Native browser scrolling keys apply in the viewport
