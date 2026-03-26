import { describe, expect, it } from "vitest"
import { normalizeRangeSliderBounds, normalizeRangeSliderValue } from "../src/components/RangeSlider"

describe("range slider helpers", () => {
  it("normalizes invalid bounds order", () => {
    expect(normalizeRangeSliderBounds()).toEqual({ min: 0, max: 100 })
    expect(normalizeRangeSliderBounds(20, 10)).toEqual({ min: 10, max: 20 })
  })

  it("clamps and orders values", () => {
    expect(normalizeRangeSliderValue(undefined, 0, 100)).toEqual([0, 100])
    expect(normalizeRangeSliderValue([10, 40], 0, 100)).toEqual([10, 40])
    expect(normalizeRangeSliderValue([80, 20], 0, 100)).toEqual([20, 80])
    expect(normalizeRangeSliderValue([-5, 180], 0, 100)).toEqual([0, 100])
  })
})
