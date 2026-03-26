import { describe, expect, it } from "vitest"
import {
  resolveCodeBlock,
  resolveHeadingLevel,
  resolveTextElement,
  resolveTextTruncate,
} from "../src/components/Typography"

describe("typography helpers", () => {
  it("resolves heading level with default", () => {
    expect(resolveHeadingLevel()).toBe(2)
    expect(resolveHeadingLevel(1)).toBe(1)
    expect(resolveHeadingLevel(6)).toBe(6)
  })

  it("resolves text element with default", () => {
    expect(resolveTextElement()).toBe("p")
    expect(resolveTextElement("span")).toBe("span")
    expect(resolveTextElement("strong")).toBe("strong")
  })

  it("resolves boolean options", () => {
    expect(resolveTextTruncate()).toBe(false)
    expect(resolveTextTruncate(true)).toBe(true)
    expect(resolveCodeBlock()).toBe(false)
    expect(resolveCodeBlock(true)).toBe(true)
  })
})
