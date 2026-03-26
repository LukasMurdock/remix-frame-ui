import { describe, expect, it } from "vitest"
import { resolveDividerDecorative, resolveDividerInset, resolveDividerOrientation } from "../src/components/Divider"

describe("divider helpers", () => {
  it("resolves defaults", () => {
    expect(resolveDividerOrientation()).toBe("horizontal")
    expect(resolveDividerDecorative()).toBe(true)
    expect(resolveDividerInset()).toBe(false)
  })

  it("keeps explicit options", () => {
    expect(resolveDividerOrientation("vertical")).toBe("vertical")
    expect(resolveDividerDecorative(false)).toBe(false)
    expect(resolveDividerInset(true)).toBe(true)
  })
})
