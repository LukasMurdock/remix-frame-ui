// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Image } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <Image src="/images/dashboard-preview.png" alt="Dashboard preview" width={640} height={360} fit="cover" />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
