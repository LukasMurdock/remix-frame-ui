// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Statistic, StatisticTrend } from "@lukasmurdock/remix-ui-components"
const trend: StatisticTrend = "up"
export function Example() {
  return () => <Statistic label="Success rate" value="99.95" suffix="%" trend={trend} caption="Last 24h" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
