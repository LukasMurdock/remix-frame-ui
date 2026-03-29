import { unified } from "unified"
import remarkParse from "remark-parse"

const parser = unified().use(remarkParse)

export function extractComponentExampleSnippets(markdown) {
  const source = String(markdown)
  const tree = parser.parse(source)

  if (!tree || !Array.isArray(tree.children)) return []

  const section = findTopLevelSectionIndexes(tree.children, "example")
  if (!section) return []

  const sectionNodes = tree.children.slice(section.contentStartIndex, section.endHeadingIndex)

  const snippets = []
  let currentTitle = null

  for (const node of sectionNodes) {
    if (isHeadingNode(node) && node.depth >= 3) {
      const text = readHeadingText(node)
      currentTitle = text ? text : null
      continue
    }

    collectCodeSnippets(node, currentTitle, snippets)
  }

  return snippets
}

export function stripTopLevelMarkdownSection(markdown, headingText) {
  const source = String(markdown)
  const range =
    findTopLevelSectionRangeFromAst(source, headingText) ?? findTopLevelSectionRangeFromRegex(source, headingText)
  if (!range) return source

  const before = source.slice(0, range.start).replace(/\s+$/, "")
  const after = source.slice(range.end).replace(/^\s+/, "")

  if (!before) return after
  if (!after) return `${before}\n`
  return `${before}\n\n${after}`
}

export function serializeExampleSnippetsForHtml(snippets) {
  return serializeJsonForHtml(snippets)
}

export function serializeJsonForHtml(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

export function isTypeScriptExampleLanguage(language) {
  const normalized = String(language ?? "")
    .trim()
    .toLowerCase()
  return normalized === "ts" || normalized === "tsx" || normalized === "typescript"
}

function collectCodeSnippets(node, title, snippets) {
  if (!node || typeof node !== "object") return

  if (node.type === "code") {
    snippets.push({
      title,
      language: String(node.lang ?? "")
        .trim()
        .toLowerCase(),
      code: String(node.value ?? ""),
    })
    return
  }

  if (!Array.isArray(node.children)) return

  for (const child of node.children) {
    collectCodeSnippets(child, title, snippets)
  }
}

function findTopLevelSectionIndexes(nodes, headingText) {
  const targetHeading = String(headingText).trim().toLowerCase()
  let headingIndex = -1

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]
    if (!isHeadingNode(node) || node.depth !== 2) continue
    if (readHeadingText(node).toLowerCase() !== targetHeading) continue
    headingIndex = index
    break
  }

  if (headingIndex < 0) return null

  const contentStartIndex = headingIndex + 1

  let endHeadingIndex = nodes.length
  for (let index = contentStartIndex; index < nodes.length; index += 1) {
    const node = nodes[index]
    if (!isHeadingNode(node)) continue
    if (node.depth <= 2) {
      endHeadingIndex = index
      break
    }
  }

  return {
    headingIndex,
    contentStartIndex,
    endHeadingIndex,
  }
}

function findTopLevelSectionRangeFromAst(source, headingText) {
  const tree = parser.parse(source)
  if (!tree || !Array.isArray(tree.children)) return null

  const section = findTopLevelSectionIndexes(tree.children, headingText)
  if (!section) return null

  const headingNode = tree.children[section.headingIndex]
  const nextHeadingNode = tree.children[section.endHeadingIndex]

  const start = readNodeStartOffset(headingNode)
  if (start === null) return null

  const end = readNodeStartOffset(nextHeadingNode) ?? source.length
  if (end < start) return null

  return { start, end }
}

function findTopLevelSectionRangeFromRegex(source, headingText) {
  const escapedHeading = escapeRegExp(String(headingText).trim())
  const headingRegex = new RegExp(`^##\\s+${escapedHeading}\\s*$`, "gim")
  const match = headingRegex.exec(source)
  if (!match || typeof match.index !== "number") return null

  const start = match.index
  const nextHeadingRegex = /^##\s+/gm
  nextHeadingRegex.lastIndex = match.index + match[0].length
  const nextHeading = nextHeadingRegex.exec(source)
  const end = nextHeading ? nextHeading.index : source.length

  return { start, end }
}

function readNodeStartOffset(node) {
  const offset = node?.position?.start?.offset
  return typeof offset === "number" ? offset : null
}

function readHeadingText(node) {
  if (!node || !Array.isArray(node.children)) return ""

  let text = ""
  for (const child of node.children) {
    if (child.type === "text" || child.type === "inlineCode") {
      text += child.value
      continue
    }

    if (Array.isArray(child.children)) {
      text += readHeadingText(child)
    }
  }

  return text.trim()
}

function isHeadingNode(node) {
  return node && node.type === "heading" && typeof node.depth === "number"
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
