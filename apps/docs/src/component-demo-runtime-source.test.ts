import { describe, expect, it } from "vitest"
import {
  buildRuntimeDemoSourceMap,
  parseRuntimeDemoMounts,
  serializeJsonForHtml,
} from "./component-demo-runtime-source.js"

describe("component demo runtime source", () => {
  it("parses runtime demo id to mount function mapping", () => {
    const source = `const registry = {
  "button-basic": mountButtonDemo,
  "form-basic": mountFormDemo,
  "not-demo": renderSomething,
}`

    expect([...parseRuntimeDemoMounts(source).entries()]).toEqual([
      ["button-basic", "mountButtonDemo"],
      ["form-basic", "mountFormDemo"],
    ])
  })

  it("extracts top-level mount function source by demo id", () => {
    const source = `const registry = {
  "button-basic": mountButtonDemo,
  "form-basic": mountFormDemo,
}

function mountButtonDemo(mount) {
  mount.innerHTML = "button"
}

function mountFormDemo(mount) {
  mount.innerHTML = "form"
}
`

    const map = buildRuntimeDemoSourceMap(source)

    expect(map.get("button-basic")?.mountFunctionName).toBe("mountButtonDemo")
    expect(map.get("button-basic")?.source).toContain("function mountButtonDemo(mount)")
    expect(map.get("button-basic")?.source).toContain('mount.innerHTML = "button"')
    expect(map.get("form-basic")?.source).toContain("function mountFormDemo(mount)")
    expect(map.get("form-basic")?.source).not.toContain("mountButtonDemo")
  })

  it("serializes JSON safely for inline script tags", () => {
    const payload = serializeJsonForHtml({ code: "<div>& text</div>" })
    expect(payload).toContain("\\u003cdiv\\u003e")
    expect(payload).toContain("\\u0026")
  })
})
