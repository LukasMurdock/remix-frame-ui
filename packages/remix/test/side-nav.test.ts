import { describe, expect, it } from "vitest"
import { normalizeSideNavCompact, resolveSideNavActiveId } from "../src/components/SideNav"

describe("side nav helpers", () => {
  it("defaults compact to false", () => {
    expect(normalizeSideNavCompact()).toBe(false)
    expect(normalizeSideNavCompact(true)).toBe(true)
  })

  it("uses provided active id when set", () => {
    const sections = [{ label: "General", items: [{ id: "overview", label: "Overview" }] }]
    expect(resolveSideNavActiveId(sections, "overview")).toBe("overview")
  })

  it("falls back to first enabled item", () => {
    const sections = [
      {
        label: "General",
        items: [
          { id: "disabled", label: "Disabled", disabled: true },
          { id: "projects", label: "Projects" },
        ],
      },
    ]

    expect(resolveSideNavActiveId(sections)).toBe("projects")
    expect(resolveSideNavActiveId([{ items: [{ id: "x", label: "X", disabled: true }] }])).toBeUndefined()
  })
})
