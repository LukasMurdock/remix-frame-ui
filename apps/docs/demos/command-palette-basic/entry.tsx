// @ts-nocheck
import { createRoot, on } from "remix/component"
// Consumer example from component docs migration
import { CommandItem, CommandPalette } from "@lukasmurdock/remix-ui-components"
const commands: CommandItem[] = [
  { id: "search", label: "Open search", keywords: ["find"] },
  { id: "settings", label: "Open settings" },
]
type ExampleProps = {
  open: boolean
  onOpenChange: (nextOpen: boolean) => void
}

export function Example(_handle) {
  return ({ open, onOpenChange }: ExampleProps) => (
    <>
      <button className="docs-button" type="button" mix={[on("click", () => onOpenChange(true))]}>
        Open command palette
      </button>
      <CommandPalette
        open={open}
        commands={commands}
        onClose={() => {
          onOpenChange(false)
        }}
        onSelect={(id) => {
          console.log(id)
          onOpenChange(false)
        }}
      />
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
