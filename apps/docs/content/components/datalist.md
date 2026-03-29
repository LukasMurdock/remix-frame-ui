# DataList

Maturity: experimental

## When to use

- Renders a semantic list with title, description, metadata, and actions.
- Is presentational and does not require hydration unless child actions are interactive.

## Import

```ts
import { DataList } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { DataList, DataListItem } from "@lukasmurdock/remix-ui-components"

const items: DataListItem[] = [
  { id: "1", title: "Build docs", description: "Regenerate static docs output", meta: "Today" },
  { id: "2", title: "Run tests", description: "Validate docs and component suites", meta: "In progress" },
]

export function Example() {
  return <DataList items={items} />
}
```

## HTML parity

`DataList` renders a semantic list with title, description, metadata, and actions.

## Runtime notes

`DataList` is presentational and does not require hydration unless child actions are interactive.

## Accessibility matrix

| Requirement    | Behavior                       |
| -------------- | ------------------------------ |
| List semantics | native `ul`/`li` structure     |
| Empty handling | dedicated empty-state fallback |
| Action support | optional per-row action region |

## Keymap spec

- Keyboard behavior is inherited from focusable child controls.
