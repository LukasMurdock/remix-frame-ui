// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { PullToRefresh } from "@lukasmurdock/remix-ui-components"
const rows = ["Order #1024", "Order #1023", "Order #1022"]
export function Example() {
  return () => (
    <PullToRefresh
      threshold={72}
      onRefresh={async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }}
    >
      <h2 style="margin:0;">Latest orders</h2>
      <ul style="margin:0;padding-left:1.1rem;display:grid;gap:.35rem;">
        {rows.map((row) => (
          <li key={row}>{row}</li>
        ))}
      </ul>
    </PullToRefresh>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
