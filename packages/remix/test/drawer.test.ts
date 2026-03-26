import { describe, expect, it } from "vitest"
import { resolveDrawerDismissOnBackdrop, resolveDrawerPosition } from "../src/components/Drawer"

describe("drawer helpers", () => {
  it("defaults drawer position to right", () => {
    expect(resolveDrawerPosition()).toBe("right")
    expect(resolveDrawerPosition("left")).toBe("left")
  })

  it("defaults backdrop dismissal to true", () => {
    expect(resolveDrawerDismissOnBackdrop()).toBe(true)
    expect(resolveDrawerDismissOnBackdrop(false)).toBe(false)
  })
})
