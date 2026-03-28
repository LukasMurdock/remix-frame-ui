export function parseComponentToDemoIdMap(source: string): Map<string, string>
export function parseRuntimeDemoIds(source: string): Set<string>

export type ComponentDemoCoverageResult = {
  missingInBuild: string[]
  missingInDev: string[]
  extraInBuild: string[]
  extraInDev: string[]
  mismatchedBuildVsDev: string[]
  missingRuntimeIds: string[]
  duplicateBuildDemoIds: string[]
  duplicateDevDemoIds: string[]
}

export function analyzeComponentDemoCoverage(
  componentNames: string[],
  buildSource: string,
  devSource: string,
  runtimeSource: string,
): ComponentDemoCoverageResult
