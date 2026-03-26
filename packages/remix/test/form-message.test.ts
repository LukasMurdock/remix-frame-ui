import { describe, expect, it } from "vitest"
import { resolveFormMessageA11y } from "../src/components/FormMessage"

describe("form message helpers", () => {
  it("maps error tone to assertive alert", () => {
    expect(resolveFormMessageA11y("error")).toEqual({ role: "alert", live: "assertive" })
  })

  it("maps success and warning tones to polite status", () => {
    expect(resolveFormMessageA11y("success")).toEqual({ role: "status", live: "polite" })
    expect(resolveFormMessageA11y("warning")).toEqual({ role: "status", live: "polite" })
  })

  it("keeps help tone passive", () => {
    expect(resolveFormMessageA11y("help")).toEqual({})
  })
})
