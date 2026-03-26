import { describe, expect, it } from "vitest"
import { resolveTimelinePending, resolveTimelineTone } from "../src/components/Timeline"

describe("timeline helpers", () => {
  it("resolves tone defaults", () => {
    expect(resolveTimelineTone()).toBe("neutral")
    expect(resolveTimelineTone("success")).toBe("success")
  })

  it("resolves pending label", () => {
    expect(resolveTimelinePending()).toBe("Pending")
    expect(resolveTimelinePending("Waiting for approval")).toBe("Waiting for approval")
  })
})
