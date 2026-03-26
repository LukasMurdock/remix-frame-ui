import { describe, expect, it } from "vitest"
import { resolveCollapseOpen } from "../src/components/Collapse"

describe("collapse helpers", () => {
  it("defaults open to false", () => {
    expect(resolveCollapseOpen()).toBe(false)
  })

  it("keeps explicit open value", () => {
    expect(resolveCollapseOpen(true)).toBe(true)
  })
})
