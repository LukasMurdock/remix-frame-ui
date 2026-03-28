import { execSync } from "node:child_process"

const tag = process.argv[2]
const retryIntervalMs = Number(process.env.DIST_TAG_VERIFY_RETRY_MS ?? 5000)
const timeoutMs = Number(process.env.DIST_TAG_VERIFY_TIMEOUT_MS ?? 90000)

if (!tag) {
  console.error("Usage: node scripts/verify-dist-tags.mjs <dist-tag>")
  process.exit(1)
}

const packages = ["@lukasmurdock/remix-ui-core", "@lukasmurdock/remix-ui-components", "@lukasmurdock/remix-ui-styles"]

function npmView(pkg, distTag) {
  const command = `npm view ${pkg}@${distTag} version --json`
  const output = execSync(command, { stdio: "pipe" }).toString().trim()
  const parsed = JSON.parse(output)
  return typeof parsed === "string" ? parsed : String(parsed)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatExecError(error) {
  if (error instanceof Error) {
    const stderr = typeof error.stderr === "object" && error.stderr ? error.stderr.toString().trim() : ""
    const message = stderr || error.message
    return message.replace(/\s+/g, " ").trim()
  }

  return String(error)
}

async function waitForDistTag(pkg, distTag) {
  const start = Date.now()
  let attempt = 0
  let lastError = ""

  while (Date.now() - start <= timeoutMs) {
    attempt += 1

    try {
      return npmView(pkg, distTag)
    } catch (error) {
      lastError = formatExecError(error)
      const elapsedMs = Date.now() - start
      const remainingMs = timeoutMs - elapsedMs

      if (remainingMs <= 0) {
        break
      }

      console.log(`${pkg}@${distTag} not visible yet (attempt ${attempt}); retrying in ${retryIntervalMs}ms...`)
      await sleep(retryIntervalMs)
    }
  }

  throw new Error(`Failed verifying ${pkg}@${distTag} after ${Math.ceil(timeoutMs / 1000)}s. Last error: ${lastError}`)
}

for (const pkg of packages) {
  const version = await waitForDistTag(pkg, tag)
  console.log(`${pkg}@${tag} -> ${version}`)
}

console.log(`Verified npm dist-tag '${tag}' for ${packages.length} packages.`)
