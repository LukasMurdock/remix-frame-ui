export type ComponentDemoCoverageAnalysis = {
  missingInRegistry: string[]
  extraInRegistry: string[]
  missingDemoDirs: string[]
  missingEntryFiles: string[]
  missingIndexFiles: string[]
  duplicateDemoIds: string[]
  extraDemoDirs: string[]
}

export function analyzeComponentDemoCoverage(
  componentNames: string[],
  demosById: Map<string, Set<string>>,
  demosRootDirs: Set<string>,
): ComponentDemoCoverageAnalysis
