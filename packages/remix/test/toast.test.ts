import { describe, expect, it, vi } from "vitest"
import { createToastStore } from "../src/components/Toast"

describe("toast store", () => {
  it("supports imperative show and dismiss", () => {
    const store = createToastStore()
    store.show({ id: "1", content: "Saved" })
    expect(store.items()).toHaveLength(1)
    store.dismiss("1")
    expect(store.items()).toHaveLength(0)
  })

  it("auto dismisses and supports pause resume", () => {
    vi.useFakeTimers()
    const store = createToastStore([], { defaultDurationMs: 1000 })

    store.show({ id: "1", content: "Saved" })
    vi.advanceTimersByTime(500)
    store.pause("1")
    vi.advanceTimersByTime(1000)
    expect(store.items()).toHaveLength(1)

    store.resume("1")
    vi.advanceTimersByTime(500)
    expect(store.items()).toHaveLength(0)
    vi.useRealTimers()
  })
})
