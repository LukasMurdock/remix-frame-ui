import { createRoot } from "remix/component"
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
