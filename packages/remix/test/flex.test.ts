import { describe, expect, it } from "vitest"
import {
  resolveFlexAlign,
  resolveFlexDirection,
  resolveFlexGap,
  resolveFlexInline,
  resolveFlexJustify,
  resolveFlexWrap,
} from "../src/components/Flex"

describe("flex helpers", () => {
  it("resolves defaults", () => {
    expect(resolveFlexDirection()).toBe("row")
    expect(resolveFlexAlign()).toBe("stretch")
    expect(resolveFlexJustify()).toBe("start")
    expect(resolveFlexWrap()).toBe("nowrap")
    expect(resolveFlexGap()).toBe("0.75rem")
    expect(resolveFlexInline()).toBe(false)
  })

  it("keeps explicit options", () => {
    expect(resolveFlexDirection("column")).toBe("column")
    expect(resolveFlexAlign("center")).toBe("center")
    expect(resolveFlexJustify("between")).toBe("between")
    expect(resolveFlexWrap("wrap")).toBe("wrap")
    expect(resolveFlexGap("2rem")).toBe("2rem")
    expect(resolveFlexInline(true)).toBe(true)
  })
})
