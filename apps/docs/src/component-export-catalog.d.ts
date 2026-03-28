export type ComponentExportEntry = {
  componentFileName: string
  componentSlug: string
}

export type ComponentExportCatalog = {
  exportedSymbols: Set<string>
  symbolsByComponentSlug: Map<string, Set<string>>
  symbolMaturitiesByName: Map<string, Set<string>>
}

export function parseComponentExportEntries(indexSource: string): ComponentExportEntry[]

export function buildComponentExportCatalog(
  entries: ComponentExportEntry[],
  componentSourceByFileName: Map<string, string>,
  metadataBySlug?: Map<string, string>,
): ComponentExportCatalog

export function collectComponentExportCatalog(
  indexPath: string,
  componentsDir: string,
  metadataBySlug?: Map<string, string>,
): Promise<ComponentExportCatalog>

export function collectEntryPointExportSymbols(entryPointPath: string): Promise<Set<string>>
