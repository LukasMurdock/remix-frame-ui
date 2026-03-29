// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Input } from "@lukasmurdock/remix-ui-components"
export function EmailField() {
  return () => <Input id="email" name="email" type="email" required placeholder="you@company.com" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<EmailField />)
}
