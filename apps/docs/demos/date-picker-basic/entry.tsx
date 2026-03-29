// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { DatePicker } from "@lukasmurdock/remix-ui-components"
export function ScheduleDate() {
  return () => (
    <DatePicker
      id="release-date"
      name="releaseDate"
      min="2026-01-01"
      max="2026-12-31"
      onValueChange={(value) => console.log(value)}
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<ScheduleDate />)
}
