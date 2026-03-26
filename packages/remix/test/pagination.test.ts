import { describe, expect, it } from "vitest"
import { buildPaginationItems, clampPage } from "../src/components/Pagination"

describe("pagination helpers", () => {
  it("clamps page bounds", () => {
    expect(clampPage(-2, 10)).toBe(1)
    expect(clampPage(99, 10)).toBe(10)
    expect(clampPage(4, 10)).toBe(4)
  })

  it("builds compact ranges with ellipsis", () => {
    expect(buildPaginationItems(10, 1)).toEqual([1, 2, "ellipsis", 10])
    expect(buildPaginationItems(10, 5)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10])
    expect(buildPaginationItems(10, 10)).toEqual([1, "ellipsis", 9, 10])
  })

  it("returns minimal pages without ellipsis", () => {
    expect(buildPaginationItems(1, 1)).toEqual([1])
    expect(buildPaginationItems(2, 1)).toEqual([1, 2])
  })
})
