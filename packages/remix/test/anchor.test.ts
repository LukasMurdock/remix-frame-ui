import { describe, expect, it } from "vitest"
import {
  isAnchorItemActive,
  resolveAnchorActiveHref,
  resolveAnchorHashTarget,
  resolveAnchorInitialHref,
  syncAnchorActiveHrefFromHash,
  type AnchorItem,
} from "../src/components/Anchor"

describe("anchor helpers", () => {
  const items: AnchorItem[] = [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "api", label: "API", href: "#api" },
    { id: "faq", label: "FAQ", href: "#faq", disabled: true },
  ]

  it("resolves preferred href when enabled", () => {
    expect(resolveAnchorActiveHref(items, "#api")).toBe("#api")
  })

  it("falls back to first enabled href when preferred is missing or disabled", () => {
    expect(resolveAnchorActiveHref(items, "#faq")).toBe("#overview")
    expect(resolveAnchorActiveHref(items, "#missing")).toBe("#overview")
    expect(resolveAnchorActiveHref(items)).toBe("#overview")
  })

  it("returns undefined when all items are disabled", () => {
    expect(
      resolveAnchorActiveHref([
        { id: "a", label: "A", href: "#a", disabled: true },
        { id: "b", label: "B", href: "#b", disabled: true },
      ]),
    ).toBeUndefined()
  })

  it("checks active status by href", () => {
    expect(isAnchorItemActive("#overview", "#overview")).toBe(true)
    expect(isAnchorItemActive("#overview", "#api")).toBe(false)
    expect(isAnchorItemActive("#overview")).toBe(false)
  })

  it("prefers hash-matched href over default when resolving initial href", () => {
    expect(resolveAnchorInitialHref(items, "#api", "#overview")).toBe("#overview")
    expect(resolveAnchorInitialHref(items, "#api", "#missing")).toBe("#api")
    expect(resolveAnchorInitialHref(items, "#api")).toBe("#api")
  })

  it("resolves hash target only when hash maps to a new enabled href", () => {
    expect(resolveAnchorHashTarget(items, "#overview", "#api")).toBe("#api")
    expect(resolveAnchorHashTarget(items, "#api", "#api")).toBeUndefined()
    expect(resolveAnchorHashTarget(items, "#overview", "#faq")).toBeUndefined()
    expect(resolveAnchorHashTarget(items, "#overview", "#missing")).toBeUndefined()
    expect(resolveAnchorHashTarget(items, "#overview")).toBeUndefined()
  })

  it("syncs active href from hash and invokes callback only on valid change", () => {
    const updates: string[] = []

    expect(syncAnchorActiveHrefFromHash(items, "#overview", "#api", (href) => updates.push(href))).toBe("#api")
    expect(updates).toEqual(["#api"])

    expect(syncAnchorActiveHrefFromHash(items, "#api", "#api", (href) => updates.push(href))).toBeUndefined()
    expect(syncAnchorActiveHrefFromHash(items, "#api", "#faq", (href) => updates.push(href))).toBeUndefined()
    expect(syncAnchorActiveHrefFromHash(items, "#api", "#missing", (href) => updates.push(href))).toBeUndefined()
    expect(syncAnchorActiveHrefFromHash(items, "#api", undefined, (href) => updates.push(href))).toBeUndefined()

    expect(updates).toEqual(["#api"])
  })
})
