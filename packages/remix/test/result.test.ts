import { describe, expect, it } from "vitest"
import { resolveResultRole, resolveResultTone } from "../src/components/Result"

describe("result helpers", () => {
  it("defaults tone to info", () => {
    expect(resolveResultTone()).toBe("info")
    expect(resolveResultTone("success")).toBe("success")
  })

  it("maps warning and danger to alert role", () => {
    expect(resolveResultRole("warning")).toBe("alert")
    expect(resolveResultRole("danger")).toBe("alert")
    expect(resolveResultRole("info")).toBe("status")
  })
})
