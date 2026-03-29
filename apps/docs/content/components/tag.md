# Tag

Maturity: experimental

## When to use

- Label categories, metadata, or taxonomies inline
- Apply lightweight highlighting to text tokens

## Import

```ts
import { Tag } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Tag` renders a semantic `<span>` for categorization and metadata labels.

## Runtime notes

No hydration required for static tags.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Semantic text | plain inline text content |
| Tone variants | neutral and brand tone support |
| Keyboard | not focusable unless composed with interactive parent |

## Keymap spec

- No component-level key bindings.
