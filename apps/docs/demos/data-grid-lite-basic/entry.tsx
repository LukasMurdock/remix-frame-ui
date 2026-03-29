// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { DataGridLite, DataGridSort } from "@lukasmurdock/remix-ui-components"
const columns = [
  { key: "service", header: "Service", sortable: true },
  { key: "latency", header: "Latency", align: "right", sortable: true },
]
const rows = [
  { key: "api", cells: { service: "API", latency: "121ms" }, sortValues: { latency: 121 } },
  { key: "worker", cells: { service: "Worker", latency: "410ms" }, sortValues: { latency: 410 } },
]
const defaultSort: DataGridSort = { columnKey: "latency", direction: "asc" }
export function Example() {
  return () => <DataGridLite columns={columns} rows={rows} defaultSort={defaultSort} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
