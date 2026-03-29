// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { BreadcrumbOverflow } from "@lukasmurdock/remix-ui-components"
const items = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "acme", label: "Acme", href: "/projects/acme" },
  { id: "settings", label: "Settings", href: "/projects/acme/settings" },
  { id: "notifications", label: "Notifications", current: true },
]
export function Example() {
  return () => <BreadcrumbOverflow items={items} maxVisible={3} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
