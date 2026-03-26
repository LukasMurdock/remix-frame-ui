import { describe, expect, it } from "vitest"
import { normalizeNumberInputStep } from "../src/components/NumberInput"

describe("number input helpers", () => {
  it("keeps positive step", () => {
    expect(normalizeNumberInputStep(0.5)).toBe(0.5)
    expect(normalizeNumberInputStep(2)).toBe(2)
  })

  it("normalizes non-positive steps", () => {
    expect(normalizeNumberInputStep(0)).toBe(1)
    expect(normalizeNumberInputStep(-3)).toBe(1)
    expect(normalizeNumberInputStep()).toBeUndefined()
  })
})
