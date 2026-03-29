export function parseRuntimeDemoMounts(source) {
  const mounts = new Map()
  const regex = /"([a-z0-9-]+)"\s*:\s*(mount[A-Za-z0-9_]+)/g

  for (const match of String(source).matchAll(regex)) {
    const demoId = match[1]
    const mountFunctionName = match[2]
    if (!demoId || !mountFunctionName) continue
    mounts.set(demoId, mountFunctionName)
  }

  return mounts
}

export function buildRuntimeDemoSourceMap(source) {
  const mounts = parseRuntimeDemoMounts(source)
  const functions = indexTopLevelFunctions(source)
  const byDemoId = new Map()

  for (const [demoId, mountFunctionName] of mounts.entries()) {
    const functionSource = readFunctionSource(functions, source, mountFunctionName)
    if (!functionSource) continue

    byDemoId.set(demoId, {
      mountFunctionName,
      source: functionSource,
    })
  }

  return byDemoId
}

export function serializeJsonForHtml(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

function indexTopLevelFunctions(source) {
  const entries = []
  const regex = /^(?:export\s+)?function\s+([A-Za-z0-9_]+)\s*\(/gm

  for (const match of String(source).matchAll(regex)) {
    const name = match[1]
    const index = match.index
    if (!name || typeof index !== "number") continue
    entries.push({ name, index })
  }

  return entries.sort((a, b) => a.index - b.index)
}

function readFunctionSource(indexedFunctions, source, functionName) {
  const currentIndex = indexedFunctions.findIndex((entry) => entry.name === functionName)
  if (currentIndex < 0) return null

  const start = indexedFunctions[currentIndex]?.index
  if (typeof start !== "number") return null

  const nextStart = indexedFunctions[currentIndex + 1]?.index
  const end = typeof nextStart === "number" ? nextStart : String(source).length
  if (end <= start) return null

  return String(source).slice(start, end).trimEnd()
}
