import { describe, expect, it } from "vitest"
import { normalizeTimeStep, parseTimeValue } from "../src/components/TimePicker"

describe("time picker helpers", () => {
  it("parses valid time values", () => {
    expect(parseTimeValue("09:30")).toEqual({ hours: 9, minutes: 30, seconds: 0 })
    expect(parseTimeValue("23:59:45")).toEqual({ hours: 23, minutes: 59, seconds: 45 })
  })

  it("rejects invalid time values", () => {
    expect(parseTimeValue("24:00")).toBeUndefined()
    expect(parseTimeValue("12:99")).toBeUndefined()
    expect(parseTimeValue("bad")).toBeUndefined()
  })

  it("normalizes step", () => {
    expect(normalizeTimeStep()).toBeUndefined()
    expect(normalizeTimeStep(30)).toBe(30)
    expect(normalizeTimeStep(30.8)).toBe(30)
    expect(normalizeTimeStep(0)).toBe(60)
  })
})
