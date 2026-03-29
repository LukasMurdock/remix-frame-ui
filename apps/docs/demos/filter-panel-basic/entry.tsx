// @ts-nocheck
import { createRoot, on } from "remix/component"
// Consumer example from component docs migration
import { FilterPanel } from "@lukasmurdock/remix-ui-components"
type ExampleProps = {
  open: boolean
  onOpenChange: (nextOpen: boolean) => void
}

export function Example(_handle) {
  return ({ open, onOpenChange }: ExampleProps) => (
    <>
      <button className="docs-button" type="button" mix={[on("click", () => onOpenChange(true))]}>
        Open filter panel
      </button>
      <FilterPanel
        open={open}
        title="Filters"
        description="Refine results"
        onApply={() => {
          console.log("apply")
          onOpenChange(false)
        }}
        onClear={() => {
          console.log("clear")
        }}
        onClose={() => {
          onOpenChange(false)
        }}
      >
        Filter controls
      </FilterPanel>
    </>
  )
}

export function mount(mountEl: HTMLElement) {
  let open = false
  const root = createRoot(mountEl)
  let renderQueued = false

  const render = () => {
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
