import { describe, expect, it } from "vitest"
import { analyzeComponentExample, looksLikePlaceholderExample } from "./component-example-audit.js"

function buildDoc(exampleBody) {
  return `# ExampleComponent

## When to use

Use it.

## Example

${exampleBody}

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | native semantics |
`
}

describe("component example audit", () => {
  it("passes when Example includes fenced code", () => {
    const doc = buildDoc("```tsx\n<ExampleComponent />\n```\n\nSmall note.")

    const analysis = analyzeComponentExample(doc)

    expect(analysis.issues).toEqual([])
    expect(analysis.codeBlockCount).toBe(1)
    expect(analysis.hasCodeBlock).toBe(true)
  })

  it("requires TypeScript example fences", () => {
    const doc = buildDoc("```js\nrenderComponent()\n```")

    const analysis = analyzeComponentExample(doc)

    expect(analysis.issues).toContain("missing ts/tsx fenced code block in ## Example")
  })

  it("reports missing Example section", () => {
    const doc = buildDoc("```tsx\n<ExampleComponent />\n```").replace("## Example", "## Demo")

    const analysis = analyzeComponentExample(doc)

    expect(analysis.issues).toEqual(["missing ## Example section"])
  })

  it("reports empty Example section", () => {
    const analysis = analyzeComponentExample(buildDoc(""))

    expect(analysis.issues).toContain("empty ## Example section")
    expect(analysis.issues).toContain("missing fenced code block in ## Example")
  })

  it("reports placeholder-only copy", () => {
    const doc = buildDoc("See demos for composition and layout patterns.")

    const analysis = analyzeComponentExample(doc)

    expect(analysis.issues).toContain("missing fenced code block in ## Example")
    expect(analysis.issues).toContain("placeholder copy in ## Example")
    expect(analysis.hasPlaceholderCopy).toBe(true)
  })

  it("allows non-placeholder prose when code is missing", () => {
    const doc = buildDoc("Use this to compose a quick inline layout.")

    const analysis = analyzeComponentExample(doc)

    expect(analysis.issues).toContain("missing fenced code block in ## Example")
    expect(analysis.issues).not.toContain("placeholder copy in ## Example")
  })

  it("detects placeholder copy patterns", () => {
    expect(looksLikePlaceholderExample("See demos on this page for complete `Alert` usage patterns.")).toBe(true)
    expect(looksLikePlaceholderExample("See demos for controlled and uncontrolled usage patterns.")).toBe(true)
    expect(looksLikePlaceholderExample("A full code sample is shown below.")).toBe(false)
  })
})
