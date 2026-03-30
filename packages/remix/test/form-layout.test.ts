import { describe, expect, it } from "vitest"
import { normalizeFormLayoutActionsAlign, normalizeFormLayoutColumns } from "../src/components/FormLayout"

describe("form layout helpers", () => {
  it("defaults columns to 1", () => {
    expect(normalizeFormLayoutColumns()).toBe(1)
  })

  it("uses provided column count", () => {
    expect(normalizeFormLayoutColumns(2)).toBe(2)
    expect(normalizeFormLayoutColumns(3)).toBe(3)
  })

  it("defaults actions alignment to start", () => {
    expect(normalizeFormLayoutActionsAlign()).toBe("start")
    expect(normalizeFormLayoutActionsAlign("end")).toBe("end")
  })
})
