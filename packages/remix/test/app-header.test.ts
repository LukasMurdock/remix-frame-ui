import { describe, expect, it } from "vitest"
import { resolveAppHeaderDensity, resolveAppHeaderSticky } from "../src/components/AppHeader"

describe("app header helpers", () => {
  it("defaults density to comfortable", () => {
    expect(resolveAppHeaderDensity()).toBe("comfortable")
    expect(resolveAppHeaderDensity("compact")).toBe("compact")
  })

  it("defaults sticky to false", () => {
    expect(resolveAppHeaderSticky()).toBe(false)
    expect(resolveAppHeaderSticky(true)).toBe(true)
  })
})
