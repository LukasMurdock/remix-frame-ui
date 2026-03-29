// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { AppHeader } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <AppHeader
      brand="Acme"
      title="Operations"
      subtitle="Release readiness"
      actions={<button type="button">New report</button>}
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
