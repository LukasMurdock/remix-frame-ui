import { execSync } from "node:child_process"

const sha = execSync("git rev-parse --short HEAD", { stdio: "pipe" }).toString().trim()
const tag = `canary-${new Date().toISOString().slice(0, 10)}-${sha}`

console.log(`Publishing canary release: ${tag}`)
execSync(`pnpm -r publish --tag canary --no-git-checks`, { stdio: "inherit" })
