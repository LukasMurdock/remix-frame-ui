// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Segmented, SegmentedOption } from "@lukasmurdock/remix-ui-components"
const options: SegmentedOption[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
]
export function Example() {
  return () => <Segmented options={options} defaultValue="week" ariaLabel="Time range" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
