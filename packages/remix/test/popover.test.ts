import { describe, expect, it } from "vitest"
import { resolvePopoverOpen, type PopoverProps } from "../src/components/Popover"

const baseProps: PopoverProps = {
  trigger: "Open",
  content: "Panel",
}

describe("popover helpers", () => {
  it("defaults to closed", () => {
    expect(resolvePopoverOpen(baseProps, undefined)).toBe(false)
  })

  it("uses uncontrolled state when open is undefined", () => {
    expect(resolvePopoverOpen(baseProps, true)).toBe(true)
  })

  it("prefers controlled open prop", () => {
    expect(resolvePopoverOpen({ ...baseProps, open: false }, true)).toBe(false)
    expect(resolvePopoverOpen({ ...baseProps, open: true }, false)).toBe(true)
  })
})
