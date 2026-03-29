// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { NumberInput } from "@lukasmurdock/remix-ui-components"
export function SeatsField() {
  return () => <NumberInput id="seats" name="seats" min={1} max={200} step={1} defaultValue={25} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<SeatsField />)
}
