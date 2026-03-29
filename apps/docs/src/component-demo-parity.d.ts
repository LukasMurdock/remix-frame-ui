export type ComponentDemoParityIssue = {
  component: string
  details: string[]
}

export function analyzeComponentDemoParity(args: {
  componentNames: string[]
  markdownByComponent: Map<string, string>
  metadataNameBySlug: Map<string, string>
  symbolsByComponentSlug: Map<string, Set<string>>
  runtimeSource: string
  buildSource?: string
  devSource?: string
  docsRuntimeSource?: string
}): ComponentDemoParityIssue[]
