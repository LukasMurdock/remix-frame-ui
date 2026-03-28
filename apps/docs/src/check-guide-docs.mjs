import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { collectComponentExportCatalog, collectEntryPointExportSymbols } from "./component-export-catalog.js"
import { extractPackageImportGroups, packageImportPath } from "./component-doc-imports.js"
import { toComponentSlug } from "./component-doc-maturity.js"
import { guideOrder } from "./guide-config.js"
import {
  analyzeGuideImportPaths,
  analyzeGettingStartedNavigationSections,
  analyzeGettingStartedStableRecommendations,
  analyzeGuideImports,
  analyzeGuideSymbolImportsByPath,
  analyzeGuideDocs,
  extractGuideTitle,
} from "./guide-docs-validation.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..", "..", "..")
const guidesDir = path.join(__dirname, "..", "content", "guides")
const gettingStartedPath = path.join(guidesDir, "getting-started.md")
const componentIndexPath = path.join(repoRoot, "packages", "remix", "src", "index.ts")
const componentsDir = path.join(repoRoot, "packages", "remix", "src", "components")
const clientEntryPointPath = path.join(repoRoot, "packages", "remix", "src", "client", "index.ts")
const serverEntryPointPath = path.join(repoRoot, "packages", "remix", "src", "server", "index.ts")
const metadataPath = path.join(repoRoot, "packages", "remix", "src", "component-metadata.json")

const guideFiles = (await readdir(guidesDir)).filter((file) => file.endsWith(".md")).sort()
const guideSlugs = guideFiles.map((fileName) => fileName.replace(/\.md$/, ""))
const guideSources = new Map()
const guideTitleOccurrences = new Map()
const guidesMissingTitle = []

for (const fileName of guideFiles) {
  const source = await readFile(path.join(guidesDir, fileName), "utf8")
  const slug = fileName.replace(/\.md$/, "")

  guideSources.set(slug, source)

  const title = extractGuideTitle(source)
  if (!title) {
    guidesMissingTitle.push(fileName)
    continue
  }

  const existingFiles = guideTitleOccurrences.get(title) ?? []
  existingFiles.push(fileName)
  guideTitleOccurrences.set(title, existingFiles)
}

const duplicateGuideTitles = [...guideTitleOccurrences.entries()]
  .filter(([, files]) => files.length > 1)
  .map(([title, files]) => `${title}: ${files.join(", ")}`)

const gettingStartedSource = guideSources.get("getting-started") ?? (await readFile(gettingStartedPath, "utf8"))
const analysis = analyzeGuideDocs(guideSlugs, guideOrder, gettingStartedSource)
const navigationAnalysis = analyzeGettingStartedNavigationSections(gettingStartedSource, guideOrder)
const metadata = JSON.parse(await readFile(metadataPath, "utf8"))
const stableComponentNames = metadata
  .filter((entry) => String(entry.maturity).toLowerCase() === "stable")
  .map((entry) => entry.name)
const metadataBySlug = new Map(
  metadata.map((entry) => [toComponentSlug(entry.name), String(entry.maturity).toLowerCase()]),
)
const stableRecommendationAnalysis = analyzeGettingStartedStableRecommendations(
  gettingStartedSource,
  stableComponentNames,
)
const { exportedSymbols, symbolMaturitiesByName } = await collectComponentExportCatalog(
  componentIndexPath,
  componentsDir,
  metadataBySlug,
)
const clientExportedSymbols = await collectEntryPointExportSymbols(clientEntryPointPath)
const serverExportedSymbols = await collectEntryPointExportSymbols(serverEntryPointPath)
const guideImportGroupsBySlug = new Map(
  [...guideSources.entries()].map(([slug, source]) => [slug, extractPackageImportGroups(source)]),
)
const guideImportsBySlug = new Map(
  [...guideImportGroupsBySlug.entries()].map(([slug, groups]) => [slug, groups.get(packageImportPath) ?? []]),
)
const clientImportPath = `${packageImportPath}/client`
const serverImportPath = `${packageImportPath}/server`
const allowedGuideImportPaths = new Set([packageImportPath, clientImportPath, serverImportPath])
const guideImportPathAnalysis = analyzeGuideImportPaths(guideImportGroupsBySlug, allowedGuideImportPaths)
const exportedSymbolsByImportPath = new Map([
  [packageImportPath, exportedSymbols],
  [clientImportPath, clientExportedSymbols],
  [serverImportPath, serverExportedSymbols],
])
const guideSymbolImportAnalysis = analyzeGuideSymbolImportsByPath(guideImportGroupsBySlug, exportedSymbolsByImportPath)
const stableFirstGuideSlugs = guideOrder.slice(0, 4)
const guideImportAnalysis = analyzeGuideImports(
  guideImportsBySlug,
  exportedSymbols,
  stableFirstGuideSlugs,
  symbolMaturitiesByName,
)

