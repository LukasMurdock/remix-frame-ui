import { describe, expect, it } from "vitest"
import {
  clampSwipeActionOffset,
  resolveSwipeActionActionWidth,
  resolveSwipeActionCloseOnAction,
  resolveSwipeActionOpenSide,
  resolveSwipeActionReleaseSide,
  resolveSwipeActionThreshold,
} from "../src/components/SwipeAction"

describe("swipe action helpers", () => {
  it("resolves defaults", () => {
    expect(resolveSwipeActionActionWidth()).toBe(72)
    expect(resolveSwipeActionActionWidth(30)).toBe(48)
    expect(resolveSwipeActionThreshold()).toBe(56)
    expect(resolveSwipeActionThreshold(8)).toBe(16)
    expect(resolveSwipeActionCloseOnAction()).toBe(true)
    expect(resolveSwipeActionCloseOnAction(false)).toBe(false)
  })

  it("resolves open side only when actions exist", () => {
    expect(resolveSwipeActionOpenSide(undefined, true, true)).toBe("none")
    expect(resolveSwipeActionOpenSide("start", true, false)).toBe("start")
    expect(resolveSwipeActionOpenSide("start", false, true)).toBe("none")
    expect(resolveSwipeActionOpenSide("end", false, true)).toBe("end")
  })

  it("clamps drag offsets to action widths", () => {
    expect(clampSwipeActionOffset(20, 72, 144)).toBe(20)
    expect(clampSwipeActionOffset(120, 72, 144)).toBe(72)
    expect(clampSwipeActionOffset(-200, 72, 144)).toBe(-144)
  })

  it("resolves release side from closed state with threshold", () => {
    expect(
      resolveSwipeActionReleaseSide({
        offset: 60,
        startWidth: 72,
        endWidth: 144,
        threshold: 56,
        startOpenSide: "none",
      }),
    ).toBe("start")

    expect(
      resolveSwipeActionReleaseSide({
        offset: -61,
        startWidth: 72,
        endWidth: 144,
        threshold: 56,
        startOpenSide: "none",
      }),
    ).toBe("end")

    expect(
      resolveSwipeActionReleaseSide({
        offset: 40,
        startWidth: 72,
        endWidth: 144,
        threshold: 56,
        startOpenSide: "none",
      }),
    ).toBe("none")
  })

  it("keeps or closes side based on release distance", () => {
    expect(
      resolveSwipeActionReleaseSide({
        offset: 48,
        startWidth: 72,
        endWidth: 144,
        threshold: 56,
        startOpenSide: "start",
      }),
    ).toBe("start")

    expect(
      resolveSwipeActionReleaseSide({
        offset: 20,
        startWidth: 72,
        endWidth: 144,
        threshold: 56,
        startOpenSide: "start",
      }),
    ).toBe("none")

    expect(
      resolveSwipeActionReleaseSide({
        offset: -120,
        startWidth: 72,
        endWidth: 144,
        threshold: 56,
        startOpenSide: "end",
      }),
    ).toBe("end")
  })
})
