// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Dropdown } from "@lukasmurdock/remix-ui-components"
const items = [
  { id: "edit", label: "Edit" },
  { id: "duplicate", label: "Duplicate" },
  { id: "archive", label: "Archive", disabled: true },
]
export function RowActions() {
  return () => <Dropdown label="Actions" items={items} onSelect={(id) => console.log(id)} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<RowActions />)
}
