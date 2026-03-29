// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { TreeSelect } from "@lukasmurdock/remix-ui-components"
const options = [
  {
    id: "org",
    label: "Organization",
    children: [
      { id: "eng", label: "Engineering" },
      { id: "design", label: "Design" },
    ],
  },
]
export function TeamTreeSelect() {
  return () => <TreeSelect options={options} defaultExpandedIds={["org"]} onChange={(id) => console.log(id)} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<TeamTreeSelect />)
}
