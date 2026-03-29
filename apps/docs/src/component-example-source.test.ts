import { describe, expect, it } from "vitest"
import {
  extractComponentExampleSnippets,
  isTypeScriptExampleLanguage,
  serializeExampleSnippetsForHtml,
  stripTopLevelMarkdownSection,
} from "./component-example-source.js"

describe("component example source", () => {
  it("extracts snippets from the Example section", () => {
    const source = `# Checkbox

## Example

\`\`\`tsx
export function Basic() {
  return <Checkbox />
}
\`\`\`

## HTML parity

Native checkbox.`

    expect(extractComponentExampleSnippets(source)).toEqual([
      {
        title: null,
        language: "tsx",
        code: "export function Basic() {\n  return <Checkbox />\n}",
      },
    ])
  })

  it("keeps multiple snippets and subsection headings", () => {
    const source = `# Dialog

## Example

### Controlled open state

\`\`\`ts
let open = false
\`\`\`

### Reason-aware close handling

\`\`\`tsx
<Dialog onClose={(reason) => reason} />
\`\`\`

## HTML parity

Modal semantics.`

    expect(extractComponentExampleSnippets(source)).toEqual([
      {
        title: "Controlled open state",
        language: "ts",
        code: "let open = false",
      },
      {
        title: "Reason-aware close handling",
        language: "tsx",
        code: "<Dialog onClose={(reason) => reason} />",
      },
    ])
  })

  it("strips only the Example section from rendered markdown", () => {
    const source = `# Checkbox

## API

Generated API.

## Example

\`\`\`tsx
<Checkbox />
\`\`\`

## HTML parity

Native checkbox.`

    const stripped = stripTopLevelMarkdownSection(source, "Example")

    expect(stripped).toContain("## API")
    expect(stripped).toContain("## HTML parity")
    expect(stripped).not.toContain("## Example")
    expect(stripped).not.toContain("<Checkbox />")
  })

  it("serializes snippets safely for inline JSON script payloads", () => {
    const payload = serializeExampleSnippetsForHtml([
      {
        title: null,
        language: "tsx",
        code: "<Component>& text</Component>",
      },
    ])

    expect(payload).toContain("\\u003cComponent\\u003e")
    expect(payload).toContain("\\u0026")
  })

  it("detects TypeScript example languages", () => {
    expect(isTypeScriptExampleLanguage("ts")).toBe(true)
    expect(isTypeScriptExampleLanguage("tsx")).toBe(true)
    expect(isTypeScriptExampleLanguage("typescript")).toBe(true)
    expect(isTypeScriptExampleLanguage("js")).toBe(false)
    expect(isTypeScriptExampleLanguage("")).toBe(false)
  })
})
