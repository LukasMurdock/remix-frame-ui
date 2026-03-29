# Calendar

Maturity: experimental

## When to use

- Renders a native date input, with optional month-only mode for year-style selection.
- Use `view="month"` for day-level selection and `view="year"` for month-level selection.

## Import

```ts
import { Calendar } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Calendar` renders a native date input, with optional month-only mode for year-style selection.

## Runtime notes

Use `view="month"` for day-level selection and `view="year"` for month-level selection. Native browser widgets handle interaction, with optional `onValueChange` hydration for app state sync.

## Accessibility matrix

| Requirement     | Behavior                                   |
| --------------- | ------------------------------------------ |
| Input semantics | native date or month input control         |
| Keyboard        | browser-native date input keyboard support |
| Disabled state  | native disabled behavior                   |

## Keymap spec

- Browser-native date input key handling
