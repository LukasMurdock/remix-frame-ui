// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Pagination } from "@lukasmurdock/remix-ui-components"
export function ResultsPager() {
  return () => <Pagination page={3} totalPages={12} siblingCount={1} onPageChange={(page) => console.log(page)} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<ResultsPager />)
}
