import { describe, expect, it } from "vitest"
import {
  resolveDescriptionsBordered,
  resolveDescriptionsColumns,
  resolveDescriptionsItemSpan,
  resolveDescriptionsLayout,
  resolveDescriptionsSize,
} from "../src/components/Descriptions"

describe("descriptions helpers", () => {
  it("resolves column bounds", () => {
    expect(resolveDescriptionsColumns()).toBe(3)
    expect(resolveDescriptionsColumns(0)).toBe(1)
    expect(resolveDescriptionsColumns(5)).toBe(4)
    expect(resolveDescriptionsColumns(2.8)).toBe(2)
  })

  it("resolves size and layout defaults", () => {
    expect(resolveDescriptionsSize()).toBe("comfortable")
    expect(resolveDescriptionsSize("compact")).toBe("compact")
    expect(resolveDescriptionsLayout()).toBe("horizontal")
    expect(resolveDescriptionsLayout("vertical")).toBe("vertical")
  })

  it("resolves item span and bordered defaults", () => {
    expect(resolveDescriptionsItemSpan(undefined, 3)).toBe(1)
    expect(resolveDescriptionsItemSpan(0, 3)).toBe(1)
    expect(resolveDescriptionsItemSpan(4, 3)).toBe(3)
    expect(resolveDescriptionsBordered()).toBe(true)
    expect(resolveDescriptionsBordered(false)).toBe(false)
  })
})
