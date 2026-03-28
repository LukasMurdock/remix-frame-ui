import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"
import {
  buildComponentExportCatalog,
  collectEntryPointExportSymbols,
  parseComponentExportEntries,
} from "./component-export-catalog.js"

describe("component export catalog", () => {
  it("parses component export entries from index source", () => {
    const indexSource = `
export * from "./components/Button"
export * from "./components/Form"
`

    expect(parseComponentExportEntries(indexSource)).toEqual([
      { componentFileName: "Button", componentSlug: "button" },
      { componentFileName: "Form", componentSlug: "form" },
    ])
  })

  it("builds symbol catalog, per-component map, and maturities", () => {
    const entries = [
      { componentFileName: "Button", componentSlug: "button" },
      { componentFileName: "Form", componentSlug: "form" },
    ]
    const sources = new Map([
      ["Button", "export type ButtonProps = {}\nexport function Button() { return null }"],
      ["Form", "export type FormProps = {}\nexport function Form() { return null }"],
    ])
    const metadataBySlug = new Map([
      ["button", "experimental"],
      ["form", "stable"],
    ])

    const catalog = buildComponentExportCatalog(entries, sources, metadataBySlug)

    expect([...catalog.exportedSymbols]).toEqual(["Button", "ButtonProps", "Form", "FormProps"])
    expect([...(catalog.symbolsByComponentSlug.get("button") ?? [])]).toEqual(["Button", "ButtonProps"])
    expect([...(catalog.symbolsByComponentSlug.get("form") ?? [])]).toEqual(["Form", "FormProps"])
    expect([...(catalog.symbolMaturitiesByName.get("Button") ?? [])]).toEqual(["experimental"])
    expect([...(catalog.symbolMaturitiesByName.get("Form") ?? [])]).toEqual(["stable"])
  })

  it("tracks shared symbol maturities across multiple components", () => {
    const entries = [
      { componentFileName: "A", componentSlug: "a" },
      { componentFileName: "B", componentSlug: "b" },
    ]
    const sources = new Map([
      ["A", "export type Shared = {}\nexport function A() { return null }"],
      ["B", "export type Shared = {}\nexport function B() { return null }"],
    ])
    const metadataBySlug = new Map([
      ["a", "stable"],
      ["b", "experimental"],
    ])

    const catalog = buildComponentExportCatalog(entries, sources, metadataBySlug)

    expect([...(catalog.symbolMaturitiesByName.get("Shared") ?? [])]).toEqual(["stable", "experimental"])
  })

  it("collects symbols from client/server entrypoint re-exports", async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), "rf-ui-docs-catalog-"))
    const entrypointPath = path.join(tempDir, "index.ts")

    try {
      await writeFile(
        entrypointPath,
        'export { run, navigate } from "remix/component"\nexport type { ResolveFrameContext as FrameContext } from "remix/component/server"\n',
        "utf8",
      )

      const symbols = await collectEntryPointExportSymbols(entrypointPath)
      expect([...symbols]).toEqual(["run", "navigate", "FrameContext"])
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })
})
