import { describe, expect, it } from "vitest"
import { resolveTextareaRows } from "../src/components/Textarea"

describe("textarea helpers", () => {
  it("uses default rows when rows is omitted", () => {
    expect(resolveTextareaRows()).toBe(4)
  })

  it("normalizes invalid row counts", () => {
    expect(resolveTextareaRows(8)).toBe(8)
    expect(resolveTextareaRows(0)).toBe(1)
    expect(resolveTextareaRows(-3)).toBe(1)
  })
})
