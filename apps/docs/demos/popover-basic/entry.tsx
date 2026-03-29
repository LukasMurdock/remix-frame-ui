// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Popover } from "@lukasmurdock/remix-ui-components"
export function ProfilePopover() {
  return () => (
    <Popover
      trigger="Account"
      content={
        <div>
          <a href="/profile">Profile</a>
          <a href="/billing">Billing</a>
        </div>
      }
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<ProfilePopover />)
}
