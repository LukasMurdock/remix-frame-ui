// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Calendar } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <Calendar view="month" defaultValue="2026-04-18" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
