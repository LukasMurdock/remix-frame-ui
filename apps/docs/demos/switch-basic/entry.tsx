// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Switch } from "@lukasmurdock/remix-ui-components"
export function NotificationsSwitch() {
  return () => (
    <Switch id="notifications" name="notifications" defaultChecked>
      Enable notifications
    </Switch>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<NotificationsSwitch />)
}
