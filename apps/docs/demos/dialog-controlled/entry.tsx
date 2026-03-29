// @ts-nocheck
import { createRoot, on } from "remix/component"
// Consumer example from component docs migration
import { Dialog } from "@lukasmurdock/remix-ui-components"

export function Example(_handle) {
  return ({ open, onOpenChange }) => (
    <>
      <button className="docs-button" type="button" mix={[on("click", () => onOpenChange(true))]}>
        Open dialog
      </button>
      <Dialog open={open} title="Delete item" onClose={() => onOpenChange(false)}>
        Are you sure?
      </Dialog>
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
