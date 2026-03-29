export const requiredSections = [
  "## When to use",
  "## Import",
  "## API",
  "## HTML parity",
  "## Runtime notes",
  "## Accessibility matrix",
  "## Keymap spec",
]

export const disallowedPlaceholderPhrases = [
  "for this UI pattern in page and app workflows.",
  "Keep behavior predictable with native semantics and explicit props.",
  "See the component demos on this page for complete usage patterns.",
]

export const generatedApiNotice = "Type definitions are generated from component source."

export function analyzeComponentDoc(source) {
  const missingSections = requiredSections.filter((section) => !source.includes(section))
  const emptySections = requiredSections.filter(
    (section) => source.includes(section) && readSectionBody(source, section) === "",
  )
  const outOfOrderSections = findOutOfOrderSections(source)
  const placeholderPhrases = disallowedPlaceholderPhrases.filter((phrase) => source.includes(phrase))
  const apiIssues = []

  const apiBody = readSectionBody(source, "## API")
  if (!apiBody.includes(generatedApiNotice)) {
    apiIssues.push(`missing generated notice: ${generatedApiNotice}`)
  }
  if (apiBody.includes("| Prop | Type |")) {
    apiIssues.push("contains manual prop table content")
  }

  return {
    missingSections,
    emptySections,
    outOfOrderSections,
    placeholderPhrases,
    apiIssues,
  }
}

function findOutOfOrderSections(source) {
  const sectionIndexes = requiredSections.map((section) => source.indexOf(section))
  const outOfOrder = []

  for (let index = 1; index < sectionIndexes.length; index += 1) {
    if (sectionIndexes[index] < sectionIndexes[index - 1]) {
      outOfOrder.push(`${requiredSections[index - 1]} -> ${requiredSections[index]}`)
    }
  }

  return outOfOrder
}

function readSectionBody(source, heading) {
  const headingIndex = source.indexOf(heading)
  if (headingIndex < 0) return ""

  const bodyStart = headingIndex + heading.length
  const rest = source.slice(bodyStart)
  const nextHeadingMatch = /\n##\s+/.exec(rest)
  const bodyEnd = nextHeadingMatch ? bodyStart + nextHeadingMatch.index : source.length

  return source.slice(bodyStart, bodyEnd).trim()
}
