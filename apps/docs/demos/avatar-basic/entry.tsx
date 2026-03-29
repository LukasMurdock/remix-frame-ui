// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Avatar } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <Avatar name="Ada Lovelace" status="online" size="lg" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
