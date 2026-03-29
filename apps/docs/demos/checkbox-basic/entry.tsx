// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Checkbox } from "@lukasmurdock/remix-ui-components"
export function TermsCheckbox() {
  return () => (
    <Checkbox id="terms" name="terms" required>
      I agree to the terms
    </Checkbox>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<TermsCheckbox />)
}
