import { describe, expect, it } from "vitest"
import {
  clampPullToRefreshOffset,
  resolvePullToRefreshCompleteDelay,
  resolvePullToRefreshStatus,
  resolvePullToRefreshThreshold,
  shouldStartPullToRefreshDrag,
} from "../src/components/PullToRefresh"

describe("pull to refresh helpers", () => {
  it("resolves threshold and complete delay defaults", () => {
    expect(resolvePullToRefreshThreshold()).toBe(72)
    expect(resolvePullToRefreshThreshold(12)).toBe(24)
    expect(resolvePullToRefreshThreshold(80)).toBe(80)
    expect(resolvePullToRefreshCompleteDelay()).toBe(420)
    expect(resolvePullToRefreshCompleteDelay(-100)).toBe(0)
    expect(resolvePullToRefreshCompleteDelay(650)).toBe(650)
  })

  it("clamps pull offset with damping ceiling", () => {
    expect(clampPullToRefreshOffset(-20, 72)).toBe(0)
    expect(clampPullToRefreshOffset(48, 72)).toBe(48)
    expect(clampPullToRefreshOffset(200, 72)).toBe(115)
  })

  it("resolves visual status based on interaction state", () => {
    expect(resolvePullToRefreshStatus(0, 72, false, false)).toBe("idle")
    expect(resolvePullToRefreshStatus(28, 72, false, false)).toBe("pulling")
    expect(resolvePullToRefreshStatus(80, 72, false, false)).toBe("can-release")
    expect(resolvePullToRefreshStatus(0, 72, true, false)).toBe("refreshing")
    expect(resolvePullToRefreshStatus(0, 72, false, true)).toBe("complete")
  })

  it("only starts drag when enabled and at top boundary", () => {
    expect(shouldStartPullToRefreshDrag(0, false, false)).toBe(true)
    expect(shouldStartPullToRefreshDrag(10, false, false)).toBe(false)
    expect(shouldStartPullToRefreshDrag(0, true, false)).toBe(false)
    expect(shouldStartPullToRefreshDrag(0, false, true)).toBe(false)
  })
})
