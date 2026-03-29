# DataList

Maturity: experimental

## When to use

- Renders a semantic list with title, description, metadata, and actions.
- Is presentational and does not require hydration unless child actions are interactive.

## Import

```ts
import { DataList } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`DataList` renders a semantic list with title, description, metadata, and actions.

## Runtime notes

`DataList` is presentational and does not require hydration unless child actions are interactive.

## Accessibility matrix

| Requirement    | Behavior                       |
| -------------- | ------------------------------ |
| List semantics | native `ul`/`li` structure     |
| Empty handling | dedicated empty-state fallback |
| Action support | optional per-row action region |

## Keymap spec

- Keyboard behavior is inherited from focusable child controls.