if (
  analysis.duplicateGuideOrderEntries.length === 0 &&
  analysis.guidesMissingFromOrder.length === 0 &&
  analysis.orderEntriesMissingGuides.length === 0 &&
  analysis.guideOrderStartsWithGettingStarted &&
  analysis.gettingStartedInvalidReferences.length === 0 &&
  analysis.gettingStartedMissingReferences.length === 0 &&
  navigationAnalysis.hasQuickPathSection &&
  navigationAnalysis.hasReadFirstSection &&
  navigationAnalysis.quickPathInvalidReferences.length === 0 &&
  navigationAnalysis.readFirstInvalidReferences.length === 0 &&
  navigationAnalysis.quickPathMissingReferences.length === 0 &&
  navigationAnalysis.readFirstMissingReferences.length === 0 &&
  navigationAnalysis.quickPathUnexpectedReferences.length === 0 &&
  navigationAnalysis.readFirstUnexpectedReferences.length === 0 &&
  stableRecommendationAnalysis.hasStableRecommendationSection &&
  stableRecommendationAnalysis.missingStableComponents.length === 0 &&
  stableRecommendationAnalysis.unexpectedStableComponents.length === 0 &&
  stableRecommendationAnalysis.duplicateStableComponents.length === 0 &&
  guideImportPathAnalysis.unknownImportPathsByGuide.length === 0 &&
  guideSymbolImportAnalysis.unknownImportsByGuideAndPath.length === 0 &&
  guideImportAnalysis.nonStableImportsByGuide.length === 0 &&
  guidesMissingTitle.length === 0 &&
  duplicateGuideTitles.length === 0
) {
  console.log(`Guide coverage OK for ${guideFiles.length} guides.`)
  process.exit(0)
}

console.error("Guide docs check failed.")

if (analysis.duplicateGuideOrderEntries.length > 0) {
  console.error("\nDuplicate guide-order entries:")
  for (const slug of analysis.duplicateGuideOrderEntries) console.error(`- ${slug}`)
}

if (analysis.guidesMissingFromOrder.length > 0) {
  console.error("\nGuide files missing from guide order:")
  for (const slug of analysis.guidesMissingFromOrder) console.error(`- ${slug}.md`)
}

if (analysis.orderEntriesMissingGuides.length > 0) {
  console.error("\nGuide order entries missing files:")
  for (const slug of analysis.orderEntriesMissingGuides) console.error(`- ${slug}.md`)
}

if (!analysis.guideOrderStartsWithGettingStarted) {
  console.error("\nGuide order must start with getting-started.")
}

if (analysis.gettingStartedInvalidReferences.length > 0) {
  console.error("\nGetting Started has broken guide links:")
  for (const slug of analysis.gettingStartedInvalidReferences) console.error(`- #guide-${slug}`)
}

if (analysis.gettingStartedMissingReferences.length > 0) {
  console.error("\nGetting Started is missing links for ordered guides:")
  for (const slug of analysis.gettingStartedMissingReferences) console.error(`- #guide-${slug}`)
}

if (!navigationAnalysis.hasQuickPathSection) {
  console.error("\nGetting Started is missing the 5-minute path section.")
}

