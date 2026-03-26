import { describe, expect, it } from "vitest"
import {
  resolveAppShellSidebarPosition,
  resolveAppShellSidebarState,
  resolveAppShellSidebarWidth,
} from "../src/components/AppShell"

describe("app shell helpers", () => {
  it("defaults sidebar state to expanded", () => {
    expect(resolveAppShellSidebarState()).toBe("expanded")
    expect(resolveAppShellSidebarState(false)).toBe("expanded")
    expect(resolveAppShellSidebarState(true)).toBe("collapsed")
  })

  it("defaults sidebar position to left", () => {
    expect(resolveAppShellSidebarPosition()).toBe("left")
    expect(resolveAppShellSidebarPosition("right")).toBe("right")
  })

  it("defaults sidebar width to 16rem", () => {
    expect(resolveAppShellSidebarWidth()).toBe("16rem")
    expect(resolveAppShellSidebarWidth("20rem")).toBe("20rem")
  })
})
