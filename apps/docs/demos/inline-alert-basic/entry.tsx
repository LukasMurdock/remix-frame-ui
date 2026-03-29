// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { InlineAlert } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <InlineAlert tone="success">Deployment completed successfully.</InlineAlert>
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
