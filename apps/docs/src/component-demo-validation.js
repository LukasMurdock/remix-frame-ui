export function parseComponentToDemoIdMap(source) {
  const map = new Map()
  const regex = /\[\s*"([a-z0-9-]+)"\s*,\s*\{\s*id:\s*"([a-z0-9-]+)"/g

  for (const match of source.matchAll(regex)) {
    const componentSlug = match[1]
    const demoId = match[2]
    if (!componentSlug || !demoId) continue
    map.set(componentSlug, demoId)
  }

  return map
}

export function parseRuntimeDemoIds(source) {
  const ids = new Set()
  const regex = /"([a-z0-9-]+)":\s*mount[A-Za-z0-9]+/g

  for (const match of source.matchAll(regex)) {
    const id = match[1]
    if (id) ids.add(id)
  }

  return ids
}

export function analyzeComponentDemoCoverage(componentNames, buildSource, devSource, runtimeSource) {
  const buildDemoMap = parseComponentToDemoIdMap(buildSource)
  const devDemoMap = parseComponentToDemoIdMap(devSource)
  const runtimeDemoIds = parseRuntimeDemoIds(runtimeSource)
  const componentSet = new Set(componentNames)

  const missingInBuild = []
  const missingInDev = []
  const extraInBuild = []
  const extraInDev = []
  const mismatchedBuildVsDev = []
  const missingRuntimeIds = []

  for (const componentName of componentNames) {
    const buildDemoId = buildDemoMap.get(componentName)
    const devDemoId = devDemoMap.get(componentName)

    if (!buildDemoId) missingInBuild.push(componentName)
    if (!devDemoId) missingInDev.push(componentName)

    if (buildDemoId && devDemoId && buildDemoId !== devDemoId) {
      mismatchedBuildVsDev.push(`${componentName}: build=${buildDemoId}, dev=${devDemoId}`)
    }

    if (buildDemoId && !runtimeDemoIds.has(buildDemoId)) {
      missingRuntimeIds.push(`build-docs: ${componentName} -> ${buildDemoId}`)
    }

    if (devDemoId && !runtimeDemoIds.has(devDemoId)) {
      missingRuntimeIds.push(`dev-docs: ${componentName} -> ${devDemoId}`)
    }
  }

  for (const componentName of buildDemoMap.keys()) {
    if (!componentSet.has(componentName)) extraInBuild.push(componentName)
  }

  for (const componentName of devDemoMap.keys()) {
    if (!componentSet.has(componentName)) extraInDev.push(componentName)
  }

  const duplicateBuildDemoIds = collectDuplicateDemoIds(buildDemoMap)
  const duplicateDevDemoIds = collectDuplicateDemoIds(devDemoMap)

  return {
    missingInBuild,
    missingInDev,
    extraInBuild,
    extraInDev,
    mismatchedBuildVsDev,
    missingRuntimeIds,
    duplicateBuildDemoIds,
    duplicateDevDemoIds,
  }
}

function collectDuplicateDemoIds(componentToDemoMap) {
  const componentsByDemoId = new Map()

  for (const [componentName, demoId] of componentToDemoMap.entries()) {
    const list = componentsByDemoId.get(demoId) ?? []
    list.push(componentName)
    componentsByDemoId.set(demoId, list)
  }

  const duplicates = []
  for (const [demoId, componentNames] of componentsByDemoId.entries()) {
    if (componentNames.length <= 1) continue
    duplicates.push(`${demoId}: ${componentNames.sort().join(", ")}`)
  }

  return duplicates.sort()
}
