import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { analyzeComponentDemoParity } from "./component-demo-parity.js"
import { collectComponentExportCatalog } from "./component-export-catalog.js"
import { toComponentSlug } from "./component-doc-maturity.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const repoRoot = path.resolve(root, "..", "..")
const docsContentDir = path.join(root, "content", "components")
const buildDocsPath = path.join(root, "src", "build-docs.mjs")
const devDocsPath = path.join(root, "src", "dev-docs.js")
const runtimePath = path.join(root, "src", "docs-runtime.js")
const remixSrcDir = path.join(repoRoot, "packages", "remix", "src")
const remixIndexPath = path.join(remixSrcDir, "index.ts")
const componentsDir = path.join(remixSrcDir, "components")
const metadataPath = path.join(remixSrcDir, "component-metadata.json")

const files = (await readdir(docsContentDir)).filter((file) => file.endsWith(".md")).sort()
const componentNames = files.map((file) => file.replace(/\.md$/, ""))
const markdownByComponent = new Map(
  await Promise.all(
    componentNames.map(async (name) => [name, await readFile(path.join(docsContentDir, `${name}.md`), "utf8")]),
  ),
)

const metadata = JSON.parse(await readFile(metadataPath, "utf8"))
const metadataNameBySlug = new Map(metadata.map((entry) => [toComponentSlug(entry.name), entry.name]))
const { symbolsByComponentSlug } = await collectComponentExportCatalog(remixIndexPath, componentsDir)
const buildSource = await readFile(buildDocsPath, "utf8")
const devSource = await readFile(devDocsPath, "utf8")
const runtimeSource = await readFile(runtimePath, "utf8")

const issues = analyzeComponentDemoParity({
  componentNames,
  markdownByComponent,
  metadataNameBySlug,
  symbolsByComponentSlug,
  buildSource,
  devSource,
  runtimeSource,
  docsRuntimeSource: runtimeSource,
})

if (issues.length === 0) {
  console.log(`Demo parity OK for ${componentNames.length} components.`)
  process.exit(0)
}

console.error("Component demo parity check failed.")
for (const issue of issues) {
  console.error(`\n- ${issue.component}`)
  for (const detail of issue.details) {
    console.error(`  - ${detail}`)
  }
}

process.exit(1)
