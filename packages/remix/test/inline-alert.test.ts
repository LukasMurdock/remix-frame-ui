import { describe, expect, it } from "vitest"
import { resolveInlineAlertRole, resolveInlineAlertTone } from "../src/components/InlineAlert"

describe("inline alert helpers", () => {
  it("defaults tone to info", () => {
    expect(resolveInlineAlertTone()).toBe("info")
    expect(resolveInlineAlertTone("danger")).toBe("danger")
  })

  it("maps warning and danger to alert role", () => {
    expect(resolveInlineAlertRole("warning")).toBe("alert")
    expect(resolveInlineAlertRole("danger")).toBe("alert")
    expect(resolveInlineAlertRole("success")).toBe("status")
  })
})
