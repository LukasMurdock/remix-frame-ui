import { describe, expect, it } from "vitest"
import {
  resolveFilterPanelApplyLabel,
  resolveFilterPanelClearLabel,
  resolveFilterPanelCloseOnApply,
  resolveFilterPanelCloseOnClear,
  resolveFilterPanelShowApplyButton,
  resolveFilterPanelShowClearButton,
  resolveFilterPanelTitle,
} from "../src/components/FilterPanel"

describe("filter panel helpers", () => {
  it("defaults title and action labels", () => {
    expect(resolveFilterPanelTitle()).toBe("Filters")
    expect(resolveFilterPanelTitle("Saved filters")).toBe("Saved filters")
    expect(resolveFilterPanelApplyLabel()).toBe("Apply filters")
    expect(resolveFilterPanelClearLabel()).toBe("Clear")
  })

  it("defaults close behavior", () => {
    expect(resolveFilterPanelCloseOnApply()).toBe(true)
    expect(resolveFilterPanelCloseOnApply(false)).toBe(false)
    expect(resolveFilterPanelCloseOnClear()).toBe(false)
    expect(resolveFilterPanelCloseOnClear(true)).toBe(true)
  })

  it("shows action buttons by default", () => {
    expect(resolveFilterPanelShowApplyButton()).toBe(true)
    expect(resolveFilterPanelShowApplyButton(false)).toBe(false)
    expect(resolveFilterPanelShowClearButton()).toBe(true)
    expect(resolveFilterPanelShowClearButton(false)).toBe(false)
  })
})
