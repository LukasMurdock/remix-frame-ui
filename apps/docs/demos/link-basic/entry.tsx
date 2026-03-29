// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Link } from "@lukasmurdock/remix-ui-components"
export function NavigationLink() {
  return () => (
    <Link href="/settings" onNavigate={({ href }) => console.log("navigate", href)}>
      Open settings
    </Link>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<NavigationLink />)
}
