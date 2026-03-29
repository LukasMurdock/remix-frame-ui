// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Menu } from "@lukasmurdock/remix-ui-components"
const items = [
  { id: "rename", label: "Rename" },
  { id: "duplicate", label: "Duplicate" },
  { id: "archive", label: "Archive", disabled: true },
]
export function RowActions() {
  return () => <Menu triggerLabel="Actions" items={items} onSelect={(id) => console.log(id)} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<RowActions />)
}
