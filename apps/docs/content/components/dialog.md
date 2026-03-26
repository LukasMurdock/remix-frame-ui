# Dialog

Maturity: experimental

## HTML parity

`Dialog` provides modal behavior semantics with `role="dialog"` and `aria-modal="true"`.

## Runtime notes

Dialog is controlled-only (`open` + `onClose`). `onClose` receives reasons: `escape`, `backdrop`, `close-button`, `programmatic`.

### Controlled example

```ts
let open = false

<button on={{ click() { open = true; handle.update() } }}>Open</button>
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

### Reasoned close handling

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

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Modal semantics | `role="dialog"`, `aria-modal="true"` |
| Focus management | trapped while open |
| Escape handling | closes when enabled |

## Keymap spec

- `Escape`: close when enabled
- `Tab` / `Shift+Tab`: focus loops inside modal
