import { describe, expect, it } from "vitest"
import { resolveEmptySize } from "../src/components/Empty"

describe("empty helpers", () => {
  it("defaults size to comfortable", () => {
    expect(resolveEmptySize()).toBe("comfortable")
  })

  it("keeps explicit size", () => {
    expect(resolveEmptySize("compact")).toBe("compact")
  })
})
