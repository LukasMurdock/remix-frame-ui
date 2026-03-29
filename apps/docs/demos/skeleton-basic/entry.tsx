// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Skeleton } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <Skeleton lines={4} animated />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
