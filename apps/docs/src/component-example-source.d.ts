export type ComponentExampleSnippet = {
  title: string | null
  language: string
  code: string
}

export function extractComponentExampleSnippets(markdown: string): ComponentExampleSnippet[]
export function stripTopLevelMarkdownSection(markdown: string, headingText: string): string
export function serializeExampleSnippetsForHtml(snippets: readonly ComponentExampleSnippet[]): string
export function serializeJsonForHtml(value: unknown): string
export function isTypeScriptExampleLanguage(language: unknown): boolean
