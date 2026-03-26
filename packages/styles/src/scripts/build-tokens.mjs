import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const tokensPath = path.join(root, "tokens", "tokens.json")
const outPath = path.join(root, "generated", "tokens.css")

const json = JSON.parse(await readFile(tokensPath, "utf8"))

function flatten(obj, parent = []) {
  const out = {}
  for (const [key, value] of Object.entries(obj)) {
    const next = [...parent, key]
    if (typeof value === "string") {
      out[next.join(".")] = value
      continue
    }
    Object.assign(out, flatten(value, next))
  }
  return out
}

const primitives = flatten(json.color)
const semantic = flatten(json.semantic)

function toVarName(name) {
  return `--rf-${name.replaceAll(".", "-")}`
}

function resolveSemantic(value) {
  const match = /^\{(.+)\}$/.exec(value)
  if (!match) return value
  return `var(${toVarName(match[1])})`
}

const lines = []
lines.push("@layer tokens {")
lines.push("  :root {")

for (const [name, value] of Object.entries(primitives)) {
  lines.push(`    ${toVarName(`color.${name}`)}: ${value};`)
}

for (const [name, value] of Object.entries(semantic)) {
  lines.push(`    ${toVarName(name)}: ${resolveSemantic(value)};`)
}

lines.push("  }")
lines.push("")
lines.push("  [data-theme=\"dark\"] {")
lines.push("    --rf-surface-default: var(--rf-color-gray-900);")
lines.push("    --rf-surface-inverse: var(--rf-color-gray-50);")
lines.push("    --rf-text-default: var(--rf-color-gray-50);")
lines.push("    --rf-text-inverse: var(--rf-color-gray-900);")
lines.push("    --rf-border-default: var(--rf-color-gray-700);")
lines.push("  }")
lines.push("}")

await writeFile(outPath, `${lines.join("\n")}\n`)
