// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Typography } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <Typography as="p" truncate>
      Very long status message that should truncate in narrow layouts.
    </Typography>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
