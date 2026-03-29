// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Timeline, TimelineItem } from "@lukasmurdock/remix-ui-components"
const items: TimelineItem[] = [
  { key: "build", title: "Build started", time: "10:02" },
  { key: "tests", title: "Tests passed", time: "10:05", tone: "success" },
]
export function Example() {
  return () => <Timeline items={items} pending="Deploying to production" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
