// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { SwipeAction } from "@lukasmurdock/remix-ui-components"
const startActions = [{ id: "pin", label: "Pin" }]
const endActions = [
  { id: "archive", label: "Archive" },
  { id: "delete", label: "Delete", destructive: true },
]
export function Example() {
  return () => (
    <SwipeAction startActions={startActions} endActions={endActions} onAction={(id, side) => console.log(id, side)}>
      <article style="padding:.8rem 1rem;display:grid;gap:.2rem;">
        <strong>Order #1042</strong>
        <span style="font-size:.85rem;color:#475569;">Swipe left or right for row actions.</span>
      </article>
    </SwipeAction>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
