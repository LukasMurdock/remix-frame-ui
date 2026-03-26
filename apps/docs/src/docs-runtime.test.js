import { describe, expect, it } from "vitest"
import { buildDatePickerMonthCells, parseDatePickerISODate } from "./docs-runtime.js"

describe("docs date picker runtime helpers", () => {
  it("builds a full 6x7 calendar grid", () => {
    const viewMonth = new Date(2026, 2, 1)
    const cells = buildDatePickerMonthCells(viewMonth)
    expect(cells).toHaveLength(42)
    expect(cells.some((cell) => cell.iso === "2026-03-01")).toBe(true)
    expect(cells.some((cell) => cell.iso === "2026-03-31")).toBe(true)
  })

  it("parses valid ISO dates and rejects invalid dates", () => {
    expect(parseDatePickerISODate("2026-03-25")).toBeInstanceOf(Date)
    expect(parseDatePickerISODate("2026-02-31")).toBeUndefined()
    expect(parseDatePickerISODate("bad-value")).toBeUndefined()
  })
})
