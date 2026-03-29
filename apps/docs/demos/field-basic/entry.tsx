// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Input, Label } from "@lukasmurdock/remix-ui-components"
export function EmailField() {
  return () => (
    <div className="rf-field">
      <Label htmlFor="email-input">Email</Label>
      <Input id="email-input" name="email" type="email" aria-describedby="email-description" />
      <p id="email-description">Use your work address</p>
    </div>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<EmailField />)
}
