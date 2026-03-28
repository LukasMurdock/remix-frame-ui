import { describe, expect, it } from "vitest"
import {
  analyzeComponentDemoCoverage,
  parseComponentToDemoIdMap,
  parseRuntimeDemoIds,
} from "./component-demo-validation.js"

describe("component demo validation", () => {
  it("parses component to demo maps", () => {
    const source = `
const demoByComponent = new Map([
  ["button", { id: "button-basic", title: "Button" }],
  ["form", { id: "form-basic", title: "Form" }],
])
`

    expect([...parseComponentToDemoIdMap(source).entries()]).toEqual([
      ["button", "button-basic"],
      ["form", "form-basic"],
    ])
  })

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
    const componentNames = ["button", "form"]
    const buildSource = '["button", { id: "button-basic" }], ["form", { id: "form-basic" }]'
    const devSource = '["button", { id: "button-basic" }], ["form", { id: "form-basic" }]'
    const runtimeSource = '"button-basic": mountButton, "form-basic": mountForm'

    const analysis = analyzeComponentDemoCoverage(componentNames, buildSource, devSource, runtimeSource)

    expect(analysis).toEqual({
      missingInBuild: [],
      missingInDev: [],
      extraInBuild: [],
      extraInDev: [],
      mismatchedBuildVsDev: [],
      missingRuntimeIds: [],
      duplicateBuildDemoIds: [],
      duplicateDevDemoIds: [],
    })
  })

  it("detects mismatches, extras, missing runtime ids, and duplicates", () => {
    const componentNames = ["button", "form"]
    const buildSource =
      '["button", { id: "button-basic" }], ["form", { id: "shared-demo" }], ["extra", { id: "shared-demo" }]'
    const devSource =
      '["button", { id: "button-dev" }], ["form", { id: "shared-demo" }], ["extra-dev", { id: "shared-demo" }]'
    const runtimeSource = '"button-basic": mountButton'

    const analysis = analyzeComponentDemoCoverage(componentNames, buildSource, devSource, runtimeSource)

    expect(analysis.missingInBuild).toEqual([])
    expect(analysis.missingInDev).toEqual([])
    expect(analysis.extraInBuild).toEqual(["extra"])
    expect(analysis.extraInDev).toEqual(["extra-dev"])
    expect(analysis.mismatchedBuildVsDev).toEqual(["button: build=button-basic, dev=button-dev"])
    expect(analysis.missingRuntimeIds).toEqual([
      "dev-docs: button -> button-dev",
      "build-docs: form -> shared-demo",
      "dev-docs: form -> shared-demo",
    ])
    expect(analysis.duplicateBuildDemoIds).toEqual(["shared-demo: extra, form"])
    expect(analysis.duplicateDevDemoIds).toEqual(["shared-demo: extra-dev, form"])
  })
})
