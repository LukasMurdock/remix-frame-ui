// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { ConfigProvider } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <ConfigProvider locale="en-US" direction="ltr" navigateMode="internal">
      <main>Settings</main>
    </ConfigProvider>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
