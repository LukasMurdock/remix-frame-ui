# Tooltip

Maturity: experimental

## When to use

- Provide short contextual hints for icons, compact actions, or dense controls
- Explain intent without taking additional layout space

## Import

```ts
import { Tooltip } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Tooltip } from "@lukasmurdock/remix-ui-components"

export function Hint() {
  return (
    <Tooltip label="Copy link">
      <span>Copy</span>
    </Tooltip>
  )
}
```

## HTML parity

`Tooltip` provides contextual text tied to a focusable trigger and `role="tooltip"` content.

## Runtime notes

Tooltip visibility is controlled by pointer and focus interactions.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Association | trigger uses `aria-describedby` when open |
| Semantics | floating content uses `role="tooltip"` |
| Inputs | pointer and keyboard focus both supported |

## Keymap spec

- `Tab`: focus trigger reveals tooltip
- `Shift+Tab`: leaving trigger hides tooltip
