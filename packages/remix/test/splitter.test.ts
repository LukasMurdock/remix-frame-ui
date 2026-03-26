import { describe, expect, it } from "vitest"
import {
  clampSplitterSize,
  resolveSplitterOrientation,
  resolveSplitterStep,
  stepSplitterSize,
} from "../src/components/Splitter"

describe("splitter helpers", () => {
  it("resolves defaults", () => {
    expect(resolveSplitterOrientation()).toBe("horizontal")
    expect(resolveSplitterStep()).toBe(5)
  })

  it("clamps size to min and max", () => {
    expect(clampSplitterSize(10, 20, 80)).toBe(20)
    expect(clampSplitterSize(50, 20, 80)).toBe(50)
    expect(clampSplitterSize(90, 20, 80)).toBe(80)
  })

  it("steps size by keymap", () => {
    expect(stepSplitterSize(50, "ArrowLeft", "horizontal", 20, 80, 5)).toBe(45)
    expect(stepSplitterSize(50, "ArrowRight", "horizontal", 20, 80, 5)).toBe(55)
    expect(stepSplitterSize(50, "ArrowUp", "vertical", 20, 80, 5)).toBe(45)
    expect(stepSplitterSize(50, "ArrowDown", "vertical", 20, 80, 5)).toBe(55)
    expect(stepSplitterSize(50, "Home", "horizontal", 20, 80, 5)).toBe(20)
    expect(stepSplitterSize(50, "End", "horizontal", 20, 80, 5)).toBe(80)
    expect(stepSplitterSize(50, "Enter", "horizontal", 20, 80, 5)).toBeUndefined()
  })
})
