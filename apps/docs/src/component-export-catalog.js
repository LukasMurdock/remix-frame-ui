import { readFile } from "node:fs/promises"
import path from "node:path"
import { extractExportedSymbols } from "./component-doc-imports.js"

export function parseComponentExportEntries(indexSource) {
  return [...indexSource.matchAll(/export \* from "\.\/components\/([A-Za-z0-9_-]+)"/g)]
    .map((match) => match[1])
    .filter(Boolean)
    .map((componentFileName) => ({ componentFileName, componentSlug: componentFileName.toLowerCase() }))
}

export function buildComponentExportCatalog(entries, componentSourceByFileName, metadataBySlug = new Map()) {
  const exportedSymbols = new Set()
  const symbolsByComponentSlug = new Map()
  const symbolMaturitiesByName = new Map()

  for (const entry of entries) {
    const componentSource = componentSourceByFileName.get(entry.componentFileName)
    if (!componentSource) continue

    const symbols = extractExportedSymbols(componentSource)
    symbolsByComponentSlug.set(entry.componentSlug, symbols)

    const maturity = metadataBySlug.get(entry.componentSlug)
    for (const symbol of symbols) {
      exportedSymbols.add(symbol)

      const maturities = symbolMaturitiesByName.get(symbol) ?? new Set()
      if (maturity) maturities.add(maturity)
      symbolMaturitiesByName.set(symbol, maturities)
    }
  }

  return {
    exportedSymbols,
    symbolsByComponentSlug,
    symbolMaturitiesByName,
  }
}

export async function collectComponentExportCatalog(indexPath, componentsDir, metadataBySlug = new Map()) {
  const indexSource = await readFile(indexPath, "utf8")
  const entries = parseComponentExportEntries(indexSource)
  const componentSourceByFileName = new Map()

  for (const entry of entries) {
    const componentPath = path.join(componentsDir, `${entry.componentFileName}.tsx`)
    const componentSource = await readFile(componentPath, "utf8")
    componentSourceByFileName.set(entry.componentFileName, componentSource)
  }

  return buildComponentExportCatalog(entries, componentSourceByFileName, metadataBySlug)
}

export async function collectEntryPointExportSymbols(entryPointPath) {
  const source = await readFile(entryPointPath, "utf8")
  return extractExportedSymbols(source)
}
