// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { TabBar, TabBarItem } from "@lukasmurdock/remix-ui-components"
const items: TabBarItem[] = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "search", label: "Search", icon: "🔎" },
  { id: "alerts", label: "Alerts", icon: "🔔", badge: "3" },
  { id: "profile", label: "Profile", icon: "👤" },
]
export function Example() {
  return () => <TabBar items={items} defaultValue="home" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
