import { describe, expect, it } from "vitest"
import {
  joinDateTimeLocal,
  normalizeDateTimeLocal,
  splitDateTimeLocal,
} from "../src/components/DateTimePicker"

describe("date time picker helpers", () => {
  it("splits and joins local datetime strings", () => {
    expect(splitDateTimeLocal("2026-03-25T09:30")).toEqual({ date: "2026-03-25", time: "09:30" })
    expect(joinDateTimeLocal("2026-03-25", "09:30")).toBe("2026-03-25T09:30")
  })

  it("normalizes valid values and rejects invalid values", () => {
    expect(normalizeDateTimeLocal("2026-03-25T09:30")).toBe("2026-03-25T09:30")
    expect(normalizeDateTimeLocal("2026-02-30T09:30")).toBeUndefined()
    expect(normalizeDateTimeLocal("2026-03-25 09:30")).toBeUndefined()
  })

  it("requires both date and time for joins", () => {
    expect(joinDateTimeLocal("2026-03-25", undefined)).toBeUndefined()
    expect(joinDateTimeLocal(undefined, "09:30")).toBeUndefined()
  })
})
