// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { FormLayout } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <FormLayout title="Profile" description="Update account details" actions={<button type="submit">Save</button>}>
      <label>
        Name
        <input type="text" defaultValue="Ada" />
      </label>
    </FormLayout>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
