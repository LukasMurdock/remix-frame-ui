# ActionSheet

Maturity: experimental
Platform: mobile

## When to use

- Present a short set of contextual actions from the bottom of the viewport.
- Prioritize touch-first decision flows with clear cancel and destructive affordances.

## Import

```ts
import { ActionSheet } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`ActionSheet` renders a modal dialog with an actions list and optional cancel button.

## Runtime notes

Controlled-only (`open` + `onClose`) with backdrop and escape dismissal, optional cancel action, and close-on-select behavior.

## Accessibility matrix

| Requirement      | Behavior                                                     |
| ---------------- | ------------------------------------------------------------ |
| Modal semantics  | uses `role="dialog"` with `aria-modal="true"`                |
| Focus safety     | traps tab focus while open and restores prior focus on close |
| Action semantics | each option is a native `button` with disabled support       |

## Keymap spec

- `Escape`: close when enabled
- `Tab` / `Shift+Tab`: cycle focus through actions and cancel control
- `Enter` / `Space`: activate focused action
