import { unified } from "unified"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeApiTablesAsComponentTables)
  .use(rehypeStringify)

export async function renderMarkdownToHtml(markdown) {
  const output = await processor.process(markdown)
  return String(output)
}

function rehypeApiTablesAsComponentTables() {
  return (tree) => {
    if (!tree || !Array.isArray(tree.children)) return

    let inApiSection = false

    for (let index = 0; index < tree.children.length; index += 1) {
      const node = tree.children[index]
      if (!isElementNode(node)) continue

      if (isHeadingNode(node)) {
        const headingLevel = Number(node.tagName.slice(1))
        if (headingLevel === 2) {
          const headingText = readNodeText(node).trim().toLowerCase()
          inApiSection = headingText === "api"
        } else if (inApiSection && headingLevel <= 2) {
          inApiSection = false
        }
        continue
      }

      if (!inApiSection || node.tagName !== "table") continue

      node.properties = appendClassName(node.properties, "rf-table")
      tree.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["rf-table-wrap"],
          role: "region",
          ariaLabel: "API table",
        },
        children: [node],
      }
    }
  }
}

function isElementNode(node) {
  return node && node.type === "element" && typeof node.tagName === "string"
}

function isHeadingNode(node) {
  return isElementNode(node) && /^h[1-6]$/.test(node.tagName)
}

function readNodeText(node) {
  if (!node || !Array.isArray(node.children)) return ""

  let text = ""
  for (const child of node.children) {
    if (child.type === "text") {
      text += child.value
    } else if (child.type === "element") {
      text += readNodeText(child)
    }
  }

  return text
}

function appendClassName(properties, className) {
  const next = { ...(properties ?? {}) }
  const existing = normalizeClassNames(next.className)
  if (!existing.includes(className)) existing.push(className)
  next.className = existing
  return next
}

function normalizeClassNames(value) {
  if (Array.isArray(value)) return value.map((entry) => String(entry))
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean)
  return []
}
