import { describe, expect, it } from "vitest"
import {
  extractMaturityLabel,
  extractPlatformLabel,
  extractTitle,
  normalizePlatformLabel,
  resolvePlatformLabel,
  toComponentSlug,
  validMaturityLabels,
  validPlatformLabels,
} from "./component-doc-maturity.js"

describe("component doc maturity helpers", () => {
  it("normalizes component names to doc slugs", () => {
    expect(toComponentSlug("CommandPalette")).toBe("commandpalette")
    expect(toComponentSlug("Tree Select")).toBe("treeselect")
    expect(toComponentSlug("App-Header")).toBe("appheader")
  })

  it("extracts maturity label from docs content", () => {
    const source = `# Button\n\nMaturity: stable\n\n## When to use\n\n- ...`

    expect(extractMaturityLabel(source)).toBe("stable")
  })

  it("returns null when maturity line is missing", () => {
    const source = `# Button\n\n## When to use\n\n- ...`

    expect(extractMaturityLabel(source)).toBeNull()
  })

  it("tracks expected maturity labels", () => {
    expect(validMaturityLabels.has("experimental")).toBe(true)
    expect(validMaturityLabels.has("stable")).toBe(true)
    expect(validMaturityLabels.has("beta")).toBe(false)
  })

  it("extracts platform label from docs content", () => {
    const source = `# FloatingPanel\n\nMaturity: experimental\nPlatform: mobile\n\n## When to use\n\n- ...`

    expect(extractPlatformLabel(source)).toBe("mobile")
  })

  it("returns null when platform line is missing", () => {
    const source = `# Button\n\nMaturity: stable\n\n## When to use\n\n- ...`

    expect(extractPlatformLabel(source)).toBeNull()
  })

  it("normalizes and resolves platform labels", () => {
    expect(normalizePlatformLabel(undefined)).toBe("universal")
    expect(normalizePlatformLabel("  MOBILE ")).toBe("mobile")
    expect(resolvePlatformLabel("mobile")).toBe("mobile")
    expect(resolvePlatformLabel("unknown")).toBe("universal")
  })

  it("tracks expected platform labels", () => {
    expect(validPlatformLabels.has("universal")).toBe(true)
    expect(validPlatformLabels.has("mobile")).toBe(true)
    expect(validPlatformLabels.has("mobile-only")).toBe(false)
  })

  it("extracts heading title", () => {
    const source = `# DateRangePicker\n\nMaturity: experimental`

    expect(extractTitle(source)).toBe("DateRangePicker")
  })

  it("returns null when heading is missing", () => {
    const source = `Maturity: stable`

    expect(extractTitle(source)).toBeNull()
  })
})
