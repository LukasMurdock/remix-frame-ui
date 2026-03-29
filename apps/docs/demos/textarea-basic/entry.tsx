// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Textarea } from "@lukasmurdock/remix-ui-components"
export function NotesField() {
  return () => <Textarea id="notes" name="notes" rows={6} onValueChange={(value) => console.log(value)} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<NotesField />)
}
