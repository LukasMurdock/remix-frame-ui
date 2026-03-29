// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { RangeSlider } from "@lukasmurdock/remix-ui-components"
export function PriceRange() {
  return () => (
    <RangeSlider
      id="price-range"
      min={0}
      max={1000}
      step={25}
      defaultValue={[100, 700]}
      nameStart="minPrice"
      nameEnd="maxPrice"
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<PriceRange />)
}
