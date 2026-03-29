// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Alert } from "@lukasmurdock/remix-ui-components"
export function StorageAlert() {
  return () => (
    <Alert tone="warning" title="Storage almost full" dismissible onDismiss={() => console.log("dismiss")}>
      Free up space to continue uploads.
    </Alert>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<StorageAlert />)
}
