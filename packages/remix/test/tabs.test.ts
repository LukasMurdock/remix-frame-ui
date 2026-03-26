import { describe, expect, it } from "vitest"
import {
  partitionTabsForOverflow,
  resolveTabsActivation,
  resolveTabsKeyboardTargetIndex,
  resolveTabsMaxVisible,
  resolveTabsOverflow,
  type TabItem,
} from "../src/components/Tabs"

const items: TabItem[] = [
  { id: "overview", label: "Overview", panel: "Overview" },
  { id: "deployments", label: "Deployments", panel: "Deployments" },
  { id: "incidents", label: "Incidents", panel: "Incidents" },
  { id: "alerts", label: "Alerts", panel: "Alerts" },
  { id: "settings", label: "Settings", panel: "Settings" },
]

describe("tabs overflow helpers", () => {
  it("resolves defaults", () => {
    expect(resolveTabsOverflow()).toBe("wrap")
    expect(resolveTabsActivation()).toBe("manual")
    expect(resolveTabsMaxVisible()).toBe(4)
  })

  it("sanitizes max visible values", () => {
    expect(resolveTabsMaxVisible(6)).toBe(6)
    expect(resolveTabsMaxVisible(0)).toBe(1)
    expect(resolveTabsMaxVisible(-2)).toBe(1)
    expect(resolveTabsMaxVisible(2.7)).toBe(2)
  })

  it("partitions tabs and keeps selected tab visible", () => {
    const partition = partitionTabsForOverflow(items, "settings", 4)
    expect(partition.visible.map((item) => item.id)).toEqual([
      "overview",
      "deployments",
      "incidents",
      "settings",
    ])
    expect(partition.overflow.map((item) => item.id)).toEqual(["alerts"])
  })

  it("resolves keyboard focus targets", () => {
    expect(resolveTabsKeyboardTargetIndex(0, 4, "ArrowRight")).toBe(1)
    expect(resolveTabsKeyboardTargetIndex(0, 4, "ArrowLeft")).toBe(3)
    expect(resolveTabsKeyboardTargetIndex(2, 4, "Home")).toBe(0)
    expect(resolveTabsKeyboardTargetIndex(1, 4, "End")).toBe(3)
    expect(resolveTabsKeyboardTargetIndex(1, 0, "End")).toBe(-1)
  })
})
