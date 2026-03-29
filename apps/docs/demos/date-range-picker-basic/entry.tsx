// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { DateRangePicker } from "@lukasmurdock/remix-ui-components"
export function ReportingRange() {
  return () => (
    <DateRangePicker
      id="report-range"
      startName="startDate"
      endName="endDate"
      min="2026-01-01"
      max="2026-12-31"
      onValueChange={(value) => console.log(value)}
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<ReportingRange />)
}