if (!navigationAnalysis.hasReadFirstSection) {
  console.error("\nGetting Started is missing the What to read first section.")
}

if (navigationAnalysis.quickPathInvalidReferences.length > 0) {
  console.error("\n5-minute path has invalid guide links:")
  for (const slug of navigationAnalysis.quickPathInvalidReferences) console.error(`- #guide-${slug}`)
}

if (navigationAnalysis.readFirstInvalidReferences.length > 0) {
  console.error("\nWhat to read first has invalid guide links:")
  for (const slug of navigationAnalysis.readFirstInvalidReferences) console.error(`- #guide-${slug}`)
}

if (navigationAnalysis.quickPathMissingReferences.length > 0) {
  console.error("\n5-minute path is missing expected guide links:")
  for (const slug of navigationAnalysis.quickPathMissingReferences) console.error(`- #guide-${slug}`)
}

if (navigationAnalysis.readFirstMissingReferences.length > 0) {
  console.error("\nWhat to read first is missing expected guide links:")
  for (const slug of navigationAnalysis.readFirstMissingReferences) console.error(`- #guide-${slug}`)
}

if (navigationAnalysis.quickPathUnexpectedReferences.length > 0) {
  console.error("\n5-minute path has unexpected guide links:")
  for (const slug of navigationAnalysis.quickPathUnexpectedReferences) console.error(`- #guide-${slug}`)
}

if (navigationAnalysis.readFirstUnexpectedReferences.length > 0) {
  console.error("\nWhat to read first has unexpected guide links:")
  for (const slug of navigationAnalysis.readFirstUnexpectedReferences) console.error(`- #guide-${slug}`)
}

if (!stableRecommendationAnalysis.hasStableRecommendationSection) {
  console.error("\nGetting Started is missing the Stable-first recommendation section.")
}

if (stableRecommendationAnalysis.missingStableComponents.length > 0) {
  console.error("\nStable-first recommendation is missing stable components:")
  for (const name of stableRecommendationAnalysis.missingStableComponents) console.error(`- ${name}`)
}

if (stableRecommendationAnalysis.unexpectedStableComponents.length > 0) {
  console.error("\nStable-first recommendation contains non-stable components:")
  for (const name of stableRecommendationAnalysis.unexpectedStableComponents) console.error(`- ${name}`)
}

if (stableRecommendationAnalysis.duplicateStableComponents.length > 0) {
  console.error("\nStable-first recommendation repeats component names:")
  for (const name of stableRecommendationAnalysis.duplicateStableComponents) console.error(`- ${name}`)
}

if (guideImportPathAnalysis.unknownImportPathsByGuide.length > 0) {
  console.error("\nGuides import unsupported package entrypoints:")
  for (const issue of guideImportPathAnalysis.unknownImportPathsByGuide) {
    console.error(`- ${issue.guideSlug}.md: ${issue.importPath}`)
  }
}

if (guideSymbolImportAnalysis.unknownImportsByGuideAndPath.length > 0) {
  console.error("\nGuides import unknown symbols for package entrypoints:")
  for (const issue of guideSymbolImportAnalysis.unknownImportsByGuideAndPath) {
    console.error(`- ${issue.guideSlug}.md (${issue.importPath}): ${issue.symbols.join(", ")}`)
  }
}

if (guideImportAnalysis.nonStableImportsByGuide.length > 0) {
  console.error("\nStable-first guides import non-stable symbols:")
  for (const issue of guideImportAnalysis.nonStableImportsByGuide) {
    console.error(`- ${issue.guideSlug}.md: ${issue.symbols.join(", ")}`)
  }
}

if (guidesMissingTitle.length > 0) {
  console.error("\nGuides missing title heading:")
  for (const fileName of guidesMissingTitle) console.error(`- ${fileName}`)
}

if (duplicateGuideTitles.length > 0) {
  console.error("\nDuplicate guide titles:")
  for (const issue of duplicateGuideTitles) console.error(`- ${issue}`)
}

process.exit(1)
