export const validMaturityLabels: Set<string>
export const validPlatformLabels: Set<string>

export function toComponentSlug(name: string): string
export function extractMaturityLabel(source: string): string | null
export function extractPlatformLabel(source: string): string | null
export function normalizePlatformLabel(value: unknown): string
export function resolvePlatformLabel(value: unknown): "universal" | "mobile"
export function extractTitle(source: string): string | null
