// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Button } from "@lukasmurdock/remix-ui-components"
export function ActiveCounterButton(_handle) {
  return ({ count }) => (
    <Button type="button" variant="solid" size="md">
      Clicked {count} {count === 1 ? "time" : "times"}
    </Button>
  )
}
export function mount(mount: HTMLElement) {
  const root = createRoot(mount)
  let count = 0
  const render = () => {
    root.render(<ActiveCounterButton count={count} />)
  }
  mount.addEventListener("click", (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    if (!target.closest("button")) return
    count += 1
    render()
  })
  render()
}
