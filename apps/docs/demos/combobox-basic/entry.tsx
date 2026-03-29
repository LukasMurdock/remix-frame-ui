// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Combobox, ComboboxOption } from "@lukasmurdock/remix-ui-components"
const options: ComboboxOption[] = [
  { id: "1", value: "us", label: "United States" },
  { id: "2", value: "ca", label: "Canada" },
]
export function CountryField() {
  return () => <Combobox label="Country" options={options} defaultValue="" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<CountryField />)
}
