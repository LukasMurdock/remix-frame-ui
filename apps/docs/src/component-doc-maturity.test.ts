import { describe, expect, it } from "vitest"
import { extractMaturityLabel, extractTitle, toComponentSlug, validMaturityLabels } from "./component-doc-maturity.js"

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

  it("extracts heading title", () => {
    const source = `# DateRangePicker\n\nMaturity: experimental`

    expect(extractTitle(source)).toBe("DateRangePicker")
  })

  it("returns null when heading is missing", () => {
    const source = `Maturity: stable`

    expect(extractTitle(source)).toBeNull()
  })
})
