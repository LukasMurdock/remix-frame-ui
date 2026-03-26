import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

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

const buildDemoMap = parseComponentToDemoIdMap(buildSource)
const devDemoMap = parseComponentToDemoIdMap(devSource)
const runtimeDemoIds = parseRuntimeDemoIds(runtimeSource)

const missingInBuild = []
const missingInDev = []
const missingRuntimeIds = []

for (const componentName of componentNames) {
  const buildDemoId = buildDemoMap.get(componentName)
  const devDemoId = devDemoMap.get(componentName)

  if (!buildDemoId) missingInBuild.push(componentName)
  if (!devDemoId) missingInDev.push(componentName)

  if (buildDemoId && !runtimeDemoIds.has(buildDemoId)) {
    missingRuntimeIds.push(`build-docs: ${componentName} -> ${buildDemoId}`)
  }

  if (devDemoId && !runtimeDemoIds.has(devDemoId)) {
    missingRuntimeIds.push(`dev-docs: ${componentName} -> ${devDemoId}`)
  }
}

if (missingInBuild.length === 0 && missingInDev.length === 0 && missingRuntimeIds.length === 0) {
  console.log(`Demo coverage OK for ${componentNames.length} components.`)
  process.exit(0)
}

console.error("Demo coverage check failed.")

if (missingInBuild.length > 0) {
  console.error("\nMissing demo mapping in build-docs.mjs:")
  for (const name of missingInBuild) console.error(`- ${name}`)
}

if (missingInDev.length > 0) {
  console.error("\nMissing demo mapping in dev-docs.js:")
  for (const name of missingInDev) console.error(`- ${name}`)
}

if (missingRuntimeIds.length > 0) {
  console.error("\nMapped demo IDs missing in docs-runtime.js registry:")
  for (const entry of missingRuntimeIds) console.error(`- ${entry}`)
}

process.exit(1)

function parseComponentToDemoIdMap(source) {
  const map = new Map()
  const regex = /\["([a-z0-9-]+)",\s*\{\s*id:\s*"([a-z0-9-]+)"/g

  for (const match of source.matchAll(regex)) {
    const key = match[1]
    const id = match[2]
    map.set(key, id)
  }

  return map
}

function parseRuntimeDemoIds(source) {
  const ids = new Set()
  const regex = /"([a-z0-9-]+)":\s*mount[A-Za-z0-9]+/g

  for (const match of source.matchAll(regex)) {
    ids.add(match[1])
  }

  return ids
}
