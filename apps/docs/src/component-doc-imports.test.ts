import { describe, expect, it } from "vitest"
import {
  extractExportedSymbols,
  extractPackageImportGroups,
  extractPackageImportSymbols,
  hasOwnComponentImport,
  parseImportedSymbols,
} from "./component-doc-imports.js"

describe("component doc import parsing", () => {
  it("parses single-symbol import", () => {
    const source = `## Import

\`\`\`ts
import { Button } from "@lukasmurdock/remix-ui-components"
\`\`\``

    expect(parseImportedSymbols(source)).toEqual(["Button"])
  })

  it("parses multiline imports", () => {
    const source = `## Import

\`\`\`ts
import {
  DataTable,
  composeDataTableRowFilter,
  createDataTableContainsFilter,
} from "@lukasmurdock/remix-ui-components"
\`\`\``

    expect(parseImportedSymbols(source)).toEqual([
      "DataTable",
      "composeDataTableRowFilter",
      "createDataTableContainsFilter",
    ])
  })

  it("normalizes aliased imports", () => {
    const source = `## Import

\`\`\`ts
import { ToastViewport as Toast } from "@lukasmurdock/remix-ui-components"
\`\`\``

    expect(parseImportedSymbols(source)).toEqual(["ToastViewport"])
  })

  it("returns null for missing import section", () => {
    expect(parseImportedSymbols("# Missing import section")).toBeNull()
  })

  it("returns null for imports from other packages", () => {
    const source = `## Import

\`\`\`ts
import { Button } from "some-other-package"
\`\`\``

    expect(parseImportedSymbols(source)).toBeNull()
  })

  it("extracts package imports across multiple code blocks", () => {
    const source = `
\`\`\`ts
import { Form } from "@lukasmurdock/remix-ui-components"
\`\`\`

\`\`\`tsx
import { Space, Text } from "@lukasmurdock/remix-ui-components"
\`\`\`
`

    expect(extractPackageImportSymbols(source)).toEqual(["Form", "Space", "Text"])
  })

  it("groups package imports by import path", () => {
    const source = `
\`\`\`ts
import { Form, Space } from "@lukasmurdock/remix-ui-components"
import { run } from "@lukasmurdock/remix-ui-components/client"
import { renderToStream } from "@lukasmurdock/remix-ui-components/server"
\`\`\`
`

    const groups = extractPackageImportGroups(source)

    expect(groups.get("@lukasmurdock/remix-ui-components")).toEqual(["Form", "Space"])
    expect(groups.get("@lukasmurdock/remix-ui-components/client")).toEqual(["run"])
    expect(groups.get("@lukasmurdock/remix-ui-components/server")).toEqual(["renderToStream"])
  })

  it("extracts exported symbols from component source", () => {
    const source = `
export type Item = { id: string }
export interface Props { item: Item }
export enum Tone { Info = "info" }
export function Widget() { return null }
`

    expect([...extractExportedSymbols(source)]).toEqual(["Widget", "Item", "Props", "Tone"])
  })

  it("extracts re-exported symbols from entrypoint source", () => {
    const source = `
export { run, navigate, link } from "remix/component"
export type { ResolveFrameContext as FrameContext } from "remix/component/server"
`

    expect([...extractExportedSymbols(source)]).toEqual(["run", "navigate", "link", "FrameContext"])
  })

  it("detects imports that belong to the documented component module", () => {
    const importedSymbols = ["DataTable", "composeDataTableRowFilter"]
    const ownSymbols = new Set(["DataTable", "DataTableRow", "composeDataTableRowFilter"])

    expect(hasOwnComponentImport(importedSymbols, ownSymbols, "DataTable")).toBe(true)
  })

  it("falls back to component name for alias-style docs", () => {
    const importedSymbols = ["Chip"]
    const ownSymbols = new Set(["Tag", "TagProps"])

    expect(hasOwnComponentImport(importedSymbols, ownSymbols, "Chip")).toBe(true)
  })

  it("fails when imports do not include own component symbols", () => {
    const importedSymbols = ["Button", "Input"]
    const ownSymbols = new Set(["DataTable", "DataTableRow"])

    expect(hasOwnComponentImport(importedSymbols, ownSymbols, "DataTable")).toBe(false)
  })
})
