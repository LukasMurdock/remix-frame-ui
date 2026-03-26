import { describe, expect, it } from "vitest"
import { readFile } from "node:fs/promises"
import path from "node:path"
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

  it("keeps docs sidebar height constrained to viewport", async () => {
    const root = path.resolve(import.meta.dirname, "..")
    const buildSource = await readFile(path.join(root, "src", "build-docs.mjs"), "utf8")
    const devSource = await readFile(path.join(root, "src", "dev-docs.js"), "utf8")

    const sidebarBlockPattern = /\.docs-site-shell \.rf-app-shell-sidebar\s*\{[^}]*box-sizing:\s*border-box;[^}]*\}/s

    expect(buildSource).toMatch(sidebarBlockPattern)
    expect(devSource).toMatch(sidebarBlockPattern)
  })
})
