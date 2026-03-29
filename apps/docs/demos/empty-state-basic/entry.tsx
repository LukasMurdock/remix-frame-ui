// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { EmptyState } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <EmptyState title="Create your first project" description="Projects group dashboards, alerts, and ownership." />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
