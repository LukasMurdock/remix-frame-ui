import { describe, expect, it } from "vitest"
import { analyzeComponentDemoParity } from "./component-demo-parity.js"

describe("component demo parity", () => {
  it("reports missing parity tokens from code examples", () => {
    const runtimeSource = `
const mounts = {
  "grid-basic": mountGridDemo,
}

function mountGridDemo(mount) {
  mount.innerHTML = '<div class="rf-grid"><div class="rf-grid-item" data-span="4"></div></div>'
}
`

    const issues = analyzeComponentDemoParity({
      componentNames: ["grid"],
      markdownByComponent: new Map([
        [
          "grid",
          `# Grid

## Example

\`\`\`tsx
import { Grid } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return <Grid columns={4} />
}
\`\`\`

## HTML parity
`,
        ],
      ]),
      metadataNameBySlug: new Map([["grid", "Grid"]]),
      symbolsByComponentSlug: new Map([["grid", new Set(["Grid", "GridItem"])]]),
      runtimeSource,
    })

    expect(issues).toHaveLength(1)
    expect(issues[0]?.details.join("\n")).toContain("GridItem")
  })

  it("passes when code and preview contracts align", () => {
    const runtimeSource = `
const mounts = {
  "layout-basic": mountLayoutDemo,
}

function mountLayoutDemo(mount) {
  mount.innerHTML = '<section class="rf-layout"><button>Toggle sidebar</button></section>'
}
`

    const issues = analyzeComponentDemoParity({
      componentNames: ["layout"],
      markdownByComponent: new Map([
        [
          "layout",
          `# Layout

## Example

\`\`\`tsx
import { Layout } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <Layout>
      <button type="button">Toggle sidebar</button>
    </Layout>
  )
}
\`\`\`

## HTML parity
`,
        ],
      ]),
      metadataNameBySlug: new Map([["layout", "Layout"]]),
      symbolsByComponentSlug: new Map([["layout", new Set(["Layout"])]]),
      runtimeSource,
      buildSource: "",
      devSource: "",
      docsRuntimeSource: "",
    })

    expect(issues).toEqual([])
  })

  it("flags removed-path regressions in build/dev/runtime wiring", () => {
    const runtimeSource = `
const mounts = {
  "button-basic": mountButtonDemo,
}

function mountButtonDemo(mount) {
  mount.innerHTML = "<button>Button</button>"
}
`

    const issues = analyzeComponentDemoParity({
      componentNames: ["button"],
      markdownByComponent: new Map([
        [
          "button",
          `# Button

## Example

\`\`\`tsx
import { Button } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return <Button>Press</Button>
}
\`\`\`

## HTML parity
`,
        ],
      ]),
      metadataNameBySlug: new Map([["button", "Button"]]),
      symbolsByComponentSlug: new Map([["button", new Set(["Button"])]]),
      runtimeSource,
      buildSource: '"data-docs-preview-source"',
      devSource: '"data-docs-example-source"',
      docsRuntimeSource: 'demoBlock.querySelector("script[data-docs-preview-source]")',
    })

    const architectureIssue = issues.find((issue) => issue.component === "architecture")
    expect(architectureIssue).toBeDefined()
    expect(architectureIssue?.details.join("\n")).toContain("preview source payload")
    expect(architectureIssue?.details.join("\n")).toContain("markdown snippet payload")
  })
})
