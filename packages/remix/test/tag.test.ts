import { describe, expect, it } from "vitest"
import { resolveTagTone } from "../src/components/Tag"

describe("tag helpers", () => {
  it("defaults tone to neutral", () => {
    expect(resolveTagTone()).toBe("neutral")
  })

  it("keeps explicit tone", () => {
    expect(resolveTagTone("brand")).toBe("brand")
  })
})
