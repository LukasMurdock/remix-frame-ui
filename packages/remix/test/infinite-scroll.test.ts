import { describe, expect, it } from "vitest"
import {
  resolveInfiniteScrollHasMore,
  resolveInfiniteScrollLoading,
  resolveInfiniteScrollState,
  resolveInfiniteScrollThreshold,
  shouldInfiniteScrollLoadMore,
} from "../src/components/InfiniteScroll"

describe("infinite scroll helpers", () => {
  it("resolves defaults", () => {
    expect(resolveInfiniteScrollThreshold()).toBe(120)
    expect(resolveInfiniteScrollThreshold(12)).toBe(24)
    expect(resolveInfiniteScrollThreshold(180)).toBe(180)
    expect(resolveInfiniteScrollHasMore()).toBe(true)
    expect(resolveInfiniteScrollHasMore(false)).toBe(false)
    expect(resolveInfiniteScrollLoading(undefined, false)).toBe(false)
    expect(resolveInfiniteScrollLoading(undefined, true)).toBe(true)
    expect(resolveInfiniteScrollLoading(false, true)).toBe(false)
  })

  it("resolves visual state labels", () => {
    expect(resolveInfiniteScrollState(true, true)).toBe("loading")
    expect(resolveInfiniteScrollState(false, true)).toBe("idle")
    expect(resolveInfiniteScrollState(false, false)).toBe("complete")
  })

  it("detects when viewport is within load threshold", () => {
    expect(shouldInfiniteScrollLoadMore(0, 200, 1000, 120)).toBe(false)
    expect(shouldInfiniteScrollLoadMore(680, 200, 1000, 120)).toBe(true)
    expect(shouldInfiniteScrollLoadMore(810, 200, 1000, 120)).toBe(true)
    expect(shouldInfiniteScrollLoadMore(0, 600, 500, 120)).toBe(true)
  })
})
