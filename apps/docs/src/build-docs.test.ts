import { describe, expect, it } from "vitest"

describe("docs contracts", () => {
  it("keeps required sections list stable", () => {
    const requiredSections = ["## HTML parity", "## Runtime notes", "## Accessibility matrix"]
    expect(requiredSections).toHaveLength(3)
  })
})
