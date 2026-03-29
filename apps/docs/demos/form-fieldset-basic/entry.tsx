// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { FormFieldset } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <FormFieldset legend="Notification channels" columns={2}>
      <label>
        Email
        <input type="email" />
      </label>
      <label>
        Slack channel
        <input type="text" />
      </label>
    </FormFieldset>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
