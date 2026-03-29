import { describe, expect, it } from "vitest"
import { analyzeComponentDemoCoverage, parseRuntimeDemoIds } from "./component-demo-validation.js"
import { componentDemoEntries } from "./component-demo-registry.js"

describe("component demo validation", () => {
  it("parses runtime demo ids", () => {
    const source = `
const mounts = {
  "button-basic": mountButton,
  "form-basic": mountForm,
}
`

    expect([...parseRuntimeDemoIds(source)]).toEqual(["button-basic", "form-basic"])
  })

  it("returns no issues for aligned coverage", () => {
    const componentNames = componentDemoEntries.map(([componentName]) => componentName)
    const registryLines = componentDemoEntries
      .map(([, entry]) => `  "${entry.id}": mount${toMountName(entry.id)},`)
      .join("\n")
    const functionLines = componentDemoEntries
      .map(([, entry]) => `function mount${toMountName(entry.id)}() {}`)
      .join("\n")
    const runtimeSource = `const registry = {\n${registryLines}\n}\n${functionLines}\n`

    const analysis = analyzeComponentDemoCoverage(componentNames, runtimeSource)

    expect(analysis).toEqual({
      missingInRegistry: [],
      extraInRegistry: [],
      missingRuntimeIds: [],
      missingRuntimeSources: [],
      duplicateDemoIds: [],
    })
  })

  it("detects missing mappings and runtime demo ids", () => {
    const componentNames = [...componentDemoEntries.map(([componentName]) => componentName), "missing-component"]
    const registryLines = componentDemoEntries
      .filter(([componentName]) => componentName !== "form")
      .map(([, entry]) => `  "${entry.id}": mount${toMountName(entry.id)},`)
      .join("\n")
    const functionLines = componentDemoEntries
      .filter(([componentName]) => componentName !== "form")
      .map(([, entry]) => `function mount${toMountName(entry.id)}() {}`)
      .join("\n")
    const runtimeSource = `const registry = {\n${registryLines}\n}\n${functionLines}\n`

    const analysis = analyzeComponentDemoCoverage(componentNames, runtimeSource)

    expect(analysis.extraInRegistry).toEqual([])
    expect(analysis.missingInRegistry).toEqual(["missing-component"])
    expect(analysis.missingRuntimeIds).toEqual(["form -> form-basic"])
    expect(analysis.missingRuntimeSources).toEqual(["form -> form-basic"])
  })
})

function toMountName(demoId: string) {
  return demoId
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("")
}
