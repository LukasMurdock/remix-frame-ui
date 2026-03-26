import { describe, expect, it } from "vitest"
import {
  addDays,
  addMonths,
  buildCalendarCells,
  formatISODate,
  monthStart,
  parseISODate,
} from "../src/components/DatePicker"

describe("date picker helpers", () => {
  it("parses and formats ISO dates", () => {
    const date = parseISODate("2026-03-25")
    expect(date).toBeInstanceOf(Date)
    expect(date ? formatISODate(date) : "").toBe("2026-03-25")
    expect(parseISODate("2026-02-31")).toBeUndefined()
    expect(parseISODate("bad")).toBeUndefined()
  })

  it("builds 6x7 calendar cells", () => {
    const cells = buildCalendarCells(new Date(2026, 2, 1))
    expect(cells).toHaveLength(42)
    expect(cells.some((cell) => cell.iso === "2026-03-01")).toBe(true)
    expect(cells.some((cell) => cell.iso === "2026-03-31")).toBe(true)
  })

  it("supports date arithmetic helpers", () => {
    const base = new Date(2026, 2, 25)
    expect(formatISODate(monthStart(base))).toBe("2026-03-01")
    expect(formatISODate(addDays(base, 7))).toBe("2026-04-01")
    expect(formatISODate(addMonths(base, 1))).toBe("2026-04-25")
    expect(formatISODate(addMonths(new Date(2026, 0, 31), 1))).toBe("2026-02-28")
  })

  it("marks out-of-range days disabled", () => {
    const cells = buildCalendarCells(new Date(2026, 2, 1), "2026-03-10", "2026-03-20")
    const before = cells.find((cell) => cell.iso === "2026-03-09")
    const inside = cells.find((cell) => cell.iso === "2026-03-15")
    const after = cells.find((cell) => cell.iso === "2026-03-21")
    expect(before?.disabled).toBe(true)
    expect(inside?.disabled).toBe(false)
    expect(after?.disabled).toBe(true)
  })
})
