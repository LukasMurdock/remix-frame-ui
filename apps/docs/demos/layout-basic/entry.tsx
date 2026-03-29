// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSider } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <Layout hasSider>
      <LayoutHeader>
        <strong>Workspace</strong>
        <button type="button">Toggle sidebar</button>
      </LayoutHeader>
      <Layout direction="row" hasSider>
        <LayoutSider width="16rem">Sidebar</LayoutSider>
        <LayoutContent>Main content</LayoutContent>
      </Layout>
      <LayoutFooter>Footer utilities</LayoutFooter>
    </Layout>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
