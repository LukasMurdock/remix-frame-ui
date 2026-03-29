# TabBar

Maturity: experimental
Platform: mobile

## When to use

- Provide persistent bottom navigation between top-level mobile destinations.
- Keep route switching available while preserving vertical content context.

## Import

```ts
import { TabBar } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`TabBar` renders semantic navigation with bottom-tab styling and active-route emphasis.

## Runtime notes

Supports controlled and uncontrolled active state, disabled tabs, badge rendering, and optional safe-area padding.

## Accessibility matrix

| Requirement        | Behavior                                              |
| ------------------ | ----------------------------------------------------- |
| Landmark semantics | uses `nav` with explicit tab-bar label                |
| Active route       | selected item exposes `aria-current="page"`           |
| Disabled state     | disabled tabs use native `button[disabled]` semantics |

## Keymap spec

- `ArrowLeft` / `ArrowRight`: move selection between enabled tabs
- `Home` / `End`: jump to first or last enabled tab
