# Badge

Maturity: experimental

## When to use

- Show compact status metadata next to content
- Emphasize severity or state without adding interactive controls

## Import

```ts
import { Badge } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Badge` renders a semantic `<span>` for compact status labels.

## Runtime notes

No hydration required for static labels.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Semantic text | plain inline text content |
| Color support | tone variants for status emphasis |
| Keyboard | not focusable unless composed with interactive parent |

## Keymap spec

- No component-level key bindings.
