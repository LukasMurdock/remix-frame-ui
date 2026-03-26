import { describe, expect, it } from "vitest"
import { getAvatarInitials, resolveAvatarSize, resolveAvatarSquare } from "../src/components/Avatar"

describe("avatar helpers", () => {
  it("resolves defaults", () => {
    expect(resolveAvatarSize()).toBe("md")
    expect(resolveAvatarSquare()).toBe(false)
  })

  it("generates initials", () => {
    expect(getAvatarInitials("Lukas Murdock")).toBe("LM")
    expect(getAvatarInitials("Ada")).toBe("A")
    expect(getAvatarInitials("  ")).toBe("?")
  })
})
