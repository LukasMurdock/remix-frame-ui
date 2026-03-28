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

```tsx
import { Image } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return <Image src="/images/dashboard-preview.png" alt="Dashboard preview" width={640} height={360} fit="cover" />
}
```

## HTML parity

`Image` renders a native `<img>` wrapped in a semantic `<figure>` container.

## Runtime notes

Use `fit` to control object fitting behavior and `loading` to choose lazy or eager loading.

## Accessibility matrix

| Requirement      | Behavior                             |
| ---------------- | ------------------------------------ |
| Alternative text | requires native `alt` text           |
| Loading behavior | supports native `loading` strategies |
| Keyboard         | non-interactive media element        |

## Keymap spec

- No component-level key bindings.
