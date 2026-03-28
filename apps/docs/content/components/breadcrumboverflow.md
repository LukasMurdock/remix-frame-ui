# BreadcrumbOverflow

Maturity: experimental

## When to use

- Collapses middle breadcrumb items into an ellipsis marker.
- Keeps the first and tail items visible while collapsing long middle paths.

## Import

```ts
import { BreadcrumbOverflow } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { BreadcrumbOverflow } from "@lukasmurdock/remix-ui-components"

const items = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "acme", label: "Acme", href: "/projects/acme" },
  { id: "settings", label: "Settings", href: "/projects/acme/settings" },
  { id: "notifications", label: "Notifications", current: true },
]

export function Example() {
  return <BreadcrumbOverflow items={items} maxVisible={3} />
}
```

## HTML parity

`BreadcrumbOverflow` collapses middle breadcrumb items into an ellipsis marker.

## Runtime notes

Keeps the first and tail items visible while collapsing long middle paths.

## Accessibility matrix

| Requirement        | Behavior                                       |
| ------------------ | ---------------------------------------------- |
| Landmark semantics | uses `nav` region with breadcrumb label        |
| Current page       | forwards `aria-current="page"` to active item  |
| Overflow clarity   | ellipsis includes accessible hidden-item label |

## Keymap spec

- No custom key handling; visible links keep native keyboard behavior
