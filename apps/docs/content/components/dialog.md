# Dialog

Maturity: experimental

## When to use

- Confirm or complete a focused task without leaving the current page
- Interrupt flow only for high-priority or destructive actions

## Import

```ts
import { Dialog } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

### Controlled open state

```ts
import { on } from "remix/component"

let open = false

<button
  mix={[
    on("click", () => {
      open = true
      handle.update()
    }),
  ]}
>
  Open
</button>
<Dialog
  open={open}
  title="Delete item"
  onClose={() => {
    open = false
    handle.update()
  }}
>
  Are you sure?
</Dialog>
```

### Reason-aware close handling

```ts
<Dialog
  open={open}
  title="Settings"
  onClose={(reason) => {
    if (reason === "backdrop") return
    open = false
    handle.update()
  }}
/>
```

## HTML parity

`Dialog` provides modal behavior semantics with `role="dialog"` and `aria-modal="true"`.

## Runtime notes

Dialog is controlled-only (`open` + `onClose`). `onClose` receives reasons: `escape`, `backdrop`, `close-button`, `programmatic`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Modal semantics | `role="dialog"`, `aria-modal="true"` |
| Focus management | trapped while open |
| Escape handling | closes when enabled |

## Keymap spec

- `Escape`: close when enabled
- `Tab` / `Shift+Tab`: focus loops inside modal
