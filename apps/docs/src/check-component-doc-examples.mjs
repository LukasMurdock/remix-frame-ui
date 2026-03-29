import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { analyzeComponentExample } from "./component-example-audit.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const contentDir = path.join(root, "content", "components")

const strictMode = process.argv.includes("--strict")
const jsonOutput = process.argv.includes("--json")

const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md")).sort()
const flagged = []

for (const file of files) {
  const source = await readFile(path.join(contentDir, file), "utf8")
  const analysis = analyzeComponentExample(source)
  if (analysis.issues.length === 0) continue

  flagged.push({
    file,
    issues: analysis.issues,
    codeBlockCount: analysis.codeBlockCount,
    typeScriptCodeBlockCount: analysis.typeScriptCodeBlockCount,
    snippetCount: analysis.snippetCount,
    exampleBody: summarizeBody(analysis.exampleBody),
  })
}

const report = {
  totalComponents: files.length,
  flaggedComponents: flagged.length,
  flagged,
}

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2))
} else {
  if (flagged.length === 0) {
    console.log(`Component examples look good for ${files.length} components.`)
  } else {
    console.error(`Component example audit found ${flagged.length} issues across ${files.length} components.`)
    console.error("\nComponents missing proper examples:")
    for (const entry of flagged) {
      console.error(`- ${entry.file}: ${entry.issues.join(" | ")}`)
    }
  }
}

if (strictMode && flagged.length > 0) {
  process.exit(1)
}

process.exit(0)

function summarizeBody(body) {
  const normalized = String(body).replace(/\s+/g, " ").trim()
  if (!normalized) return ""
  return normalized.length <= 160 ? normalized : `${normalized.slice(0, 157)}...`
}
