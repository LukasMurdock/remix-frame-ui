// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Chip } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <Chip tone="brand">Needs review</Chip>
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
