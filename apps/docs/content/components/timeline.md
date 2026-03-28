# Timeline

Maturity: experimental

## When to use

- Shows ordered events with contextual status and optional timestamps.
- Supports per-item tone, optional description/time metadata, pending entry, and empty state.

## Import

```ts
import { Timeline } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos on this page for complete `Timeline` usage patterns.

## HTML parity

`Timeline` shows ordered events with contextual status and optional timestamps.

## Runtime notes

Supports per-item tone, optional description/time metadata, pending entry, and empty state.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Ordered sequence | uses semantic `ol` list of events |
| Status context | visual markers indicate item tone |
| Readability | title, detail, and time metadata are grouped per row |

## Keymap spec

- Uses native document navigation
- Does not add custom key handlers

