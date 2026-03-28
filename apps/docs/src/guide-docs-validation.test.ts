import { describe, expect, it } from "vitest"
import {
  analyzeGuideImportPaths,
  analyzeGettingStartedNavigationSections,
  analyzeGettingStartedStableRecommendations,
  analyzeGuideImports,
  analyzeGuideSymbolImportsByPath,
  analyzeGuideDocs,
  extractGuideTitle,
} from "./guide-docs-validation.js"

describe("guide docs validation", () => {
  it("passes with aligned guide order and references", () => {
    const guideSlugs = ["getting-started", "installation", "first-page", "first-form", "runtime-and-hydration"]
    const guideOrder = [...guideSlugs]
    const gettingStartedSource = `
      1. [Installation](#guide-installation)
      2. [First page](#guide-first-page)
      3. [First form](#guide-first-form)
      4. [Runtime and hydration](#guide-runtime-and-hydration)
    `

    const analysis = analyzeGuideDocs(guideSlugs, guideOrder, gettingStartedSource)

    expect(analysis.duplicateGuideOrderEntries).toEqual([])
    expect(analysis.guidesMissingFromOrder).toEqual([])
    expect(analysis.orderEntriesMissingGuides).toEqual([])
    expect(analysis.guideOrderStartsWithGettingStarted).toBe(true)
    expect(analysis.gettingStartedInvalidReferences).toEqual([])
    expect(analysis.gettingStartedMissingReferences).toEqual([])
  })

  it("detects order and file drift", () => {
    const guideSlugs = ["getting-started", "installation", "first-page", "new-guide"]
    const guideOrder = ["getting-started", "installation", "first-form"]
    const gettingStartedSource = ""

    const analysis = analyzeGuideDocs(guideSlugs, guideOrder, gettingStartedSource)

    expect(analysis.guidesMissingFromOrder).toEqual(["first-page", "new-guide"])
    expect(analysis.orderEntriesMissingGuides).toEqual(["first-form"])
  })

  it("detects duplicate guide-order entries", () => {
    const guideSlugs = ["getting-started", "installation"]
    const guideOrder = ["getting-started", "installation", "installation"]
    const gettingStartedSource = ""

    const analysis = analyzeGuideDocs(guideSlugs, guideOrder, gettingStartedSource)

    expect(analysis.duplicateGuideOrderEntries).toEqual(["installation"])
  })

  it("detects guide order that does not start with getting-started", () => {
    const guideSlugs = ["getting-started", "installation"]
    const guideOrder = ["installation", "getting-started"]
    const gettingStartedSource = ""

    const analysis = analyzeGuideDocs(guideSlugs, guideOrder, gettingStartedSource)

    expect(analysis.guideOrderStartsWithGettingStarted).toBe(false)
  })

  it("detects broken and missing Getting Started references", () => {
    const guideSlugs = ["getting-started", "installation", "first-page", "first-form"]
    const guideOrder = [...guideSlugs]
    const gettingStartedSource = `
      1. [Installation](#guide-installation)
      2. [Unknown](#guide-does-not-exist)
    `

    const analysis = analyzeGuideDocs(guideSlugs, guideOrder, gettingStartedSource)

    expect(analysis.gettingStartedInvalidReferences).toEqual(["does-not-exist"])
    expect(analysis.gettingStartedMissingReferences).toEqual(["first-form", "first-page"])
  })

  it("extracts guide title", () => {
    const source = "# Runtime and Hydration\n\nBody"

    expect(extractGuideTitle(source)).toBe("Runtime and Hydration")
  })

  it("returns null when guide title is missing", () => {
    const source = "No heading"

    expect(extractGuideTitle(source)).toBeNull()
  })

  it("passes stable recommendation analysis with aligned metadata", () => {
    const gettingStartedSource = `
## Stable-first recommendation

- \`Form\`
- \`Flex\`
- \`Grid\`
`

    const analysis = analyzeGettingStartedStableRecommendations(gettingStartedSource, ["Form", "Flex", "Grid"])

    expect(analysis.hasStableRecommendationSection).toBe(true)
    expect(analysis.missingStableComponents).toEqual([])
    expect(analysis.unexpectedStableComponents).toEqual([])
    expect(analysis.duplicateStableComponents).toEqual([])
  })

  it("detects missing, unexpected, and duplicate stable recommendation entries", () => {
    const gettingStartedSource = `
## Stable-first recommendation

- \`Form\`
- \`LegacyComponent\`
- \`Form\`
`

    const analysis = analyzeGettingStartedStableRecommendations(gettingStartedSource, ["Form", "Flex"])

    expect(analysis.missingStableComponents).toEqual(["Flex"])
    expect(analysis.unexpectedStableComponents).toEqual(["LegacyComponent"])
    expect(analysis.duplicateStableComponents).toEqual(["Form"])
  })

  it("detects missing stable recommendation section", () => {
    const analysis = analyzeGettingStartedStableRecommendations("# Getting Started", ["Form"])

    expect(analysis.hasStableRecommendationSection).toBe(false)
    expect(analysis.missingStableComponents).toEqual(["Form"])
  })

  it("passes navigation section analysis with expected guide links", () => {
    const source = `
## 5-minute path

1. [Installation](#guide-installation)
2. [First page](#guide-first-page)
3. [First form](#guide-first-form)

## What to read first

1. [Installation](#guide-installation)
2. [First page](#guide-first-page)
3. [First form](#guide-first-form)
4. [Runtime and hydration](#guide-runtime-and-hydration)
`

    const analysis = analyzeGettingStartedNavigationSections(source, [
      "getting-started",
      "installation",
      "first-page",
      "first-form",
      "runtime-and-hydration",
    ])

    expect(analysis.hasQuickPathSection).toBe(true)
    expect(analysis.hasReadFirstSection).toBe(true)
    expect(analysis.quickPathInvalidReferences).toEqual([])
    expect(analysis.readFirstInvalidReferences).toEqual([])
    expect(analysis.quickPathMissingReferences).toEqual([])
    expect(analysis.readFirstMissingReferences).toEqual([])
    expect(analysis.quickPathUnexpectedReferences).toEqual([])
    expect(analysis.readFirstUnexpectedReferences).toEqual([])
  })

  it("detects navigation section drift", () => {
    const source = `
## 5-minute path

1. [Installation](#guide-installation)
2. [Unknown](#guide-unknown)

## What to read first

1. [Installation](#guide-installation)
2. [First page](#guide-first-page)
`

    const analysis = analyzeGettingStartedNavigationSections(source, [
      "getting-started",
      "installation",
      "first-page",
      "first-form",
      "runtime-and-hydration",
    ])

    expect(analysis.quickPathInvalidReferences).toEqual(["unknown"])
    expect(analysis.quickPathMissingReferences).toEqual(["first-form", "first-page"])
    expect(analysis.quickPathUnexpectedReferences).toEqual(["unknown"])
    expect(analysis.readFirstMissingReferences).toEqual(["first-form", "runtime-and-hydration"])
  })

  it("detects missing navigation sections", () => {
    const analysis = analyzeGettingStartedNavigationSections("# Getting Started", ["getting-started", "installation"])

    expect(analysis.hasQuickPathSection).toBe(false)
    expect(analysis.hasReadFirstSection).toBe(false)
  })

  it("passes guide import validation when imports are known and stable-first guides stay stable", () => {
    const importsByGuideSlug = new Map([
      ["installation", ["Form", "Space"]],
      ["first-page", ["Layout", "Text"]],
      ["runtime-and-hydration", ["Dialog"]],
    ])
    const exportedSymbols = new Set(["Form", "Space", "Layout", "Text", "Dialog"])
    const stableFirstGuideSlugs = ["installation", "first-page"]
    const symbolMaturitiesByName = new Map([
      ["Form", new Set(["stable"])],
      ["Space", new Set(["stable"])],
      ["Layout", new Set(["stable"])],
      ["Text", new Set(["stable"])],
      ["Dialog", new Set(["experimental"])],
    ])

    const analysis = analyzeGuideImports(
      importsByGuideSlug,
      exportedSymbols,
      stableFirstGuideSlugs,
      symbolMaturitiesByName,
    )

    expect(analysis.unknownImportsByGuide).toEqual([])
    expect(analysis.nonStableImportsByGuide).toEqual([])
  })

  it("detects unknown and non-stable imports in guides", () => {
    const importsByGuideSlug = new Map([
      ["installation", ["Form", "Button"]],
      ["first-page", ["UnknownSymbol"]],
    ])
    const exportedSymbols = new Set(["Form", "Button"])
    const stableFirstGuideSlugs = ["installation", "first-page"]
    const symbolMaturitiesByName = new Map([
      ["Form", new Set(["stable"])],
      ["Button", new Set(["experimental"])],
    ])

    const analysis = analyzeGuideImports(
      importsByGuideSlug,
      exportedSymbols,
      stableFirstGuideSlugs,
      symbolMaturitiesByName,
    )

    expect(analysis.unknownImportsByGuide).toEqual([{ guideSlug: "first-page", symbols: ["UnknownSymbol"] }])
    expect(analysis.nonStableImportsByGuide).toEqual([{ guideSlug: "installation", symbols: ["Button"] }])
  })

  it("detects unknown import paths used in guides", () => {
    const importGroupsByGuideSlug = new Map([
      [
        "runtime-and-hydration",
        new Map([
          ["@lukasmurdock/remix-ui-components/client", ["run"]],
          ["@lukasmurdock/remix-ui-components/unknown", ["mystery"]],
        ]),
      ],
    ])
    const allowedImportPaths = new Set([
      "@lukasmurdock/remix-ui-components",
      "@lukasmurdock/remix-ui-components/client",
      "@lukasmurdock/remix-ui-components/server",
    ])

    const analysis = analyzeGuideImportPaths(importGroupsByGuideSlug, allowedImportPaths)

    expect(analysis.unknownImportPathsByGuide).toEqual([
      { guideSlug: "runtime-and-hydration", importPath: "@lukasmurdock/remix-ui-components/unknown" },
    ])
  })

  it("detects unknown symbols by known import path", () => {
    const importGroupsByGuideSlug = new Map([
      [
        "runtime-and-hydration",
        new Map([
          ["@lukasmurdock/remix-ui-components/client", ["run", "unknownClient"]],
          ["@lukasmurdock/remix-ui-components/server", ["renderToStream"]],
        ]),
      ],
    ])
    const exportedSymbolsByImportPath = new Map([
      ["@lukasmurdock/remix-ui-components/client", new Set(["run", "navigate", "link"])],
      ["@lukasmurdock/remix-ui-components/server", new Set(["renderToStream", "renderToString"])],
    ])

    const analysis = analyzeGuideSymbolImportsByPath(importGroupsByGuideSlug, exportedSymbolsByImportPath)

    expect(analysis.unknownImportsByGuideAndPath).toEqual([
      {
        guideSlug: "runtime-and-hydration",
        importPath: "@lukasmurdock/remix-ui-components/client",
        symbols: ["unknownClient"],
      },
    ])
  })
})
