export type GuideDocsValidationResult = {
  duplicateGuideOrderEntries: string[]
  guidesMissingFromOrder: string[]
  orderEntriesMissingGuides: string[]
  guideOrderStartsWithGettingStarted: boolean
  gettingStartedInvalidReferences: string[]
  gettingStartedMissingReferences: string[]
}

export type GuideImportIssue = {
  guideSlug: string
  symbols: string[]
}

export type GuideImportPathIssue = {
  guideSlug: string
  importPath: string
}

export type GuideImportPathSymbolIssue = {
  guideSlug: string
  importPath: string
  symbols: string[]
}

export type GuideImportValidationResult = {
  unknownImportsByGuide: GuideImportIssue[]
  nonStableImportsByGuide: GuideImportIssue[]
}

export type GuideImportPathValidationResult = {
  unknownImportPathsByGuide: GuideImportPathIssue[]
}

export type GuideImportPathSymbolValidationResult = {
  unknownImportsByGuideAndPath: GuideImportPathSymbolIssue[]
}

export type StableRecommendationValidationResult = {
  hasStableRecommendationSection: boolean
  listedStableComponents: string[]
  missingStableComponents: string[]
  unexpectedStableComponents: string[]
  duplicateStableComponents: string[]
}

export type GettingStartedNavigationValidationResult = {
  hasQuickPathSection: boolean
  hasReadFirstSection: boolean
  quickPathInvalidReferences: string[]
  readFirstInvalidReferences: string[]
  quickPathMissingReferences: string[]
  readFirstMissingReferences: string[]
  quickPathUnexpectedReferences: string[]
  readFirstUnexpectedReferences: string[]
}

export function analyzeGuideDocs(
  guideSlugs: string[],
  orderedGuideSlugs: string[],
  gettingStartedSource: string,
): GuideDocsValidationResult

export function analyzeGuideImports(
  importsByGuideSlug: Map<string, string[]>,
  exportedSymbols: Set<string>,
  stableFirstGuideSlugs: string[],
  symbolMaturitiesByName: Map<string, Set<string>>,
): GuideImportValidationResult

export function analyzeGuideImportPaths(
  importGroupsByGuideSlug: Map<string, Map<string, string[]>>,
  allowedImportPaths: Set<string>,
): GuideImportPathValidationResult

export function analyzeGuideSymbolImportsByPath(
  importGroupsByGuideSlug: Map<string, Map<string, string[]>>,
  exportedSymbolsByImportPath: Map<string, Set<string>>,
): GuideImportPathSymbolValidationResult

export function analyzeGettingStartedStableRecommendations(
  gettingStartedSource: string,
  stableComponentNames: string[],
): StableRecommendationValidationResult

export function analyzeGettingStartedNavigationSections(
  gettingStartedSource: string,
  orderedGuideSlugs: string[],
): GettingStartedNavigationValidationResult

export function extractGuideTitle(source: string): string | null
