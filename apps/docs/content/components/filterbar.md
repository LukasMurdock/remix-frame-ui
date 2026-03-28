# FilterBar

Maturity: experimental

## When to use

- Groups native filter controls and actions in a semantic section.
- Is layout-only and relies on child controls for behavior.

## Import

```ts
import { FilterBar } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { FilterBar } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <FilterBar title="Filters" actions={<button type="button">Clear all</button>}>
      <input type="search" placeholder="Search services" />
    </FilterBar>
  )
}
```

## HTML parity

`FilterBar` groups native filter controls and actions in a semantic section.

## Runtime notes

`FilterBar` is layout-only and relies on child controls for behavior.

## Accessibility matrix

| Requirement      | Behavior                            |
| ---------------- | ----------------------------------- |
| Region semantics | section with `aria-label="Filters"` |
| Group clarity    | title and action grouping           |
| Control behavior | delegated to native form controls   |

## Keymap spec

- Keyboard behavior is inherited from child controls.
