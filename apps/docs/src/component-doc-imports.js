export const packageImportPath = "@lukasmurdock/remix-ui-components"
export const exportSymbolPatterns = [
  /^export\s+(?:async\s+)?(?:function|const|class|let|var)\s+([A-Za-z0-9_]+)/gm,
  /^export\s+type\s+([A-Za-z0-9_]+)/gm,
  /^export\s+interface\s+([A-Za-z0-9_]+)/gm,
  /^export\s+enum\s+([A-Za-z0-9_]+)/gm,
  /^export\s+\{([^}]+)\}\s+from\s+["'][^"']+["']/gm,
  /^export\s+type\s+\{([^}]+)\}\s+from\s+["'][^"']+["']/gm,
]

export function parseImportedSymbols(source, importPath = packageImportPath) {
  const importSectionMatch = source.match(/## Import\s+```(?:ts|tsx|js)\n([\s\S]*?)```/)
  if (!importSectionMatch || !importSectionMatch[1]) return null

  const importSection = importSectionMatch[1]
  const symbols = extractPackageImportSymbols(importSection, importPath)
  return symbols.length > 0 ? symbols : null
}

export function extractPackageImportSymbols(source, importPath = packageImportPath) {
  return extractPackageImportGroups(source).get(importPath) ?? []
}

export function extractPackageImportGroups(source, packageBasePath = packageImportPath) {
  const importPattern = new RegExp(
    `import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*["'](${escapeRegExp(packageBasePath)}(?:\\/[A-Za-z0-9_-]+)*)["']`,
    "g",
  )

  const symbolsByImportPath = new Map()

  for (const match of source.matchAll(importPattern)) {
    const namedClause = match[1]
    const importPath = match[2]
    if (!namedClause || !importPath) continue

    const symbols = parseNamedImportClause(namedClause)
    const existingSymbols = symbolsByImportPath.get(importPath) ?? []
    symbolsByImportPath.set(importPath, [...new Set([...existingSymbols, ...symbols])])
  }

  return symbolsByImportPath
}

export function extractExportedSymbols(source) {
  const symbols = new Set()

  for (const pattern of exportSymbolPatterns.slice(0, 4)) {
    for (const match of source.matchAll(pattern)) {
      const symbol = match[1]
      if (symbol) symbols.add(symbol)
    }
  }

  for (const pattern of exportSymbolPatterns.slice(4)) {
    for (const match of source.matchAll(pattern)) {
      const clause = match[1]
      if (!clause) continue
      for (const symbol of parseNamedExportClause(clause)) {
        symbols.add(symbol)
      }
    }
  }

  return symbols
}

export function hasOwnComponentImport(importedSymbols, ownComponentSymbols, componentName) {
  if (!importedSymbols || importedSymbols.length === 0) return false

  const ownSymbolsSet = ownComponentSymbols instanceof Set ? ownComponentSymbols : new Set(ownComponentSymbols ?? [])
  const expectedName = componentName?.trim()

  return importedSymbols.some((symbol) => ownSymbolsSet.has(symbol) || (expectedName ? symbol === expectedName : false))
}

function parseNamedImportClause(namedClause) {
  return namedClause
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.split(/\s+as\s+/i)[0]?.trim())
    .filter(Boolean)
}

function parseNamedExportClause(namedClause) {
  return namedClause
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.replace(/^type\s+/, "").trim())
    .map((entry) => {
      const [sourceName, exportedName] = entry.split(/\s+as\s+/i).map((part) => part?.trim())
      return exportedName || sourceName
    })
    .filter(Boolean)
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
