// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Autocomplete } from "@lukasmurdock/remix-ui-components"
const options = [
  { id: "us", label: "United States", value: "us" },
  { id: "ca", label: "Canada", value: "ca" },
  { id: "jp", label: "Japan", value: "jp" },
]
export function Example() {
  return () => <Autocomplete label="Country" options={options} defaultValue="ca" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
