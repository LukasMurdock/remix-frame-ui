export const packageImportPath: string
export const exportSymbolPatterns: RegExp[]

export function parseImportedSymbols(source: string, importPath?: string): string[] | null
export function extractPackageImportSymbols(source: string, importPath?: string): string[]
export function extractPackageImportGroups(source: string, packageBasePath?: string): Map<string, string[]>
export function extractExportedSymbols(source: string): Set<string>
export function hasOwnComponentImport(
  importedSymbols: string[] | null,
  ownComponentSymbols: Iterable<string> | null,
  componentName?: string,
): boolean
