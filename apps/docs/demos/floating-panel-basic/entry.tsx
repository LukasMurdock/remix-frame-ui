// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { FloatingPanel } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <div
      className="docs-floating-panel-demo"
      style="position:relative;min-height:22rem;padding-top:11rem;overflow:hidden;border:1px solid #cbd5e1;border-radius:.75rem;background:#f8fafc;"
    >
      <style>{`.docs-floating-panel-demo .rf-floating-panel { position: absolute; left: 0; right: 0; width: 100%; margin-inline: 0; }`}</style>
      <FloatingPanel anchors={[120, 260, 420]} defaultHeight={260}>
        <h2 style="margin:0;">Nearby points</h2>
        <ul style="margin:0;padding-left:1.1rem;display:grid;gap:.4rem;">
          <li>Warehouse A - 3 min</li>
          <li>Warehouse B - 8 min</li>
          <li>Warehouse C - 12 min</li>
        </ul>
      </FloatingPanel>
    </div>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
