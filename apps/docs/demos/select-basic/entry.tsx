// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Select } from "@lukasmurdock/remix-ui-components"
const options = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
]
export function StatusSelect() {
  return () => <Select name="status" options={options} defaultValue="draft" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<StatusSelect />)
}
