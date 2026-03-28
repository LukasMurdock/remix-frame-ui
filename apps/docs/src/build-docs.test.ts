import { describe, expect, it } from "vitest"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { applyGeneratedApiSection } from "./component-api-sections.js"
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

  it("keeps guide nav and stable-only filter wiring in build and dev docs", async () => {
    const root = path.resolve(import.meta.dirname, "..")
    const buildSource = await readFile(path.join(root, "src", "build-docs.mjs"), "utf8")
    const devSource = await readFile(path.join(root, "src", "dev-docs.js"), "utf8")

    expect(buildSource).toContain("Start Here")
    expect(devSource).toContain("Start Here")
    expect(buildSource).toContain("data-docs-stable-only")
    expect(devSource).toContain("data-docs-stable-only")
  })

  it("uses shared guide and section config in build and dev docs", async () => {
    const root = path.resolve(import.meta.dirname, "..")
    const buildSource = await readFile(path.join(root, "src", "build-docs.mjs"), "utf8")
    const devSource = await readFile(path.join(root, "src", "dev-docs.js"), "utf8")

    expect(buildSource).toContain('from "./component-doc-sections.js"')
    expect(devSource).toContain('from "./component-doc-sections.js"')
    expect(buildSource).toContain('from "./guide-config.js"')
    expect(devSource).toContain('from "./guide-config.js"')
    expect(buildSource).not.toContain("const guideOrder = [")
    expect(devSource).not.toContain("const guideOrder = [")
  })

  it("injects generated API section for docs missing API heading", () => {
    const source = `# Alert

Maturity: experimental

## HTML parity

Example.

## Runtime notes

Example.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | status |

## Keymap spec

- Tab`

    const withApi = applyGeneratedApiSection("alert", source)

    expect(withApi).toContain("## API")
    expect(withApi).toContain("export type AlertProps")
    expect(withApi.indexOf("## API")).toBeLessThan(withApi.indexOf("## HTML parity"))
  })

  it("replaces existing API section with generated API section", () => {
    const source = `# Alert

Maturity: experimental

## API

Manual API text.

## HTML parity

Example.

## Runtime notes

Example.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | status |

## Keymap spec

- Tab`

    const withApi = applyGeneratedApiSection("alert", source)

    expect(withApi).toContain("Type definitions are generated from component source.")
    expect(withApi).not.toContain("Manual API text.")
    expect(withApi).toContain("| Prop | Type | Required | Default |")
  })

  it("includes inherited props from utility type aliases", () => {
    const source = `# FilterPanel

Maturity: experimental

## HTML parity

Example.

## Runtime notes

Example.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | dialog |

## Keymap spec

- Tab`

    const withApi = applyGeneratedApiSection("filterpanel", source)

    expect(withApi).toContain("`position` | `DrawerPosition`")
    expect(withApi).toContain("`dismissOnBackdrop` | `boolean` | no | `true`")
    expect(withApi).toContain('`closeLabel` | `string` | no | `"Close"`')
  })
})
