// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Slider } from "@lukasmurdock/remix-ui-components"
export function VolumeSlider() {
  return () => <Slider id="volume" name="volume" min={0} max={100} step={5} defaultValue={60} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<VolumeSlider />)
}
