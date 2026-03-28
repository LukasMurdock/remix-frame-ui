# Pagination

Maturity: experimental

## When to use

- Navigate multi-page data sets while keeping page state explicit
- Pair with table, list, or search results pages

## Import

```ts
import { Pagination } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Pagination } from "@lukasmurdock/remix-ui-components"

export function ResultsPager() {
  return <Pagination page={3} totalPages={12} siblingCount={1} onPageChange={(page) => console.log(page)} />
}
```

## HTML parity

`Pagination` renders a nav landmark with previous/next controls and page buttons.

## Runtime notes

Hydration needed when wiring page changes through `onPageChange`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Landmark | uses `nav` with `aria-label="Pagination"` |
| Current page | active button sets `aria-current="page"` |
| Disabled states | previous/next disable at range bounds |

## Keymap spec

- `Tab`: moves across controls in DOM order
- `Enter` / `Space`: activates selected control
