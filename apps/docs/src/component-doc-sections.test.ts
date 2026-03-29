import { describe, expect, it } from "vitest"
import { analyzeComponentDoc } from "./component-doc-sections.js"

const validDoc = `# ExampleComponent

Maturity: experimental

## When to use

- Describe usage.

## Import

\`\`\`ts
import { ExampleComponent } from "@lukasmurdock/remix-ui-components"
\`\`\`

## API

Type definitions are generated from component source.

## HTML parity

Renders semantic native elements.

## Runtime notes

Supports controlled and uncontrolled patterns.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | native semantics |

## Keymap spec

- \`Tab\`: moves focus
`

describe("component doc section analysis", () => {
  it("passes for valid docs", () => {
    const analysis = analyzeComponentDoc(validDoc)

    expect(analysis.missingSections).toEqual([])
    expect(analysis.emptySections).toEqual([])
    expect(analysis.outOfOrderSections).toEqual([])
    expect(analysis.placeholderPhrases).toEqual([])
    expect(analysis.apiIssues).toEqual([])
  })

  it("reports missing sections", () => {
    const analysis = analyzeComponentDoc(validDoc.replace("## Runtime notes", "## Runtime"))

    expect(analysis.missingSections).toContain("## Runtime notes")
  })

  it("reports empty sections", () => {
    const analysis = analyzeComponentDoc(
      validDoc.replace("## Runtime notes\n\nSupports controlled and uncontrolled patterns.", "## Runtime notes"),
    )

    expect(analysis.emptySections).toContain("## Runtime notes")
  })

  it("reports out-of-order sections", () => {
    const withOrderIssue = validDoc
      .replace("## When to use", "## TEMP")
      .replace("## Import", "## When to use")
      .replace("## TEMP", "## Import")

    const analysis = analyzeComponentDoc(withOrderIssue)

    expect(analysis.outOfOrderSections).toContain("## When to use -> ## Import")
  })

  it("reports placeholder phrases", () => {
    const analysis = analyzeComponentDoc(
      validDoc.replace("Describe usage.", "Use `ExampleComponent` for this UI pattern in page and app workflows."),
    )

    expect(analysis.placeholderPhrases).toContain("for this UI pattern in page and app workflows.")
  })

  it("reports API issues for manual or missing generated notice", () => {
    const withManualApi = validDoc.replace(
      "Type definitions are generated from component source.",
      "| Prop | Type |\n| --- | --- |",
    )
    const analysis = analyzeComponentDoc(withManualApi)

    expect(analysis.apiIssues).toContain(
      "missing generated notice: Type definitions are generated from component source.",
    )
    expect(analysis.apiIssues).toContain("contains manual prop table content")
  })
})
