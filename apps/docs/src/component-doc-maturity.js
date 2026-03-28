export const validMaturityLabels = new Set(["experimental", "stable"])
export const validPlatformLabels = new Set(["universal", "mobile"])

export function toComponentSlug(name) {
  return String(name)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
}

export function extractMaturityLabel(source) {
  const match = source.match(/^Maturity:\s*([A-Za-z-]+)\s*$/m)
  if (!match || !match[1]) return null
  return match[1].toLowerCase()
}

export function extractPlatformLabel(source) {
  const match = source.match(/^Platform:\s*([A-Za-z-]+)\s*$/m)
  if (!match || !match[1]) return null
  return match[1].toLowerCase()
}

export function normalizePlatformLabel(value) {
  if (value === undefined || value === null) return "universal"
  const normalized = String(value).trim().toLowerCase()
  return normalized === "" ? "universal" : normalized
}

export function resolvePlatformLabel(value) {
  const normalized = normalizePlatformLabel(value)
  return validPlatformLabels.has(normalized) ? normalized : "universal"
}

export function extractTitle(source) {
  const match = source.match(/^#\s+(.+)$/m)
  if (!match || !match[1]) return null
  return match[1].trim()
}
