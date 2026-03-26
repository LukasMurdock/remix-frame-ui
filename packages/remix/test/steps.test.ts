import { describe, expect, it } from "vitest"
import { resolveStepStatus, resolveStepsCurrentIndex } from "../src/components/Steps"

describe("steps helpers", () => {
  it("resolves current index from currentId", () => {
    const items = [
      { id: "account", label: "Account" },
      { id: "profile", label: "Profile" },
      { id: "confirm", label: "Confirm" },
    ]

    expect(resolveStepsCurrentIndex(items, "profile")).toBe(1)
    expect(resolveStepsCurrentIndex(items, "missing")).toBe(0)
    expect(resolveStepsCurrentIndex(items)).toBe(0)
    expect(resolveStepsCurrentIndex([], "profile")).toBe(-1)
  })

  it("resolves step status by index", () => {
    expect(resolveStepStatus(0, 1)).toBe("complete")
    expect(resolveStepStatus(1, 1)).toBe("current")
    expect(resolveStepStatus(2, 1)).toBe("upcoming")
  })
})
