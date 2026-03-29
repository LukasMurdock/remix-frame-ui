// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Badge } from "@lukasmurdock/remix-ui-components"
export function StatusBadge() {
  return () => <Badge tone="success">Healthy</Badge>
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<StatusBadge />)
}
