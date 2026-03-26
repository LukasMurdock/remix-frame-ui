import { describe, expect, it } from "vitest"
import { normalizeFormFieldsetColumns } from "../src/components/FormFieldset"

describe("form fieldset helpers", () => {
  it("defaults columns to 1", () => {
    expect(normalizeFormFieldsetColumns()).toBe(1)
  })

  it("uses provided column count", () => {
    expect(normalizeFormFieldsetColumns(2)).toBe(2)
  })
})
