import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { analyzeComponentDemoCoverage } from "./component-demo-validation.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const contentDir = path.join(root, "content", "components")
const runtimePath = path.join(root, "src", "docs-runtime.js")

const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md"))
const componentNames = files.map((file) => file.replace(/\.md$/, "")).sort()

const runtimeSource = await readFile(runtimePath, "utf8")

const analysis = analyzeComponentDemoCoverage(componentNames, runtimeSource)

if (
  analysis.missingInRegistry.length === 0 &&
  analysis.extraInRegistry.length === 0 &&
  analysis.missingRuntimeIds.length === 0 &&
  analysis.missingRuntimeSources.length === 0 &&
  analysis.duplicateDemoIds.length === 0
) {
  console.log(`Demo coverage OK for ${componentNames.length} components.`)
  process.exit(0)
}

console.error("Demo coverage check failed.")

if (analysis.missingInRegistry.length > 0) {
  console.error("\nMissing demo mapping in component-demo-registry.js:")
  for (const name of analysis.missingInRegistry) console.error(`- ${name}`)
}

if (analysis.extraInRegistry.length > 0) {
  console.error("\nExtra demo mapping in component-demo-registry.js:")
  for (const name of analysis.extraInRegistry) console.error(`- ${name}`)
}

if (analysis.missingRuntimeIds.length > 0) {
  console.error("\nMapped demo IDs missing in docs-runtime.js registry:")
  for (const entry of analysis.missingRuntimeIds) console.error(`- ${entry}`)
}

if (analysis.missingRuntimeSources.length > 0) {
  console.error("\nMapped demo IDs missing extractable source in docs-runtime.js:")
  for (const entry of analysis.missingRuntimeSources) console.error(`- ${entry}`)
}

if (analysis.duplicateDemoIds.length > 0) {
  console.error("\nDuplicate demo IDs in component-demo-registry.js:")
  for (const entry of analysis.duplicateDemoIds) console.error(`- ${entry}`)
}

process.exit(1)
