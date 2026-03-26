import { describe, expect, it } from "vitest"
import { normalizeSkeletonLines } from "../src/components/Skeleton"

describe("skeleton helpers", () => {
  it("defaults to three lines", () => {
    expect(normalizeSkeletonLines()).toBe(3)
  })

  it("normalizes minimum and integer lines", () => {
    expect(normalizeSkeletonLines(0)).toBe(1)
    expect(normalizeSkeletonLines(1.8)).toBe(1)
    expect(normalizeSkeletonLines(4.9)).toBe(4)
  })
})
