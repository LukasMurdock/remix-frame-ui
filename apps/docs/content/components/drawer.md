# Drawer

Maturity: experimental
Platform: universal

## When to use

- Present side-panel workflows without navigating away from the current context
- Handle dense filtering or editing tasks that need more space than popovers

## Import

```ts
import { Drawer } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```ts
import { Drawer } from "@lukasmurdock/remix-ui-components"

let open = false

<Drawer
  open={open}
  title="Project settings"
  position="right"
  onClose={(reason) => {
    if (reason === "backdrop") return
    open = false
    handle.update()
  }}
>
  Settings content
</Drawer>
```

## HTML parity

`Drawer` is a modal side panel for app-shell tasks and secondary workflows.

## Runtime notes

Controlled-only API (`open` + `onClose`) with focus trap and escape/backdrop dismissal.

## Accessibility matrix

| Requirement      | Behavior                                                        |
| ---------------- | --------------------------------------------------------------- |
| Modal semantics  | uses `role="dialog"` with `aria-modal="true"`                   |
| Focus safety     | traps tab focus while open and restores previous focus on close |
| Dismiss controls | supports escape key, backdrop click, and close button reasons   |

## Keymap spec

- `Escape`: close when enabled
- `Tab` / `Shift+Tab`: cycle focus within drawer
