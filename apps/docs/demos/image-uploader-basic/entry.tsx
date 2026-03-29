// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { ImageUploader } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <ImageUploader
      maxCount={6}
      upload={async (file) => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return {
          src: URL.createObjectURL(file),
          alt: file.name,
          fileName: file.name,
        }
      }}
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
