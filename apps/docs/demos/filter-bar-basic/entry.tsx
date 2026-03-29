// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { FilterBar } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <FilterBar title="Filters" actions={<button type="button">Clear all</button>}>
      <input type="search" placeholder="Search services" />
    </FilterBar>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
