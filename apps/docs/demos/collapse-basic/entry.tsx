// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Collapse } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <Collapse title="Deployment checklist" open>
      Run tests, build docs, and confirm accessibility before merge.
    </Collapse>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
