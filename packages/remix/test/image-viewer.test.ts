import { describe, expect, it } from "vitest"
import {
  normalizeImageViewerIndex,
  resolveImageViewerDismissOnBackdrop,
  resolveImageViewerDismissOnEscape,
  resolveImageViewerLoop,
  resolveImageViewerNextIndex,
  resolveImageViewerShowCounter,
} from "../src/components/ImageViewer"

describe("image viewer helpers", () => {
  it("resolves boolean defaults", () => {
    expect(resolveImageViewerDismissOnBackdrop()).toBe(true)
    expect(resolveImageViewerDismissOnBackdrop(false)).toBe(false)
    expect(resolveImageViewerDismissOnEscape()).toBe(true)
    expect(resolveImageViewerDismissOnEscape(false)).toBe(false)
    expect(resolveImageViewerLoop()).toBe(true)
    expect(resolveImageViewerLoop(false)).toBe(false)
    expect(resolveImageViewerShowCounter()).toBe(true)
    expect(resolveImageViewerShowCounter(false)).toBe(false)
  })

  it("normalizes selected index bounds", () => {
    expect(normalizeImageViewerIndex(undefined, 3)).toBe(0)
    expect(normalizeImageViewerIndex(1, 3)).toBe(1)
    expect(normalizeImageViewerIndex(2.7, 3)).toBe(2)
    expect(normalizeImageViewerIndex(-4, 3)).toBe(0)
    expect(normalizeImageViewerIndex(12, 3)).toBe(2)
    expect(normalizeImageViewerIndex(0, 0)).toBe(0)
  })

  it("steps next index with loop and boundary clamping", () => {
    expect(resolveImageViewerNextIndex(0, 1, 4, true)).toBe(1)
    expect(resolveImageViewerNextIndex(3, 1, 4, true)).toBe(0)
    expect(resolveImageViewerNextIndex(0, -1, 4, true)).toBe(3)
    expect(resolveImageViewerNextIndex(0, -1, 4, false)).toBe(0)
    expect(resolveImageViewerNextIndex(3, 1, 4, false)).toBe(3)
    expect(resolveImageViewerNextIndex(1, -1, 4, false)).toBe(0)
  })
})
