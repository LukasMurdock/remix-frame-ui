# Transfer

Maturity: experimental

## When to use

- Move multiple selected items between available and selected sets
- Manage assign/unassign workflows with explicit dual-list controls

## Import

```ts
import { Transfer } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Transfer } from "@lukasmurdock/remix-ui-components"

const items = [
  { key: "eng", label: "Engineering" },
  { key: "design", label: "Design" },
  { key: "ops", label: "Operations" },
]

export function TeamTransfer() {
  return <Transfer items={items} defaultTargetKeys={["eng"]} onChange={(keys) => console.log(keys)} />
}
```

## HTML parity

`Transfer` moves selected items between available and chosen lists.

## Runtime notes

Supports controlled and uncontrolled target/selection state, disabled items, and list-level empty state.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Selection semantics | each row uses a native checkbox |
| Movement controls | explicit left/right move buttons |
| Disabled items | disabled rows are non-interactive |

## Keymap spec

- `Tab`: move through row checkboxes and transfer buttons
- `Space`: toggle focused checkbox
- `Enter`: activate move buttons
