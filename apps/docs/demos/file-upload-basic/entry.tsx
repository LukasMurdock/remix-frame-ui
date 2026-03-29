// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { FileUpload } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <FileUpload name="attachments" accept={[".png", ".jpg", ".pdf"]} multiple />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
