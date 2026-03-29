import { extractComponentExampleSnippets, isTypeScriptExampleLanguage } from "./component-example-source.js"

export const examplePlaceholderPatterns = [
  /^See demos? on this page for complete .+ usage patterns\.$/i,
  /^See demos? for controlled and uncontrolled usage patterns\.$/i,
  /^See demos? for composition and layout patterns\.$/i,
  /^See demos? for interaction and keyboard behavior patterns\.$/i,
]

const fencedCodeBlockRegex = /```([^\n]*)\n[\s\S]*?```/g

export function analyzeComponentExample(source) {
  const sectionBody = readSectionBody(source, "## Example")
  const issues = []

  if (sectionBody === null) {
    issues.push("missing ## Example section")
    return {
      issues,
      codeBlockCount: 0,
      exampleBody: "",
      hasPlaceholderCopy: false,
      hasCodeBlock: false,
    }
  }

  const normalizedBody = sectionBody.trim()
  const snippets = extractComponentExampleSnippets(source)
  const codeBlocks = [...normalizedBody.matchAll(fencedCodeBlockRegex)].map((match) => normalizeFenceLanguage(match[1]))
  const codeBlockCount = codeBlocks.length
  const typeScriptCodeBlockCount = codeBlocks.filter((language) => isTypeScriptExampleLanguage(language)).length
  const hasCodeBlock = codeBlockCount > 0
  const hasTypeScriptCodeBlock = typeScriptCodeBlockCount > 0
  const hasPlaceholderCopy = looksLikePlaceholderExample(normalizedBody)

  if (normalizedBody === "") {
    issues.push("empty ## Example section")
  }

  if (!hasCodeBlock) {
    issues.push("missing fenced code block in ## Example")
  }

  if (!hasCodeBlock && hasPlaceholderCopy) {
    issues.push("placeholder copy in ## Example")
  }

  if (snippets.length === 0) {
    issues.push("missing extractable example snippet in ## Example")
  }

  if (hasCodeBlock && !hasTypeScriptCodeBlock) {
    issues.push("missing ts/tsx fenced code block in ## Example")
  }

  return {
    issues,
    codeBlockCount,
    typeScriptCodeBlockCount,
    snippetCount: snippets.length,
    exampleBody: normalizedBody,
    hasPlaceholderCopy,
    hasCodeBlock,
    hasTypeScriptCodeBlock,
  }
}

export function looksLikePlaceholderExample(body) {
  const normalized = body.replace(/\s+/g, " ").trim()
  if (!normalized) return false
  return examplePlaceholderPatterns.some((pattern) => pattern.test(normalized))
}

function readSectionBody(source, heading) {
  const headingIndex = source.indexOf(heading)
  if (headingIndex < 0) return null

  const bodyStart = headingIndex + heading.length
  const rest = source.slice(bodyStart)
  const nextHeadingMatch = /\n##\s+/.exec(rest)
  const bodyEnd = nextHeadingMatch ? bodyStart + nextHeadingMatch.index : source.length

  return source.slice(bodyStart, bodyEnd)
}

function normalizeFenceLanguage(value) {
  const text = String(value ?? "")
    .trim()
    .toLowerCase()
  if (text === "") return ""
  const language = text.split(/\s+/)[0]
  return language ?? ""
}
