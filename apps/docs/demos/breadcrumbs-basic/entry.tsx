// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Breadcrumbs } from "@lukasmurdock/remix-ui-components"
const items = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "acme", label: "Acme", current: true },
]
export function Example() {
  return () => <Breadcrumbs items={items} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
