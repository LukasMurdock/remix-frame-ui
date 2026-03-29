// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Empty } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => <Empty title="No deployments yet" description="Run your first pipeline to see activity." />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
