# Breadcrumbs

Maturity: experimental

## When to use

- Provides hierarchical navigation with a current-page marker.
- If no item is marked current, the final item becomes the current page.

## Import

```ts
import { Breadcrumbs } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Breadcrumbs } from "@lukasmurdock/remix-ui-components"

const items = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "acme", label: "Acme", current: true },
]

export function Example() {
  return <Breadcrumbs items={items} />
}
```

## HTML parity

`Breadcrumbs` provides hierarchical navigation with a current-page marker.

## Runtime notes

If no item is marked current, the final item becomes the current page.

## Accessibility matrix

| Requirement        | Behavior                                      |
| ------------------ | --------------------------------------------- |
| Landmark semantics | uses a `nav` region with breadcrumb label     |
| Hierarchy          | renders list semantics via ordered list items |
| Current page       | marks active entry with `aria-current="page"` |

## Keymap spec

- No custom key handling; links use standard browser keyboard behavior
