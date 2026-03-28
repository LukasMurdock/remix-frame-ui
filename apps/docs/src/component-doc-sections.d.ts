export type ComponentDocAnalysis = {
  missingSections: string[]
  emptySections: string[]
  outOfOrderSections: string[]
  placeholderPhrases: string[]
  apiIssues: string[]
}

export const requiredSections: string[]
export const disallowedPlaceholderPhrases: string[]
export const generatedApiNotice: string

export function analyzeComponentDoc(source: string): ComponentDocAnalysis
