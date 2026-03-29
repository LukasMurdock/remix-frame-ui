// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Flex } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <Flex align="center" justify="between" gap="1rem">
      <span>Build</span>
      <span>Passing</span>
    </Flex>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
