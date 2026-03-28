import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  extractMaturityLabel,
  extractPlatformLabel,
  extractTitle,
  normalizePlatformLabel,
  toComponentSlug,
  validMaturityLabels,
  validPlatformLabels,
} from "./component-doc-maturity.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..", "..", "..")
const docsDir = path.join(__dirname, "..", "content", "components")
const metadataPath = path.join(repoRoot, "packages", "remix", "src", "component-metadata.json")

const docsFiles = (await readdir(docsDir)).filter((file) => file.endsWith(".md")).sort()
const metadataEntries = JSON.parse(await readFile(metadataPath, "utf8"))

const metadataBySlug = new Map()
const duplicateMetadataEntries = []
const metadataWithInvalidMaturity = []
const metadataWithInvalidPlatform = []

for (const entry of metadataEntries) {
  const slug = toComponentSlug(entry.name)
  const maturity = String(entry.maturity).toLowerCase()
  const platform = normalizePlatformLabel(entry.platform)

  if (!validMaturityLabels.has(maturity)) {
    metadataWithInvalidMaturity.push(`${entry.name}: ${entry.maturity}`)
  }

  if (!validPlatformLabels.has(platform)) {
    metadataWithInvalidPlatform.push(`${entry.name}: ${entry.platform}`)
  }

  if (metadataBySlug.has(slug)) {
    duplicateMetadataEntries.push(entry.name)
    continue
  }

  metadataBySlug.set(slug, { name: entry.name, maturity, platform })
}

const docsSlugs = docsFiles.map((fileName) => fileName.replace(/\.md$/, ""))
const docsSlugSet = new Set(docsSlugs)

const missingDocs = [...metadataBySlug.keys()].filter((slug) => !docsSlugSet.has(slug)).sort()
const extraDocs = docsSlugs.filter((slug) => !metadataBySlug.has(slug)).sort()
const docsMissingTitle = []
const docsWithMismatchedTitle = []
const docsMissingMaturityLine = []
const docsWithInvalidMaturity = []
const docsWithMismatchedMaturity = []
const docsWithInvalidPlatform = []
const docsWithMismatchedPlatform = []

for (const fileName of docsFiles) {
  const slug = fileName.replace(/\.md$/, "")
  const metadataEntry = metadataBySlug.get(slug)
  if (!metadataEntry) continue

  const expectedName = metadataEntry.name
  const expectedMaturity = metadataEntry.maturity
  const expectedPlatform = metadataEntry.platform

  const source = await readFile(path.join(docsDir, fileName), "utf8")
  const actualTitle = extractTitle(source)

  if (!actualTitle) {
    docsMissingTitle.push(fileName)
  } else if (actualTitle !== expectedName) {
    docsWithMismatchedTitle.push(`${fileName}: expected ${expectedName}, found ${actualTitle}`)
  }

  const actualMaturity = extractMaturityLabel(source)

  if (!actualMaturity) {
    docsMissingMaturityLine.push(fileName)
    continue
  }

  if (!validMaturityLabels.has(actualMaturity)) {
    docsWithInvalidMaturity.push(`${fileName}: ${actualMaturity}`)
    continue
  }

  if (actualMaturity !== expectedMaturity) {
    docsWithMismatchedMaturity.push(`${fileName}: expected ${expectedMaturity}, found ${actualMaturity}`)
  }

  const actualPlatform = extractPlatformLabel(source)
  if (!actualPlatform) continue

  if (!validPlatformLabels.has(actualPlatform)) {
    docsWithInvalidPlatform.push(`${fileName}: ${actualPlatform}`)
    continue
  }

  if (actualPlatform !== expectedPlatform) {
    docsWithMismatchedPlatform.push(`${fileName}: expected ${expectedPlatform}, found ${actualPlatform}`)
  }
}

if (
  duplicateMetadataEntries.length === 0 &&
  metadataWithInvalidMaturity.length === 0 &&
  metadataWithInvalidPlatform.length === 0 &&
  missingDocs.length === 0 &&
  extraDocs.length === 0 &&
  docsMissingTitle.length === 0 &&
  docsWithMismatchedTitle.length === 0 &&
  docsMissingMaturityLine.length === 0 &&
  docsWithInvalidMaturity.length === 0 &&
  docsWithMismatchedMaturity.length === 0 &&
  docsWithInvalidPlatform.length === 0 &&
  docsWithMismatchedPlatform.length === 0
) {
  console.log(`Component metadata coverage OK for ${docsFiles.length} components.`)
  process.exit(0)
}

console.error("Component docs maturity check failed.")

if (duplicateMetadataEntries.length > 0) {
  console.error("\nDuplicate component metadata entries:")
  for (const name of duplicateMetadataEntries) console.error(`- ${name}`)
}

if (metadataWithInvalidMaturity.length > 0) {
  console.error("\nMetadata entries with invalid maturity labels:")
  for (const issue of metadataWithInvalidMaturity) console.error(`- ${issue}`)
}

if (metadataWithInvalidPlatform.length > 0) {
  console.error("\nMetadata entries with invalid platform labels:")
  for (const issue of metadataWithInvalidPlatform) console.error(`- ${issue}`)
}

if (missingDocs.length > 0) {
  console.error("\nMetadata entries missing docs pages:")
  for (const slug of missingDocs) console.error(`- ${slug}.md`)
}

if (extraDocs.length > 0) {
  console.error("\nDocs pages missing metadata entries:")
  for (const slug of extraDocs) console.error(`- ${slug}.md`)
}

if (docsMissingTitle.length > 0) {
  console.error("\nDocs pages missing title heading:")
  for (const fileName of docsMissingTitle) console.error(`- ${fileName}`)
}

if (docsWithMismatchedTitle.length > 0) {
  console.error("\nDocs pages with title values that differ from metadata:")
  for (const issue of docsWithMismatchedTitle) console.error(`- ${issue}`)
}

if (docsMissingMaturityLine.length > 0) {
  console.error("\nDocs pages missing maturity line:")
  for (const fileName of docsMissingMaturityLine) console.error(`- ${fileName}`)
}

if (docsWithInvalidMaturity.length > 0) {
  console.error("\nDocs pages with invalid maturity labels:")
  for (const issue of docsWithInvalidMaturity) console.error(`- ${issue}`)
}

if (docsWithMismatchedMaturity.length > 0) {
  console.error("\nDocs pages with maturity values that differ from metadata:")
  for (const issue of docsWithMismatchedMaturity) console.error(`- ${issue}`)
}

if (docsWithInvalidPlatform.length > 0) {
  console.error("\nDocs pages with invalid platform labels:")
  for (const issue of docsWithInvalidPlatform) console.error(`- ${issue}`)
}

if (docsWithMismatchedPlatform.length > 0) {
  console.error("\nDocs pages with platform values that differ from metadata:")
  for (const issue of docsWithMismatchedPlatform) console.error(`- ${issue}`)
}

process.exit(1)
