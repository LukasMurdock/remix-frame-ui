import { describe, expect, it } from "vitest"
import { analyzeComponentDemoCoverage } from "./component-demo-validation.js"
import { componentDemoEntries } from "./component-demo-registry.js"

describe("component demo validation", () => {
  it("returns no issues for aligned coverage", () => {
    const componentNames = componentDemoEntries.map(([componentName]) => componentName)
    const demosById = new Map(componentDemoEntries.map(([, entry]) => [entry.id, new Set(["entry.tsx", "index.html"])]))
    const demosRootDirs = new Set(componentDemoEntries.map(([, entry]) => entry.id))
    const analysis = analyzeComponentDemoCoverage(componentNames, demosById, demosRootDirs)

    expect(analysis).toEqual({
      missingInRegistry: [],
      extraInRegistry: [],
      missingDemoDirs: [],
      missingEntryFiles: [],
      missingIndexFiles: [],
      duplicateDemoIds: [],
      extraDemoDirs: [],
    })
  })

  it("detects missing mappings and demo files", () => {
    const componentNames = [...componentDemoEntries.map(([componentName]) => componentName), "missing-component"]
    const demosById = new Map(componentDemoEntries.map(([, entry]) => [entry.id, new Set(["entry.tsx", "index.html"])]))
    demosById.delete("form-basic")
    const demosRootDirs = new Set([...demosById.keys(), "orphan-demo"])

    const analysis = analyzeComponentDemoCoverage(componentNames, demosById, demosRootDirs)

    expect(analysis.extraInRegistry).toEqual([])
    expect(analysis.missingInRegistry).toEqual(["missing-component"])
    expect(analysis.missingDemoDirs).toEqual(["form -> form-basic"])
    expect(analysis.extraDemoDirs).toEqual(["orphan-demo"])
  })

  it("detects missing entry and index files", () => {
    const componentNames = componentDemoEntries.map(([componentName]) => componentName)
    const demosById = new Map(componentDemoEntries.map(([, entry]) => [entry.id, new Set(["entry.tsx", "index.html"])]))
    demosById.set("button-basic", new Set(["index.html"]))
    demosById.set("form-basic", new Set(["entry.tsx"]))

    const analysis = analyzeComponentDemoCoverage(componentNames, demosById, new Set(demosById.keys()))

    expect(analysis.missingEntryFiles).toEqual(["button -> button-basic"])
    expect(analysis.missingIndexFiles).toEqual(["form -> form-basic"])
  })
})
