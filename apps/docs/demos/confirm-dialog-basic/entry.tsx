// @ts-nocheck
import { createRoot, on } from "remix/component"
// Consumer example from component docs migration
import { ConfirmDialog } from "@lukasmurdock/remix-ui-components"

export function Example(_handle) {
  return ({ open, onOpenChange }) => (
    <>
      <button className="docs-button" type="button" mix={[on("click", () => onOpenChange(true))]}>
        Open confirm dialog
      </button>
      <ConfirmDialog
        open={open}
        title="Delete record?"
        description="This action cannot be undone."
        onClose={() => onOpenChange(false)}
        onConfirm={() => onOpenChange(false)}
      />
    </>
  )
}

export function mount(mountEl: HTMLElement) {
  const root = createRoot(mountEl)
  let open = false
  let renderQueued = false

  function render() {
    root.render(
      <Example
        key={open ? "open" : "closed"}
        open={open}
        onOpenChange={(nextOpen) => {
          if (open === nextOpen) return
          open = nextOpen
          if (renderQueued) return
          renderQueued = true
          queueMicrotask(() => {
            renderQueued = false
            render()
          })
        }}
      />,
    )
  }

  render()
}
