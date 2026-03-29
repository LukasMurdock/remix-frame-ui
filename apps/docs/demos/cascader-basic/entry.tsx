// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Cascader, CascaderOption } from "@lukasmurdock/remix-ui-components"
const options: CascaderOption[] = [
  {
    value: "americas",
    label: "Americas",
    children: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
    ],
  },
  {
    value: "europe",
    label: "Europe",
    children: [
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
    ],
  },
]
export function Example() {
  return () => <Cascader options={options} placeholder="Select market" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
