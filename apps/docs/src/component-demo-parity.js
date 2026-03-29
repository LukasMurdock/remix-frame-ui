import { demoByComponent } from "./component-demo-registry.js"
import { buildRuntimeDemoSourceMap } from "./component-demo-runtime-source.js"
import { extractComponentExampleSnippets } from "./component-example-source.js"

export function analyzeComponentDemoParity({
  componentNames,
  markdownByComponent,
  metadataNameBySlug,
  symbolsByComponentSlug,
  runtimeSource,
  buildSource,
  devSource,
  docsRuntimeSource,
}) {
  const runtimeDemoSourceById = buildRuntimeDemoSourceMap(runtimeSource)
  const issues = []

  for (const componentName of componentNames) {
    const demoEntry = demoByComponent.get(componentName)
    if (!demoEntry) continue

    const markdown = markdownByComponent.get(componentName)
    if (!markdown) {
      issues.push({ component: componentName, details: ["missing markdown source"] })
      continue
    }

    const snippets = extractComponentExampleSnippets(markdown)
    const exampleCode = snippets.map((snippet) => snippet.code).join("\n\n")
    if (exampleCode.trim() === "") {
      issues.push({ component: componentName, details: ["missing extractable example snippet"] })
      continue
    }

    const runtimeDemo = runtimeDemoSourceById.get(demoEntry.id)
    if (!runtimeDemo || runtimeDemo.source.trim() === "") {
      issues.push({ component: componentName, details: [`missing runtime demo source for ${demoEntry.id}`] })
      continue
    }

    const details = []
    const explicitCodeTokens = demoEntry.parity?.codeIncludes ?? []
    const excludedCodeTokens = new Set(demoEntry.parity?.codeExcludes ?? [])
    const requiredCodeTokens = new Set(explicitCodeTokens)
    const requiredPreviewTokens = new Set(demoEntry.parity?.previewIncludes ?? [])
    const sharedTokens = demoEntry.parity?.sharedIncludes ?? []

    const ownSymbols = symbolsByComponentSlug.get(componentName) ?? new Set()
    const ownSymbolUsedInCode = [...ownSymbols].some((symbol) => containsToken(exampleCode, symbol))

    const componentTitle = metadataNameBySlug.get(componentName)
    if (componentTitle && explicitCodeTokens.length === 0 && !ownSymbolUsedInCode) {
      requiredCodeTokens.add(componentTitle)
    }

    for (const symbol of ownSymbols) {
      if (excludedCodeTokens.has(symbol)) continue

      const classToken = `rf-${toKebabCase(symbol)}`
      if (runtimeDemo.source.includes(classToken)) {
        requiredCodeTokens.add(symbol)
      }
    }

    for (const token of requiredCodeTokens) {
      if (!containsToken(exampleCode, token)) {
        details.push(`code example is missing token: ${token}`)
      }
    }

    for (const token of requiredPreviewTokens) {
      if (!runtimeDemo.source.includes(token)) {
        details.push(`preview demo is missing token: ${token}`)
      }
    }

    for (const token of sharedTokens) {
      if (!containsToken(exampleCode, token)) {
        details.push(`code example is missing shared token: ${token}`)
      }
      if (!runtimeDemo.source.includes(token)) {
        details.push(`preview demo is missing shared token: ${token}`)
      }
    }

    if (details.length > 0) {
      issues.push({ component: componentName, details })
    }
  }

  const architectureDetails = []

  if (buildSource && buildSource.includes("data-docs-preview-source")) {
    architectureDetails.push("build docs still injects preview source payload path")
  }
  if (devSource && devSource.includes("data-docs-preview-source")) {
    architectureDetails.push("dev docs still injects preview source payload path")
  }
  if (buildSource && buildSource.includes("data-docs-example-source")) {
    architectureDetails.push("build docs still injects markdown snippet payload path")
  }
  if (devSource && devSource.includes("data-docs-example-source")) {
    architectureDetails.push("dev docs still injects markdown snippet payload path")
  }

  const runtimeCode = docsRuntimeSource ?? runtimeSource
  if (runtimeCode.includes("script[data-docs-preview-source]")) {
    architectureDetails.push("docs runtime still reads preview source payload path")
  }
  if (runtimeCode.includes("script[data-docs-example-source]")) {
    architectureDetails.push("docs runtime still reads markdown snippet payload path")
  }

  if (architectureDetails.length > 0) {
    issues.push({ component: "architecture", details: architectureDetails })
  }

  return issues
}

function containsToken(source, token) {
  if (!token) return true

  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(token)) {
    return new RegExp(`\\b${escapeRegExp(token)}\\b`).test(source)
  }

  return source.includes(token)
}

function toKebabCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
