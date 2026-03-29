import { componentDemoEntries, demoByComponent } from "./component-demo-registry.js"

export function analyzeComponentDemoCoverage(componentNames, demosById, demosRootDirs) {
  const componentSet = new Set(componentNames)

  const missingInRegistry = []
  const extraInRegistry = []
  const missingDemoDirs = []
  const missingEntryFiles = []
  const missingIndexFiles = []

  for (const componentName of componentNames) {
    const demoEntry = demoByComponent.get(componentName)
    if (!demoEntry) {
      missingInRegistry.push(componentName)
      continue
    }

    const demoFiles = demosById.get(demoEntry.id)
    if (!demoFiles) {
      missingDemoDirs.push(`${componentName} -> ${demoEntry.id}`)
      continue
    }

    if (!demoFiles.has("entry.tsx")) {
      missingEntryFiles.push(`${componentName} -> ${demoEntry.id}`)
    }

    if (!demoFiles.has("index.html")) {
      missingIndexFiles.push(`${componentName} -> ${demoEntry.id}`)
    }
  }

  for (const [componentName] of componentDemoEntries) {
    if (!componentSet.has(componentName)) {
      extraInRegistry.push(componentName)
    }
  }

  const duplicateDemoIds = collectDuplicateDemoIds(componentDemoEntries)
  const mappedDemoIds = new Set(componentDemoEntries.map(([, entry]) => entry.id))
  const extraDemoDirs = [...demosRootDirs].filter((demoId) => !mappedDemoIds.has(demoId)).sort()

  return {
    missingInRegistry,
    extraInRegistry,
    missingDemoDirs,
    missingEntryFiles,
    missingIndexFiles,
    duplicateDemoIds,
    extraDemoDirs,
  }
}

function collectDuplicateDemoIds(entries) {
  const componentsByDemoId = new Map()

  for (const [componentName, demoEntry] of entries) {
    const list = componentsByDemoId.get(demoEntry.id) ?? []
    list.push(componentName)
    componentsByDemoId.set(demoEntry.id, list)
  }

  const duplicates = []
  for (const [demoId, componentNames] of componentsByDemoId.entries()) {
    if (componentNames.length <= 1) continue
    duplicates.push(`${demoId}: ${componentNames.sort().join(", ")}`)
  }

  return duplicates.sort()
}
