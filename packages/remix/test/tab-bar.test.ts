import { describe, expect, it } from "vitest"
import {
  resolveTabBarCompact,
  resolveTabBarKeyboardTargetIndex,
  resolveTabBarNextEnabledIndex,
  resolveTabBarSafeArea,
  resolveTabBarValue,
  type TabBarItem,
} from "../src/components/TabBar"

const items: TabBarItem[] = [
  { id: "home", label: "Home" },
  { id: "search", label: "Search" },
  { id: "alerts", label: "Alerts", disabled: true },
  { id: "profile", label: "Profile" },
]

describe("tab bar helpers", () => {
  it("resolves compact and safe-area defaults", () => {
    expect(resolveTabBarCompact()).toBe(false)
    expect(resolveTabBarCompact(true)).toBe(true)
    expect(resolveTabBarSafeArea()).toBe(true)
    expect(resolveTabBarSafeArea(false)).toBe(false)
  })

  it("resolves active value and falls back to first enabled", () => {
    expect(resolveTabBarValue(items, "search")).toBe("search")
    expect(resolveTabBarValue(items, "alerts")).toBe("home")
    expect(resolveTabBarValue(items, "unknown")).toBe("home")
    expect(resolveTabBarValue([{ id: "only", label: "Only", disabled: true }])).toBeUndefined()
  })

  it("resolves keyboard target index with wrapping", () => {
    expect(resolveTabBarKeyboardTargetIndex(0, 4, "ArrowRight")).toBe(1)
    expect(resolveTabBarKeyboardTargetIndex(0, 4, "ArrowLeft")).toBe(3)
    expect(resolveTabBarKeyboardTargetIndex(2, 4, "Home")).toBe(0)
    expect(resolveTabBarKeyboardTargetIndex(1, 4, "End")).toBe(3)
    expect(resolveTabBarKeyboardTargetIndex(1, 0, "End")).toBe(-1)
  })

  it("finds next enabled index while skipping disabled items", () => {
    expect(resolveTabBarNextEnabledIndex(items, 0, 1)).toBe(0)
    expect(resolveTabBarNextEnabledIndex(items, 2, 1)).toBe(3)
    expect(resolveTabBarNextEnabledIndex(items, 2, -1)).toBe(1)
    expect(resolveTabBarNextEnabledIndex([{ id: "x", label: "X", disabled: true }], 0, 1)).toBe(-1)
  })
})
