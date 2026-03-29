// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Space } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <Space size="sm" align="center" wrap>
      <button type="button">Approve</button>
      <button type="button">Comment</button>
      <button type="button">Reject</button>
    </Space>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
