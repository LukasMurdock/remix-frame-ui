import { componentDemoEntries, demoByComponent } from "./component-demo-registry.js"
import { buildRuntimeDemoSourceMap } from "./component-demo-runtime-source.js"

export function parseRuntimeDemoIds(source) {
  const ids = new Set()
  const regex = /"([a-z0-9-]+)":\s*mount[A-Za-z0-9]+/g

  for (const match of String(source).matchAll(regex)) {
    const id = match[1]
    if (id) ids.add(id)
  }

  return ids
}

export function analyzeComponentDemoCoverage(componentNames, runtimeSource) {
  const runtimeDemoIds = parseRuntimeDemoIds(runtimeSource)
  const runtimeDemoSources = buildRuntimeDemoSourceMap(runtimeSource)
  const componentSet = new Set(componentNames)

  const missingInRegistry = []
  const extraInRegistry = []
  const missingRuntimeIds = []
  const missingRuntimeSources = []

  for (const componentName of componentNames) {
    const demoEntry = demoByComponent.get(componentName)
    if (!demoEntry) {
      missingInRegistry.push(componentName)
      continue
    }

    if (!runtimeDemoIds.has(demoEntry.id)) {
      missingRuntimeIds.push(`${componentName} -> ${demoEntry.id}`)
    }

    if (!runtimeDemoSources.has(demoEntry.id)) {
      missingRuntimeSources.push(`${componentName} -> ${demoEntry.id}`)
    }
  }

  for (const [componentName] of componentDemoEntries) {
    if (!componentSet.has(componentName)) {
      extraInRegistry.push(componentName)
    }
  }

  const duplicateDemoIds = collectDuplicateDemoIds(componentDemoEntries)

  return {
    missingInRegistry,
    extraInRegistry,
    missingRuntimeIds,
    missingRuntimeSources,
    duplicateDemoIds,
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
