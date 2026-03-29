// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { AppProvider } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <AppProvider locale="en-US" colorScheme="light">
      <main>Dashboard content</main>
    </AppProvider>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
