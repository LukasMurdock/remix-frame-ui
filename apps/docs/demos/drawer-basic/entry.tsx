// @ts-nocheck
import { createRoot, on } from "remix/component"
// Consumer example from component docs migration
import { Drawer } from "@lukasmurdock/remix-ui-components"

export function Example(_handle) {
  return ({ open, onOpenChange }) => (
    <>
      <button className="docs-button" type="button" mix={[on("click", () => onOpenChange(true))]}>
        Open drawer
      </button>
      <Drawer open={open} title="Project settings" position="right" onClose={() => onOpenChange(false)}>
        Settings content
      </Drawer>
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
