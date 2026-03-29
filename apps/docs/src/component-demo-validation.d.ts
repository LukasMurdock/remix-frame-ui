export type ComponentDemoCoverageAnalysis = {
  missingInRegistry: string[]
  extraInRegistry: string[]
  missingRuntimeIds: string[]
  missingRuntimeSources: string[]
  duplicateDemoIds: string[]
}

export function parseRuntimeDemoIds(source: string): Set<string>
export function analyzeComponentDemoCoverage(
  componentNames: string[],
  runtimeSource: string,
): ComponentDemoCoverageAnalysis
