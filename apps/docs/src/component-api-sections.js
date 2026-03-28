import { componentApiSections } from "./component-api-generated.js"

export function applyGeneratedApiSection(componentName, markdown) {
  const section = componentApiSections[componentName.toLowerCase()]
  if (!section) return markdown

  if (hasApiSection(markdown)) {
    return replaceApiSection(markdown, section)
  }

  const htmlParityMatch = /^## HTML parity\b/m.exec(markdown)
  if (!htmlParityMatch || htmlParityMatch.index === undefined) {
    return `${markdown.trimEnd()}\n\n${section}\n`
  }

  const before = markdown.slice(0, htmlParityMatch.index).trimEnd()
  const after = markdown.slice(htmlParityMatch.index).trimStart()
  return `${before}\n\n${section}\n\n${after}`
}

function hasApiSection(markdown) {
  return /^## API\b/m.test(markdown)
}

function replaceApiSection(markdown, section) {
  const apiMatch = /^## API\b/m.exec(markdown)
  if (!apiMatch || apiMatch.index === undefined) return markdown

  const apiStart = apiMatch.index
  const afterApi = markdown.slice(apiStart + 1)
  const nextHeading = /\n##\s+/.exec(afterApi)
  const apiEnd = nextHeading ? apiStart + 1 + nextHeading.index + 1 : markdown.length

  const before = markdown.slice(0, apiStart).trimEnd()
  const after = markdown.slice(apiEnd).trimStart()
  return `${before}\n\n${section}\n\n${after}`
}
