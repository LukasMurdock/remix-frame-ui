# ImageViewer

Maturity: experimental
Platform: mobile

## When to use

- Display one or more images in a focused fullscreen overlay.
- Support swipe-gallery style browsing with keyboard parity for desktop contexts.

## Import

```ts
import { ImageViewer } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`ImageViewer` renders a modal dialog overlay with previous and next controls around an image frame.

## Runtime notes

Supports `open`/`visible` controlled display, controlled and uncontrolled index, `afterClose`, backdrop and escape dismissal, edge-clamped navigation by default, optional looping, and touch-swipe parity.

## Accessibility matrix

| Requirement         | Behavior                                                         |
| ------------------- | ---------------------------------------------------------------- |
| Modal semantics     | uses `role="dialog"` with `aria-modal="true"`                    |
| Focus management    | traps tab focus while open and restores prior focus on close     |
| Keyboard navigation | supports `ArrowLeft` / `ArrowRight`, `Home`, `End`, and `Escape` |

## Keymap spec

- `ArrowLeft` / `ArrowRight`: move to previous or next image
- `Home` / `End`: jump to first or last image
- `Escape`: close viewer when enabled
