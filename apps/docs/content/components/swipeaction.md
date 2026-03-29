# SwipeAction

Maturity: experimental
Platform: mobile

## When to use

- Reveal contextual row actions with horizontal swipe gestures in dense mobile lists.
- Keep list items compact while still exposing secondary commands.

## Import

```ts
import { SwipeAction } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`SwipeAction` keeps action buttons in a hidden track and translates content horizontally to reveal them.

## Runtime notes

Supports controlled/uncontrolled open side state, threshold-based release behavior, and optional auto-close after action selection.

## Accessibility matrix

| Requirement      | Behavior                                                                     |
| ---------------- | ---------------------------------------------------------------------------- |
| Action semantics | revealed actions are native `button` elements                                |
| Disabled states  | actions support native `disabled` behavior                                   |
| Touch behavior   | horizontal drag reveals side actions while vertical scroll remains available |

## Keymap spec

- No custom key bindings for reveal gesture
- `Tab` / `Shift+Tab`: move focus through visible interactive content and action buttons
