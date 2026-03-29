# Chip

Maturity: experimental

## When to use

- Is an alias of `Tag` and renders a semantic `<span>`.
- No hydration required for static chips.

## Import

```ts
import { Chip } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Chip` is an alias of `Tag` and renders a semantic `<span>`.

## Runtime notes

No hydration required for static chips.

## Accessibility matrix

| Requirement   | Behavior                                              |
| ------------- | ----------------------------------------------------- |
| Semantic text | plain inline text content                             |
| API parity    | same tone behavior as `Tag`                           |
| Keyboard      | not focusable unless composed with interactive parent |

## Keymap spec

- No component-level key bindings.
