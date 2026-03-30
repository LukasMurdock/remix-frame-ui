import { createRoot } from "remix/component"
import { Field, Input } from "@lukasmurdock/remix-ui-components"

export function EmailField() {
  return () => (
    <Field id="email" label="Email" description="Use your work address" error="Enter a valid email" invalid>
      {({ inputId, aria }) => (
        <Input id={inputId} name="email" type="email" required placeholder="you@company.com" {...aria} />
      )}
    </Field>
  )
}

export function mount(mount: HTMLElement) {
  createRoot(mount).render(<EmailField />)
}
