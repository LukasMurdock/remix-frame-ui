import { describe, expect, it } from "vitest"
import { normalizeTopNavCompact, resolveTopNavActiveId } from "../src/components/TopNav"

describe("top nav helpers", () => {
  it("defaults compact to false", () => {
    expect(normalizeTopNavCompact()).toBe(false)
    expect(normalizeTopNavCompact(true)).toBe(true)
  })

  it("uses provided active id when set", () => {
    const items = [{ id: "overview", label: "Overview" }]
    expect(resolveTopNavActiveId(items, "overview")).toBe("overview")
  })

  it("falls back to first enabled item", () => {
    const items = [
      { id: "disabled", label: "Disabled", disabled: true },
      { id: "deployments", label: "Deployments" },
    ]

    expect(resolveTopNavActiveId(items)).toBe("deployments")
    expect(resolveTopNavActiveId([{ id: "x", label: "X", disabled: true }])).toBeUndefined()
  })
})
