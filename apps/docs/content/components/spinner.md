# Spinner

Maturity: experimental

## When to use

- Provides a compact loading indicator with status semantics.
- Supports size variants and optional custom loading label.

## Import

```ts
import { Spinner } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos on this page for complete `Spinner` usage patterns.

## HTML parity

`Spinner` provides a compact loading indicator with status semantics.

## Runtime notes

Supports size variants and optional custom loading label.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Live status | uses `role="status"` and polite announcements |
| Visual indicator | animated dot remains hidden from assistive tech |
| Size control | `sm`, `md`, and `lg` variants supported |

## Keymap spec

- No key handling; status indicator only

