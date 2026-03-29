// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { TopNav, TopNavItem } from "@lukasmurdock/remix-ui-components"
const items: TopNavItem[] = [
  { id: "overview", label: "Overview", href: "/overview" },
  { id: "alerts", label: "Alerts", href: "/alerts" },
  { id: "settings", label: "Settings", href: "/settings" },
]
export function Example() {
  return () => <TopNav items={items} activeId="alerts" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
