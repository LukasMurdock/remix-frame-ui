import { describe, expect, it } from "vitest"
import {
  resolveSpaceAlign,
  resolveSpaceDirection,
  resolveSpaceSize,
  resolveSpaceWrap,
} from "../src/components/Space"

describe("space helpers", () => {
  it("resolves defaults", () => {
    expect(resolveSpaceDirection()).toBe("horizontal")
    expect(resolveSpaceSize()).toBe("md")
    expect(resolveSpaceAlign()).toBe("center")
    expect(resolveSpaceWrap()).toBe(false)
  })

  it("keeps explicit options", () => {
    expect(resolveSpaceDirection("vertical")).toBe("vertical")
    expect(resolveSpaceSize("lg")).toBe("lg")
    expect(resolveSpaceAlign("baseline")).toBe("baseline")
    expect(resolveSpaceWrap(true)).toBe(true)
  })
})
