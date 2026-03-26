import { describe, expect, it } from "vitest"
import { resolveBadgeTone } from "../src/components/Badge"

describe("badge helpers", () => {
  it("defaults tone to neutral", () => {
    expect(resolveBadgeTone()).toBe("neutral")
  })

  it("keeps explicit tone", () => {
    expect(resolveBadgeTone("success")).toBe("success")
    expect(resolveBadgeTone("danger")).toBe("danger")
  })
})
