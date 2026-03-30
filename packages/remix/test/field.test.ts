import { describe, expect, it } from "vitest"
import { resolveFieldInvalid } from "../src/components/Field"

describe("field helpers", () => {
  it("infers invalid when error is present", () => {
    expect(resolveFieldInvalid(undefined, "Required")).toBe(true)
  })

  it("preserves explicit invalid override", () => {
    expect(resolveFieldInvalid(false, "Required")).toBe(false)
    expect(resolveFieldInvalid(true, undefined)).toBe(true)
  })
})
