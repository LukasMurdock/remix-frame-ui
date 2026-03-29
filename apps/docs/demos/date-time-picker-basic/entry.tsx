// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { DateTimePicker } from "@lukasmurdock/remix-ui-components"
export function IncidentDateTime() {
  return () => (
    <DateTimePicker
      id="incident-at"
      name="occurredAt"
      dateName="occurredDate"
      timeName="occurredTime"
      onValueChange={(value) => console.log(value)}
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<IncidentDateTime />)
}
