export type ComponentDemoParity = {
  codeIncludes?: string[]
  codeExcludes?: string[]
  previewIncludes?: string[]
  sharedIncludes?: string[]
}

export type ComponentDemoEntry = {
  id: string
  title: string
  parity?: ComponentDemoParity
}

export const componentDemoEntries: [string, ComponentDemoEntry][]
export const demoByComponent: Map<string, ComponentDemoEntry>
export const demoIds: Set<string>
