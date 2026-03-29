// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Steps } from "@lukasmurdock/remix-ui-components"
const items = [
  { id: "plan", label: "Plan" },
  { id: "build", label: "Build" },
  { id: "ship", label: "Ship" },
]
export function Example() {
  return () => <Steps items={items} currentId="build" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
