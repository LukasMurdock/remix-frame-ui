// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Card } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <Card title="Release status" subtitle="Updated 2 minutes ago" footer="Last deployed by CI">
      All quality gates passed.
    </Card>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
