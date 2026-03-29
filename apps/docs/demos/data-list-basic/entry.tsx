// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { DataList, DataListItem } from "@lukasmurdock/remix-ui-components"
const items: DataListItem[] = [
  { id: "1", title: "Build docs", description: "Regenerate static docs output", meta: "Today" },
  { id: "2", title: "Run tests", description: "Validate docs and component suites", meta: "In progress" },
]
export function Example() {
  return () => <DataList items={items} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
