import { describe, expect, it } from "vitest"
import { resolveBreadcrumbCurrentIndex, resolveBreadcrumbSeparator } from "../src/components/Breadcrumbs"

describe("breadcrumbs helpers", () => {
  it("uses explicit current item when present", () => {
    expect(
      resolveBreadcrumbCurrentIndex([
        { id: "1", label: "Home" },
        { id: "2", label: "Projects", current: true },
        { id: "3", label: "Roadmap" },
      ]),
    ).toBe(1)
  })

  it("falls back to last item when no current item provided", () => {
    expect(
      resolveBreadcrumbCurrentIndex([
        { id: "1", label: "Home" },
        { id: "2", label: "Projects" },
      ]),
    ).toBe(1)
    expect(resolveBreadcrumbCurrentIndex([])).toBe(-1)
  })

  it("defaults separator to slash", () => {
    expect(resolveBreadcrumbSeparator()).toBe("/")
    expect(resolveBreadcrumbSeparator(">")).toBe(">")
  })
})
