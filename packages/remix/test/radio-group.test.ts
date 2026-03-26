import { describe, expect, it } from "vitest"
import { resolveRadioGroupOrientation } from "../src/components/Radio"

describe("radio group helpers", () => {
  it("defaults orientation to vertical", () => {
    expect(resolveRadioGroupOrientation()).toBe("vertical")
  })

  it("keeps explicit orientation", () => {
    expect(resolveRadioGroupOrientation("horizontal")).toBe("horizontal")
  })
})
