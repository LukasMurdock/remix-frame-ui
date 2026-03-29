// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Spinner } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <Spinner label="Loading deployment status" size="md" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
