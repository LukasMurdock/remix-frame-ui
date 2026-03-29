# PullToRefresh

Maturity: experimental
Platform: mobile

## When to use

- Refresh feed-like content from the top of a touch scroll surface.
- Keep users in context when polling or explicit refresh buttons feel too heavy.

## Import

```ts
import { PullToRefresh } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`PullToRefresh` wraps scrollable content with a pull indicator and release threshold behavior.

## Runtime notes

Supports pointer pull gestures, async refresh callbacks, controlled `refreshing` state, and completion messaging.

## Accessibility matrix

| Requirement          | Behavior                                                            |
| -------------------- | ------------------------------------------------------------------- |
| Status announcements | indicator uses polite live region updates                           |
| Gesture fallback     | content remains fully scrollable with pointer and keyboard controls |
| Touch safety         | refresh starts only at top scroll boundary                          |

## Keymap spec

- No custom keyboard shortcuts; refresh is gesture-driven
- `Tab` / `Shift+Tab`: move through interactive children naturally
