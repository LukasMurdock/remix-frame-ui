// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { DataTable } from "@lukasmurdock/remix-ui-components"
const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "status", header: "Status", sortable: true },
]
const rows = [
  { key: "1", cells: { name: "Release 1.2", status: "Running" } },
  { key: "2", cells: { name: "Release 1.3", status: "Success" } },
]
export function ReleasesTable() {
  return () => <DataTable columns={columns} rows={rows} pageSize={10} selectable />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<ReleasesTable />)
}
