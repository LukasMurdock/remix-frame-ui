// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Tag } from "@lukasmurdock/remix-ui-components"
export function CategoryTag() {
  return () => <Tag tone="brand">Platform</Tag>
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<CategoryTag />)
}
