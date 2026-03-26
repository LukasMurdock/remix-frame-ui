import { describe, expect, it } from "vitest"
import {
  resolveLayoutDirection,
  resolveLayoutHasSider,
  resolveLayoutSiderCollapsed,
  resolveLayoutSiderWidth,
} from "../src/components/Layout"

describe("layout helpers", () => {
  it("resolves defaults", () => {
    expect(resolveLayoutDirection()).toBe("column")
    expect(resolveLayoutHasSider()).toBe(false)
    expect(resolveLayoutSiderWidth()).toBe("16rem")
    expect(resolveLayoutSiderCollapsed()).toBe(false)
  })

  it("keeps explicit values", () => {
    expect(resolveLayoutDirection("row")).toBe("row")
    expect(resolveLayoutHasSider(true)).toBe(true)
    expect(resolveLayoutSiderWidth("20rem")).toBe("20rem")
    expect(resolveLayoutSiderCollapsed(true)).toBe(true)
  })
})
