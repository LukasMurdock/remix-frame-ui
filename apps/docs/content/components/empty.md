# Empty

Maturity: experimental

## When to use

- Renders a semantic status section for no-data and no-selection states.
- Supports optional icon and action regions with compact and comfortable density options.

## Import

```ts
import { Empty } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Empty` renders a semantic status section for no-data and no-selection states.

## Runtime notes

Supports optional icon and action regions with compact and comfortable density options.

## Accessibility matrix

| Requirement       | Behavior                                                |
| ----------------- | ------------------------------------------------------- |
| Status semantics  | uses `role="status"` for passive announcements          |
| Content structure | title, optional description, and optional action region |
| Keyboard          | no component-level key handling                         |

## Keymap spec

- No component-level key bindings.
