import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { collectComponentExportCatalog } from "./component-export-catalog.js"
import { hasOwnComponentImport, parseImportedSymbols } from "./component-doc-imports.js"
import { toComponentSlug } from "./component-doc-maturity.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..", "..", "..")
const docsContentDir = path.join(__dirname, "..", "content", "components")
const remixSrcDir = path.join(repoRoot, "packages", "remix", "src")
const remixIndexPath = path.join(remixSrcDir, "index.ts")
const componentsDir = path.join(remixSrcDir, "components")
const metadataPath = path.join(remixSrcDir, "component-metadata.json")

const docsFiles = (await readdir(docsContentDir)).filter((file) => file.endsWith(".md")).sort()

const metadata = JSON.parse(await readFile(metadataPath, "utf8"))
const metadataNameBySlug = new Map(metadata.map((entry) => [toComponentSlug(entry.name), entry.name]))
const { exportedSymbols, symbolsByComponentSlug } = await collectComponentExportCatalog(remixIndexPath, componentsDir)

const docsWithMissingImportBlocks = []
const docsWithUnknownImports = []
const docsWithoutOwnComponentImports = []

for (const fileName of docsFiles) {
  const docPath = path.join(docsContentDir, fileName)
  const slug = fileName.replace(/\.md$/, "")
  const source = await readFile(docPath, "utf8")
  const importedSymbols = parseImportedSymbols(source)

  if (importedSymbols === null) {
    docsWithMissingImportBlocks.push(fileName)
    continue
  }

  const unknownSymbols = importedSymbols.filter((symbol) => !exportedSymbols.has(symbol))
  if (unknownSymbols.length > 0) {
    docsWithUnknownImports.push(`${fileName}: ${unknownSymbols.join(", ")}`)
  }

  const ownSymbols = symbolsByComponentSlug.get(slug) ?? new Set()
  const componentName = metadataNameBySlug.get(slug)
  if (!hasOwnComponentImport(importedSymbols, ownSymbols, componentName)) {
    docsWithoutOwnComponentImports.push(fileName)
  }
}

if (
  docsWithMissingImportBlocks.length === 0 &&
  docsWithUnknownImports.length === 0 &&
  docsWithoutOwnComponentImports.length === 0
) {
  console.log(`Import coverage OK for ${docsFiles.length} components.`)
  process.exit(0)
}

console.error("Component docs import check failed.")

if (docsWithMissingImportBlocks.length > 0) {
  console.error("\nMissing or invalid Import blocks:")
  for (const entry of docsWithMissingImportBlocks) console.error(`- ${entry}`)
}

if (docsWithUnknownImports.length > 0) {
  console.error("\nImport block references unknown exports:")
  for (const entry of docsWithUnknownImports) console.error(`- ${entry}`)
}

if (docsWithoutOwnComponentImports.length > 0) {
  console.error("\nImport block is missing documented component symbols:")
  for (const entry of docsWithoutOwnComponentImports) console.error(`- ${entry}`)
}

process.exit(1)
