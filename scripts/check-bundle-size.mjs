import { stat } from "node:fs/promises"
import path from "node:path"

const filePath = path.resolve("packages/remix/dist/index.js")

const info = await stat(filePath)
console.log(`bundle-size: ${info.size} bytes (no enforced limit)`)
