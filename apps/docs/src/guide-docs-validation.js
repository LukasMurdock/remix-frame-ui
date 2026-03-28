export function analyzeGuideDocs(guideSlugs, orderedGuideSlugs, gettingStartedSource) {
  const guideSlugSet = new Set(guideSlugs)
  const guideOrderSet = new Set(orderedGuideSlugs)

  const duplicateGuideOrderEntries = orderedGuideSlugs.filter(
    (slug, index) => orderedGuideSlugs.indexOf(slug) !== index,
  )
  const guidesMissingFromOrder = guideSlugs.filter((slug) => !guideOrderSet.has(slug)).sort()
  const orderEntriesMissingGuides = orderedGuideSlugs.filter((slug) => !guideSlugSet.has(slug)).sort()

  const referencedGuideSlugs = [...gettingStartedSource.matchAll(/\(#guide-([a-z0-9-]+)\)/g)].map((match) => match[1])
  const referencedGuideSlugSet = new Set(referencedGuideSlugs)

  const gettingStartedInvalidReferences = [...referencedGuideSlugSet].filter((slug) => !guideSlugSet.has(slug)).sort()
  const expectedGuideReferences = orderedGuideSlugs.filter((slug) => slug !== "getting-started")
  const gettingStartedMissingReferences = expectedGuideReferences
    .filter((slug) => !referencedGuideSlugSet.has(slug))
    .sort()
  const guideOrderStartsWithGettingStarted = orderedGuideSlugs[0] === "getting-started"

  return {
    duplicateGuideOrderEntries,
    guidesMissingFromOrder,
    orderEntriesMissingGuides,
    guideOrderStartsWithGettingStarted,
    gettingStartedInvalidReferences,
    gettingStartedMissingReferences,
  }
}

export function analyzeGuideImports(
  importsByGuideSlug,
  exportedSymbols,
  stableFirstGuideSlugs,
  symbolMaturitiesByName,
) {
  const unknownImportsByGuide = []
  const nonStableImportsByGuide = []

  for (const [guideSlug, importedSymbols] of importsByGuideSlug.entries()) {
    const uniqueImportedSymbols = [...new Set(importedSymbols)]
    const unknownSymbols = uniqueImportedSymbols.filter((symbol) => !exportedSymbols.has(symbol)).sort()

    if (unknownSymbols.length > 0) {
      unknownImportsByGuide.push({ guideSlug, symbols: unknownSymbols })
    }

    if (!stableFirstGuideSlugs.includes(guideSlug)) continue

    const nonStableSymbols = uniqueImportedSymbols
      .filter((symbol) => {
        const maturities = symbolMaturitiesByName.get(symbol)
        if (!maturities || maturities.size === 0) return false
        return [...maturities].some((maturity) => maturity !== "stable")
      })
      .sort()

    if (nonStableSymbols.length > 0) {
      nonStableImportsByGuide.push({ guideSlug, symbols: nonStableSymbols })
    }
  }

  return {
    unknownImportsByGuide,
    nonStableImportsByGuide,
  }
}

export function analyzeGuideImportPaths(importGroupsByGuideSlug, allowedImportPaths) {
  const unknownImportPathsByGuide = []

  for (const [guideSlug, symbolsByImportPath] of importGroupsByGuideSlug.entries()) {
    for (const importPath of symbolsByImportPath.keys()) {
      if (!allowedImportPaths.has(importPath)) {
        unknownImportPathsByGuide.push({ guideSlug, importPath })
      }
    }
  }

  return {
    unknownImportPathsByGuide,
  }
}

export function analyzeGuideSymbolImportsByPath(importGroupsByGuideSlug, exportedSymbolsByImportPath) {
  const unknownImportsByGuideAndPath = []

  for (const [guideSlug, symbolsByImportPath] of importGroupsByGuideSlug.entries()) {
    for (const [importPath, importedSymbols] of symbolsByImportPath.entries()) {
      const exportedSymbols = exportedSymbolsByImportPath.get(importPath)
      if (!exportedSymbols) continue

      const unknownSymbols = [...new Set(importedSymbols)].filter((symbol) => !exportedSymbols.has(symbol)).sort()
      if (unknownSymbols.length === 0) continue

      unknownImportsByGuideAndPath.push({ guideSlug, importPath, symbols: unknownSymbols })
    }
  }

  return {
    unknownImportsByGuideAndPath,
  }
}

export function analyzeGettingStartedStableRecommendations(gettingStartedSource, stableComponentNames) {
  const sectionBody = readSectionBody(gettingStartedSource, "## Stable-first recommendation")
  const listedStableComponents = [...sectionBody.matchAll(/-\s+`([^`]+)`/g)].map((match) => match[1].trim())

  const stableSet = new Set(stableComponentNames)
  const listedSet = new Set(listedStableComponents)

  const missingStableComponents = [...stableSet].filter((name) => !listedSet.has(name)).sort()
  const unexpectedStableComponents = [...listedSet].filter((name) => !stableSet.has(name)).sort()
  const duplicateStableComponents = listedStableComponents.filter(
    (name, index) => listedStableComponents.indexOf(name) !== index,
  )

  return {
    hasStableRecommendationSection: sectionBody.length > 0,
    listedStableComponents,
    missingStableComponents,
    unexpectedStableComponents,
    duplicateStableComponents,
  }
}

export function analyzeGettingStartedNavigationSections(gettingStartedSource, orderedGuideSlugs) {
  const allOrderedGuides = orderedGuideSlugs.filter((slug) => slug !== "getting-started")
  const expectedQuickPathGuides = allOrderedGuides.slice(0, 3)
  const guideSlugSet = new Set(orderedGuideSlugs)

  const quickPathSectionBody = readSectionBody(gettingStartedSource, "## 5-minute path")
  const readFirstSectionBody = readSectionBody(gettingStartedSource, "## What to read first")

  const quickPathReferences = extractGuideReferences(quickPathSectionBody)
  const readFirstReferences = extractGuideReferences(readFirstSectionBody)

  return {
    hasQuickPathSection: quickPathSectionBody.length > 0,
    hasReadFirstSection: readFirstSectionBody.length > 0,
    quickPathInvalidReferences: quickPathReferences.filter((slug) => !guideSlugSet.has(slug)).sort(),
    readFirstInvalidReferences: readFirstReferences.filter((slug) => !guideSlugSet.has(slug)).sort(),
    quickPathMissingReferences: expectedQuickPathGuides.filter((slug) => !quickPathReferences.includes(slug)).sort(),
    readFirstMissingReferences: allOrderedGuides.filter((slug) => !readFirstReferences.includes(slug)).sort(),
    quickPathUnexpectedReferences: quickPathReferences.filter((slug) => !expectedQuickPathGuides.includes(slug)).sort(),
    readFirstUnexpectedReferences: readFirstReferences.filter((slug) => !allOrderedGuides.includes(slug)).sort(),
  }
}

export function extractGuideTitle(source) {
  const match = source.match(/^#\s+(.+)$/m)
  if (!match || !match[1]) return null
  return match[1].trim()
}

function readSectionBody(source, heading) {
  const headingIndex = source.indexOf(heading)
  if (headingIndex < 0) return ""

  const bodyStart = headingIndex + heading.length
  const rest = source.slice(bodyStart)
  const nextHeadingMatch = /\n##\s+/.exec(rest)
  const bodyEnd = nextHeadingMatch ? bodyStart + nextHeadingMatch.index : source.length

  return source.slice(bodyStart, bodyEnd).trim()
}

function extractGuideReferences(source) {
  if (!source) return []
  return [...source.matchAll(/\(#guide-([a-z0-9-]+)\)/g)].map((match) => match[1])
}
