import { describe, expect, it } from "vitest"
import {
  formatDateRangeValue,
  isDateWithinRange,
  nextDateRangeSelection,
  type DateRangeValue,
} from "../src/components/DateRangePicker"

describe("date range picker helpers", () => {
  it("starts a new range when no range exists", () => {
    expect(nextDateRangeSelection({}, "2026-03-10")).toEqual({ start: "2026-03-10" })
  })

  it("completes range and auto-orders dates", () => {
    const current: DateRangeValue = { start: "2026-03-20" }
    expect(nextDateRangeSelection(current, "2026-03-25")).toEqual({ start: "2026-03-20", end: "2026-03-25" })
    expect(nextDateRangeSelection(current, "2026-03-05")).toEqual({ start: "2026-03-05", end: "2026-03-20" })
  })

  it("checks in-range dates inclusively", () => {
    const range: DateRangeValue = { start: "2026-03-10", end: "2026-03-20" }
    expect(isDateWithinRange("2026-03-10", range)).toBe(true)
    expect(isDateWithinRange("2026-03-15", range)).toBe(true)
    expect(isDateWithinRange("2026-03-20", range)).toBe(true)
    expect(isDateWithinRange("2026-03-21", range)).toBe(false)
  })

  it("formats value for trigger input", () => {
    expect(formatDateRangeValue({})).toBe("")
    expect(formatDateRangeValue({ start: "2026-03-01" })).toBe("2026-03-01 -")
    expect(formatDateRangeValue({ start: "2026-03-01", end: "2026-03-05" })).toBe("2026-03-01 - 2026-03-05")
  })
})
