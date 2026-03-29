// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { FormMessage } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <FormMessage tone="error">Email is required.</FormMessage>
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
