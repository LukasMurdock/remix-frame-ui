# Anchor

Maturity: experimental

## When to use

- Renders in-page section links with a highlighted active target.
- Supports controlled or uncontrolled `activeHref`; disabled items remain non-interactive.

## Import

```ts
import { Anchor } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Anchor, AnchorItem } from "@lukasmurdock/remix-ui-components"

const items: AnchorItem[] = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "api", label: "API", href: "#api" },
  { id: "faq", label: "FAQ", href: "#faq", disabled: true },
]

export function Example() {
  return <Anchor items={items} defaultActiveHref="#api" />
}
```

## HTML parity

`Anchor` renders in-page section links with a highlighted active target.

## Runtime notes

Supports controlled or uncontrolled `activeHref`; disabled items remain non-interactive. Component and docs demo sync active state from `window.location.hash`. In controlled mode, hash changes emit `onActiveHrefChange` so external state can re-render the active item.

## Accessibility matrix

| Requirement         | Behavior                                      |
| ------------------- | --------------------------------------------- |
| Landmark semantics  | uses `nav` container with configurable label  |
| Active target state | active item exposes `aria-current="location"` |
| Disabled behavior   | disabled entries render as non-focusable text |

## Keymap spec

- Uses native anchor keyboard behavior (`Tab`, `Enter`, browser link navigation)
