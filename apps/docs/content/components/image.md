# Image

Maturity: experimental

## When to use

- Renders a native `<img>` wrapped in a semantic `<figure>` container.
- Use `fit` to control object fitting behavior and `loading` to choose lazy or eager loading.

## Import

```ts
import { Image } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos on this page for complete `Image` usage patterns.

## HTML parity

`Image` renders a native `<img>` wrapped in a semantic `<figure>` container.

## Runtime notes

Use `fit` to control object fitting behavior and `loading` to choose lazy or eager loading.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Alternative text | requires native `alt` text |
| Loading behavior | supports native `loading` strategies |
| Keyboard | non-interactive media element |

## Keymap spec

- No component-level key bindings.

