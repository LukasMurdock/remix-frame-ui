# Descriptions

Maturity: experimental

## When to use

- Presents read-only label/value pairs in a dense, scannable detail layout.
- Supports grid columns, item spans, horizontal/vertical layouts, compact density, optional header metadata, responsive collapse breakpoints, and empty state.

## Import

```ts
import { Descriptions } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Descriptions, DescriptionsItem } from "@lukasmurdock/remix-ui-components"

const items: DescriptionsItem[] = [
  { key: "repo", label: "Repository", content: "remix-frame-ui" },
  { key: "owner", label: "Owner", content: "Platform" },
  { key: "status", label: "Status", content: "Healthy" },
]

export function Example() {
  return <Descriptions title="Service details" items={items} columns={3} />
}
```

## HTML parity

`Descriptions` presents read-only label/value pairs in a dense, scannable detail layout.

## Runtime notes

Supports grid columns, item spans, horizontal/vertical layouts, compact density, optional header metadata, responsive collapse breakpoints, and empty state.

## Accessibility matrix

| Requirement         | Behavior                                         |
| ------------------- | ------------------------------------------------ |
| Semantic pairs      | uses `dl` with `dt` and `dd` entries             |
| Section title       | optional heading for detail context              |
| Responsive grouping | item spans maintain logical label/value grouping |

## Keymap spec

- Uses native document navigation
- Does not add custom key handlers
