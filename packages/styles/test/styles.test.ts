import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("styles package", () => {
  it("declares layer ordering", () => {
    const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8")
    expect(css).toContain("@layer tokens, primitives, patterns, components;")
  })

  it("includes typography utility class rules", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components.css"), "utf8")
    expect(css).toContain(".rf-typography-heading")
    expect(css).toContain(".rf-typography-text")
    expect(css).toContain(".rf-typography-pre")
    expect(css).toContain(".rf-typography-code")
  })
})
