// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Table } from "@lukasmurdock/remix-ui-components"
const columns = [
  { key: "name", header: "Name" },
  { key: "status", header: "Status" },
]
const rows = [
  { key: "1", cells: { name: "Release 1.2", status: "Running" } },
  { key: "2", cells: { name: "Release 1.3", status: "Success" } },
]
export function ReleaseTable() {
  return () => <Table caption="Recent releases" columns={columns} rows={rows} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<ReleaseTable />)
}
