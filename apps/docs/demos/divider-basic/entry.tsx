// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Divider } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <Divider decorative={false} ariaLabel="Section divider" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
