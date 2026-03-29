// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { AppShell } from "@lukasmurdock/remix-ui-components"
export function DocsShell() {
  return () => (
    <AppShell header={<div>Header</div>} sidebar={<nav>Sidebar nav</nav>} sidebarPosition="left" sidebarWidth="18rem">
      <article>Main content</article>
    </AppShell>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<DocsShell />)
}
