import { describe, expect, it } from "vitest"
import {
  buildBreadcrumbOverflowEntries,
  normalizeBreadcrumbOverflowMaxVisible,
} from "../src/components/BreadcrumbOverflow"

describe("breadcrumb overflow helpers", () => {
  it("normalizes max visible to at least two", () => {
    expect(normalizeBreadcrumbOverflowMaxVisible()).toBe(4)
    expect(normalizeBreadcrumbOverflowMaxVisible(1)).toBe(2)
    expect(normalizeBreadcrumbOverflowMaxVisible(5.8)).toBe(5)
  })

  it("keeps all items when under limit", () => {
    const entries = buildBreadcrumbOverflowEntries(
      [
        { id: "home", label: "Home" },
        { id: "project", label: "Project" },
      ],
      4,
    )
    expect(entries).toHaveLength(2)
    expect(entries.every((entry) => entry.kind === "item")).toBe(true)
  })

  it("collapses middle items with ellipsis", () => {
    const entries = buildBreadcrumbOverflowEntries(
      [
        { id: "home", label: "Home" },
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
        { id: "d", label: "D" },
      ],
      4,
    )

    expect(entries[0]).toMatchObject({ kind: "item" })
    expect(entries[1]).toMatchObject({ kind: "ellipsis", hiddenCount: 1 })
    expect(entries[2]).toMatchObject({ kind: "item" })
    expect(entries[3]).toMatchObject({ kind: "item" })
    expect(entries[4]).toMatchObject({ kind: "item" })
  })
})
