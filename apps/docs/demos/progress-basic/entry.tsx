// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Progress } from "@lukasmurdock/remix-ui-components"
export function UploadProgress() {
  return () => <Progress label="Upload" value={72} max={100} tone="success" showValue />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<UploadProgress />)
}
