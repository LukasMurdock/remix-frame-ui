import { readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { analyzeComponentDemoCoverage } from "./component-demo-validation.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const contentDir = path.join(root, "content", "components")
const demosDir = path.join(root, "demos")

const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md"))
const componentNames = files.map((file) => file.replace(/\.md$/, "")).sort()

const demoEntries = await readdir(demosDir, { withFileTypes: true })
const demoDirs = demoEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const demosById = new Map(
  await Promise.all(
    demoDirs.map(async (demoId) => {
      const filesInDemo = await readdir(path.join(demosDir, demoId), { withFileTypes: true })
      return [demoId, new Set(filesInDemo.filter((entry) => entry.isFile()).map((entry) => entry.name))]
    }),
  ),
)

const analysis = analyzeComponentDemoCoverage(componentNames, demosById, new Set(demoDirs))

if (
  analysis.missingInRegistry.length === 0 &&
  analysis.extraInRegistry.length === 0 &&
  analysis.missingDemoDirs.length === 0 &&
  analysis.missingEntryFiles.length === 0 &&
  analysis.missingIndexFiles.length === 0 &&
  analysis.duplicateDemoIds.length === 0 &&
  analysis.extraDemoDirs.length === 0
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

if (analysis.missingDemoDirs.length > 0) {
  console.error("\nMapped demo IDs missing a demos/<id> directory:")
  for (const entry of analysis.missingDemoDirs) console.error(`- ${entry}`)
}

if (analysis.missingEntryFiles.length > 0) {
  console.error("\nMapped demo IDs missing demos/<id>/entry.tsx:")
  for (const entry of analysis.missingEntryFiles) console.error(`- ${entry}`)
}

if (analysis.missingIndexFiles.length > 0) {
  console.error("\nMapped demo IDs missing demos/<id>/index.html:")
  for (const entry of analysis.missingIndexFiles) console.error(`- ${entry}`)
}

if (analysis.duplicateDemoIds.length > 0) {
  console.error("\nDuplicate demo IDs in component-demo-registry.js:")
  for (const entry of analysis.duplicateDemoIds) console.error(`- ${entry}`)
}

if (analysis.extraDemoDirs.length > 0) {
  console.error("\nDemo directories without a component-demo-registry.js mapping:")
  for (const entry of analysis.extraDemoDirs) console.error(`- ${entry}`)
}

process.exit(1)
