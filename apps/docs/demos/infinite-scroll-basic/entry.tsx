// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { InfiniteScroll } from "@lukasmurdock/remix-ui-components"
let page = 1
const items = ["Build complete", "Deploy started", "Health checks passed"]
export function Example() {
  return () => (
    <InfiniteScroll
      threshold={120}
      loadMore={async () => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        page += 1
      }}
      hasMore={page < 4}
    >
      <h3 style="margin:0;">Release feed</h3>
      <ul style="margin:0;padding-left:1.1rem;display:grid;gap:.35rem;">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </InfiniteScroll>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
