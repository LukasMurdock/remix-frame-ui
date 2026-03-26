import { describe, expect, it } from "vitest"
import { resolveGridAlign, resolveGridColumns, resolveGridGap, resolveGridItemSpan } from "../src/components/Grid"

describe("grid helpers", () => {
  it("resolves defaults", () => {
    expect(resolveGridColumns()).toBe(2)
    expect(resolveGridGap()).toBe("0.75rem")
    expect(resolveGridAlign()).toBe("stretch")
    expect(resolveGridItemSpan()).toBe(1)
  })

  it("keeps explicit values", () => {
    expect(resolveGridColumns(12)).toBe(12)
    expect(resolveGridGap("2rem")).toBe("2rem")
    expect(resolveGridAlign("center")).toBe("center")
    expect(resolveGridItemSpan(6)).toBe(6)
  })
})
