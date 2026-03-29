// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Tooltip } from "@lukasmurdock/remix-ui-components"
export function Hint() {
  return () => (
    <Tooltip label="Copy link">
      <span>Copy</span>
    </Tooltip>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Hint />)
}
