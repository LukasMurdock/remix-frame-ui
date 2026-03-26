import { describe, expect, it } from "vitest"
import { getSwitchSubmissionValue } from "../src/components/Switch"

describe("switch helpers", () => {
  it("defaults submission value to on", () => {
    expect(getSwitchSubmissionValue()).toBe("on")
  })

  it("keeps explicit submission value", () => {
    expect(getSwitchSubmissionValue("enabled")).toBe("enabled")
  })
})
