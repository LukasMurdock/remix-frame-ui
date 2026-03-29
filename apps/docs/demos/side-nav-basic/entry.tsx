// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { SideNav, SideNavItem, SideNavSection } from "@lukasmurdock/remix-ui-components"
const primaryItems: SideNavItem[] = [
  { id: "overview", label: "Overview", href: "/overview" },
  { id: "deployments", label: "Deployments", href: "/deployments" },
]
const sections: SideNavSection[] = [
  {
    id: "primary",
    label: "Primary",
    items: primaryItems,
  },
]
export function Example() {
  return () => <SideNav sections={sections} activeId="deployments" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
