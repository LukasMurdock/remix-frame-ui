import { execSync } from "node:child_process"

const tag = process.argv[2]

if (!tag) {
  console.error("Usage: node scripts/verify-dist-tags.mjs <dist-tag>")
  process.exit(1)
}

const packages = ["@lukasmurdock/core", "@lukasmurdock/remix", "@lukasmurdock/styles"]

function npmView(pkg, distTag) {
  const command = `npm view ${pkg}@${distTag} version --json`
  const output = execSync(command, { stdio: "pipe" }).toString().trim()
  const parsed = JSON.parse(output)
  return typeof parsed === "string" ? parsed : String(parsed)
}

for (const pkg of packages) {
  const version = npmView(pkg, tag)
  console.log(`${pkg}@${tag} -> ${version}`)
}

console.log(`Verified npm dist-tag '${tag}' for ${packages.length} packages.`)
