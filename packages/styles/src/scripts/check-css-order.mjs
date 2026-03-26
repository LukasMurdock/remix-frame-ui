import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const indexPath = path.resolve(__dirname, "..", "index.css")
const css = await readFile(indexPath, "utf8")

const expected = [
  '@import "./generated/tokens.css";',
  '@import "./primitives.css";',
  '@import "./patterns.css";',
  '@import "./components.css";',
]

const indexes = expected.map((line) => css.indexOf(line))
if (indexes.some((n) => n === -1)) {
  throw new Error("CSS import contract is incomplete")
}

for (let i = 1; i < indexes.length; i++) {
  if (indexes[i] < indexes[i - 1]) {
    throw new Error("CSS import contract is out of order")
  }
}

console.log("CSS import order contract is valid")
