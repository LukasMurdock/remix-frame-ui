// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { PageHeader } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <PageHeader
      title="Deployments"
      subtitle="Track release progress"
      actions={<button type="button">Create deployment</button>}
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
