// @ts-nocheck
import { createRoot, on } from "remix/component"
// Consumer example from component docs migration
import { ActionSheet } from "@lukasmurdock/remix-ui-components"

const actions = [
  { id: "share", label: "Share" },
  { id: "duplicate", label: "Duplicate" },
  { id: "delete", label: "Delete", destructive: true },
]

export function Example(handle) {
  let open = false
  const setOpen = (nextOpen) => {
    if (open === nextOpen) return
    open = nextOpen
    handle.update()
  }

  return () => (
    <>
      <button className="docs-button" type="button" mix={[on("click", () => setOpen(true))]}>
        Open action sheet
      </button>
      {open ? (
        <ActionSheet
          open
          title="Project actions"
          description="Choose what to do with this project"
          actions={actions}
          onAction={(id) => {
            console.log(id)
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}

export function mount(mountEl: HTMLElement) {
  createRoot(mountEl).render(<Example />)
}
