// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { ToastViewport, createToastStore } from "@lukasmurdock/remix-ui-components"
const store = createToastStore([], { defaultDurationMs: 5000 })
store.show({ id: "save-1", tone: "success", content: "Changes saved" })
const items = store.items()
export function Example() {
  return () => (
    <ToastViewport
      items={items}
      onPause={(id) => store.pause(id)}
      onResume={(id) => store.resume(id)}
      onDismiss={(id, reason) => store.dismiss(id, reason)}
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
