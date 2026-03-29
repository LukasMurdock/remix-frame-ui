// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { TimePicker } from "@lukasmurdock/remix-ui-components"
export function ReminderTime() {
  return () => (
    <TimePicker
      id="reminder-time"
      name="reminderTime"
      min="08:00"
      max="20:00"
      step={300}
      onValueChange={(value) => console.log("typing", value)}
      onValueCommit={(value) => console.log("commit", value)}
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<ReminderTime />)
}
