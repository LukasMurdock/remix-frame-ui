export const validMaturityLabels = new Set(["experimental", "stable"])

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

export function extractTitle(source) {
  const match = source.match(/^#\s+(.+)$/m)
  if (!match || !match[1]) return null
  return match[1].trim()
}
