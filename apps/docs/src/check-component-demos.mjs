import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { analyzeComponentDemoCoverage } from "./component-demo-validation.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const contentDir = path.join(root, "content", "components")
const buildDocsPath = path.join(root, "src", "build-docs.mjs")
const devDocsPath = path.join(root, "src", "dev-docs.js")
const runtimePath = path.join(root, "src", "docs-runtime.js")

const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md"))
const componentNames = files.map((file) => file.replace(/\.md$/, "")).sort()

const buildSource = await readFile(buildDocsPath, "utf8")
const devSource = await readFile(devDocsPath, "utf8")
const runtimeSource = await readFile(runtimePath, "utf8")

const analysis = analyzeComponentDemoCoverage(componentNames, buildSource, devSource, runtimeSource)

if (
  analysis.missingInBuild.length === 0 &&
  analysis.missingInDev.length === 0 &&
  analysis.extraInBuild.length === 0 &&
  analysis.extraInDev.length === 0 &&
  analysis.mismatchedBuildVsDev.length === 0 &&
  analysis.missingRuntimeIds.length === 0 &&
  analysis.duplicateBuildDemoIds.length === 0 &&
  analysis.duplicateDevDemoIds.length === 0
) {
  console.log(`Demo coverage OK for ${componentNames.length} components.`)
  process.exit(0)
}

console.error("Demo coverage check failed.")

if (analysis.missingInBuild.length > 0) {
  console.error("\nMissing demo mapping in build-docs.mjs:")
  for (const name of analysis.missingInBuild) console.error(`- ${name}`)
}

if (analysis.missingInDev.length > 0) {
  console.error("\nMissing demo mapping in dev-docs.js:")
  for (const name of analysis.missingInDev) console.error(`- ${name}`)
}

if (analysis.extraInBuild.length > 0) {
  console.error("\nExtra demo mapping in build-docs.mjs:")
  for (const name of analysis.extraInBuild) console.error(`- ${name}`)
}

if (analysis.extraInDev.length > 0) {
  console.error("\nExtra demo mapping in dev-docs.js:")
  for (const name of analysis.extraInDev) console.error(`- ${name}`)
}

if (analysis.mismatchedBuildVsDev.length > 0) {
  console.error("\nDemo IDs differ between build-docs.mjs and dev-docs.js:")
  for (const entry of analysis.mismatchedBuildVsDev) console.error(`- ${entry}`)
}

if (analysis.missingRuntimeIds.length > 0) {
  console.error("\nMapped demo IDs missing in docs-runtime.js registry:")
  for (const entry of analysis.missingRuntimeIds) console.error(`- ${entry}`)
}

if (analysis.duplicateBuildDemoIds.length > 0) {
  console.error("\nDuplicate demo IDs in build-docs.mjs:")
  for (const entry of analysis.duplicateBuildDemoIds) console.error(`- ${entry}`)
}

if (analysis.duplicateDevDemoIds.length > 0) {
  console.error("\nDuplicate demo IDs in dev-docs.js:")
  for (const entry of analysis.duplicateDevDemoIds) console.error(`- ${entry}`)
}

process.exit(1)
