// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Splitter } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <Splitter first={<section>Editor</section>} second={<section>Preview</section>} defaultSize={60} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
