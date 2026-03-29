// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { EmptyResults } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <EmptyResults
      description="Try removing one or more filters."
      clearAction={<button type="button">Clear filters</button>}
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
