// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Descriptions, DescriptionsItem } from "@lukasmurdock/remix-ui-components"
const items: DescriptionsItem[] = [
  { key: "repo", label: "Repository", content: "remix-frame-ui" },
  { key: "owner", label: "Owner", content: "Platform" },
  { key: "status", label: "Status", content: "Healthy" },
]
export function Example() {
  return () => <Descriptions title="Service details" items={items} columns={3} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
