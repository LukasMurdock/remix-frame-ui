export const examplePlaceholderPatterns = [
  /^See demos? on this page for complete .+ usage patterns\.$/i,
  /^See demos? for controlled and uncontrolled usage patterns\.$/i,
  /^See demos? for composition and layout patterns\.$/i,
  /^See demos? for interaction and keyboard behavior patterns\.$/i,
]

const fencedCodeBlockRegex = /```(?:[^\n]*)\n[\s\S]*?```/g

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
  const codeBlockMatches = normalizedBody.match(fencedCodeBlockRegex) ?? []
  const codeBlockCount = codeBlockMatches.length
  const hasCodeBlock = codeBlockCount > 0
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

  return {
    issues,
    codeBlockCount,
    exampleBody: normalizedBody,
    hasPlaceholderCopy,
    hasCodeBlock,
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
