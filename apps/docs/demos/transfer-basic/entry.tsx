// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Transfer, TransferItem } from "@lukasmurdock/remix-ui-components"
const items: TransferItem[] = [
  { key: "eng", label: "Engineering" },
  { key: "design", label: "Design" },
  { key: "ops", label: "Operations" },
]
export function TeamTransfer() {
  return () => <Transfer items={items} defaultTargetKeys={["eng"]} onChange={(keys) => console.log(keys)} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<TeamTransfer />)
}
