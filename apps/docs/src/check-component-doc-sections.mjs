import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { analyzeComponentDoc } from "./component-doc-sections.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const contentDir = path.join(root, "content", "components")

const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md")).sort()

const missingSectionsByFile = new Map()
const emptySectionsByFile = new Map()
const outOfOrderSectionsByFile = new Map()
const placeholderPhrasesByFile = new Map()
const apiSectionIssuesByFile = new Map()

for (const file of files) {
  const source = await readFile(path.join(contentDir, file), "utf8")
  const analysis = analyzeComponentDoc(source)

  if (analysis.missingSections.length > 0) {
    missingSectionsByFile.set(file, analysis.missingSections)
    continue
  }

  if (analysis.emptySections.length > 0) {
    emptySectionsByFile.set(file, analysis.emptySections)
  }

  if (analysis.outOfOrderSections.length > 0) {
    outOfOrderSectionsByFile.set(file, analysis.outOfOrderSections)
  }

  if (analysis.placeholderPhrases.length > 0) {
    placeholderPhrasesByFile.set(file, analysis.placeholderPhrases)
  }

  if (analysis.apiIssues.length > 0) {
    apiSectionIssuesByFile.set(file, analysis.apiIssues)
  }
}

if (
  missingSectionsByFile.size === 0 &&
  emptySectionsByFile.size === 0 &&
  outOfOrderSectionsByFile.size === 0 &&
  placeholderPhrasesByFile.size === 0 &&
  apiSectionIssuesByFile.size === 0
) {
  console.log(`Section completeness and API coverage OK for ${files.length} components.`)
  process.exit(0)
}

console.error("Component docs section check failed.")

if (missingSectionsByFile.size > 0) {
  console.error("\nMissing sections:")
  for (const [file, sections] of missingSectionsByFile.entries()) {
    console.error(`- ${file}: ${sections.join(", ")}`)
  }
}

if (emptySectionsByFile.size > 0) {
  console.error("\nEmpty sections:")
  for (const [file, sections] of emptySectionsByFile.entries()) {
    console.error(`- ${file}: ${sections.join(", ")}`)
  }
}

if (outOfOrderSectionsByFile.size > 0) {
  console.error("\nOut-of-order sections:")
  for (const [file, sectionPairs] of outOfOrderSectionsByFile.entries()) {
    console.error(`- ${file}: ${sectionPairs.join(", ")}`)
  }
}

if (placeholderPhrasesByFile.size > 0) {
  console.error("\nPlaceholder copy still present:")
  for (const [file, phrases] of placeholderPhrasesByFile.entries()) {
    console.error(`- ${file}: ${phrases.join(" | ")}`)
  }
}

if (apiSectionIssuesByFile.size > 0) {
  console.error("\nAPI section issues:")
  for (const [file, issues] of apiSectionIssuesByFile.entries()) {
    console.error(`- ${file}: ${issues.join(" | ")}`)
  }
}

process.exit(1)
