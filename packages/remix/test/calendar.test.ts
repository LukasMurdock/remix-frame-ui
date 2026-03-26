import { describe, expect, it } from "vitest"
import { resolveCalendarDisabled, resolveCalendarType, resolveCalendarView } from "../src/components/Calendar"

describe("calendar helpers", () => {
  it("resolves defaults", () => {
    expect(resolveCalendarView()).toBe("month")
    expect(resolveCalendarDisabled()).toBe(false)
    expect(resolveCalendarType()).toBe("date")
  })

  it("maps year view to month input type", () => {
    expect(resolveCalendarType("year")).toBe("month")
    expect(resolveCalendarView("year")).toBe("year")
    expect(resolveCalendarDisabled(true)).toBe(true)
  })
})
