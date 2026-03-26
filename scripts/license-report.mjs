import { execSync } from "node:child_process"

try {
  const output = execSync("pnpm licenses list --json", { stdio: "pipe" }).toString()
  const parsed = JSON.parse(output)
  const licenses = Object.entries(parsed)
  const count = licenses.reduce((total, [, deps]) => total + (Array.isArray(deps) ? deps.length : 0), 0)
  const buckets = licenses.length
  console.log(`license-report: discovered ${count} dependency entries across ${buckets} license buckets`)
} catch (error) {
  console.log("license-report: failed to gather dependency licenses")
  console.log(String(error))
  process.exitCode = 0
}
