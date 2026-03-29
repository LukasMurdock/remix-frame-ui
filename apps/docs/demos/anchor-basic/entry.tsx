// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Anchor, AnchorItem } from "@lukasmurdock/remix-ui-components"
const items: AnchorItem[] = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "api", label: "API", href: "#api" },
  { id: "faq", label: "FAQ", href: "#faq", disabled: true },
]
export function Example() {
  return () => <Anchor items={items} defaultActiveHref="#api" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
