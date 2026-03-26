import { describe, expect, it } from "vitest"
import { resolveSpinnerSize } from "../src/components/Spinner"

describe("spinner helpers", () => {
  it("defaults to md size", () => {
    expect(resolveSpinnerSize()).toBe("md")
  })

  it("keeps explicit size", () => {
    expect(resolveSpinnerSize("sm")).toBe("sm")
    expect(resolveSpinnerSize("lg")).toBe("lg")
  })
})
