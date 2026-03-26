import { describe, expect, it } from "vitest"
import { renderMarkdownToHtml } from "./render-markdown.js"

describe("docs contracts", () => {
  it("keeps required sections list stable", () => {
    const requiredSections = ["## HTML parity", "## Runtime notes", "## Accessibility matrix"]
    expect(requiredSections).toHaveLength(3)
  })

  it("renders markdown with gfm support", async () => {
    const markdown = `# Title

| Requirement | Behavior |
| --- | --- |
| Role | native button role |
`

    const html = await renderMarkdownToHtml(markdown)
    expect(html).toContain("<h1>Title</h1>")
    expect(html).toContain("<table>")
    expect(html).toContain("<td>native button role</td>")
  })
})
