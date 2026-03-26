import { describe, expect, it } from "vitest"
import { resolveMenuOpen, type MenuProps } from "../src/components/Menu"

const baseProps: MenuProps = {
  triggerLabel: "Actions",
  items: [{ id: "edit", label: "Edit" }],
}

describe("menu helpers", () => {
  it("defaults to closed", () => {
    expect(resolveMenuOpen(baseProps, undefined)).toBe(false)
  })

  it("uses uncontrolled state when open prop is undefined", () => {
    expect(resolveMenuOpen(baseProps, true)).toBe(true)
    expect(resolveMenuOpen(baseProps, false)).toBe(false)
  })

  it("prefers controlled open prop", () => {
    expect(resolveMenuOpen({ ...baseProps, open: true }, false)).toBe(true)
    expect(resolveMenuOpen({ ...baseProps, open: false }, true)).toBe(false)
  })
})
