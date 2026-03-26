import { execSync } from "node:child_process"

console.log("Publishing stable release from approved version set")
execSync("pnpm -r publish --no-git-checks", { stdio: "inherit" })
