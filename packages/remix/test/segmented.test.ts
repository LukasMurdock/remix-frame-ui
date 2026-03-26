import { describe, expect, it } from "vitest"
import {
  resolveSegmentedFullWidth,
  resolveSegmentedSize,
  resolveSegmentedValue,
  type SegmentedOption,
} from "../src/components/Segmented"

const options: SegmentedOption[] = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity", disabled: true },
  { value: "settings", label: "Settings" },
]

describe("segmented helpers", () => {
  it("resolves defaults", () => {
    expect(resolveSegmentedSize()).toBe("comfortable")
    expect(resolveSegmentedSize("compact")).toBe("compact")
    expect(resolveSegmentedFullWidth()).toBe(false)
    expect(resolveSegmentedFullWidth(true)).toBe(true)
  })

  it("resolves selected value", () => {
    expect(resolveSegmentedValue(options, "settings")).toBe("settings")
    expect(resolveSegmentedValue(options)).toBe("overview")
  })

  it("returns undefined with no enabled options", () => {
    expect(resolveSegmentedValue([{ value: "x", label: "X", disabled: true }])).toBeUndefined()
  })
})
