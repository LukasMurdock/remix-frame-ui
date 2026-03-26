import { describe, expect, it } from "vitest"
import { normalizeSliderStep } from "../src/components/Slider"

describe("slider helpers", () => {
  it("keeps positive step", () => {
    expect(normalizeSliderStep(0.5)).toBe(0.5)
    expect(normalizeSliderStep(5)).toBe(5)
  })

  it("normalizes non-positive steps", () => {
    expect(normalizeSliderStep(0)).toBe(1)
    expect(normalizeSliderStep(-2)).toBe(1)
    expect(normalizeSliderStep()).toBeUndefined()
  })
})
