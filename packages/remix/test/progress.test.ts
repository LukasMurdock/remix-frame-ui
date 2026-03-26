import { describe, expect, it } from "vitest"
import { clampProgressValue, normalizeProgressMax, resolveProgressTone } from "../src/components/Progress"

describe("progress helpers", () => {
  it("normalizes max to positive values", () => {
    expect(normalizeProgressMax()).toBe(100)
    expect(normalizeProgressMax(200)).toBe(200)
    expect(normalizeProgressMax(0)).toBe(100)
  })

  it("clamps value within 0 and max", () => {
    expect(clampProgressValue(undefined, 100)).toBe(0)
    expect(clampProgressValue(-5, 100)).toBe(0)
    expect(clampProgressValue(42, 100)).toBe(42)
    expect(clampProgressValue(160, 100)).toBe(100)
  })

  it("defaults tone to neutral", () => {
    expect(resolveProgressTone()).toBe("neutral")
    expect(resolveProgressTone("danger")).toBe("danger")
  })
})
