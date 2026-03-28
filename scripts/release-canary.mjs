import { execSync } from "node:child_process"
import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const packages = ["@lukasmurdock/remix-ui-core", "@lukasmurdock/remix-ui-components", "@lukasmurdock/remix-ui-styles"]

const changesetDir = join(process.cwd(), ".changeset")
const fileName = `ci-canary-${process.env.GITHUB_RUN_ID ?? Date.now()}.md`
const filePath = join(changesetDir, fileName)

const frontmatter = packages.map((pkg) => `\"${pkg}\": patch`).join("\n")
const body = ["---", frontmatter, "---", "", "Automated canary snapshot release.", ""].join("\n")

mkdirSync(changesetDir, { recursive: true })
writeFileSync(filePath, body, "utf8")

try {
  execSync("pnpm exec changeset version --snapshot canary", { stdio: "inherit" })
  execSync("pnpm exec changeset publish --tag canary", { stdio: "inherit" })
} finally {
  rmSync(filePath, { force: true })
}
