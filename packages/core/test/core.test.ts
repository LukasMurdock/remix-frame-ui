import { describe, expect, it } from "vitest"
import { assertNativeInputType, createAriaFieldState, createFieldIds, getCheckboxSubmissionValue } from "../src/index"

describe("core helpers", () => {
  it("creates stable field ids", () => {
    expect(createFieldIds("name")).toEqual({
      inputId: "name-input",
      descriptionId: "name-description",
      errorId: "name-error",
    })
  })

  it("builds aria state", () => {
    expect(createAriaFieldState({ descriptionId: "d", errorId: "e", invalid: true })).toEqual({
      "aria-describedby": "d e",
      "aria-invalid": "true",
    })
  })

  it("preserves native checkbox value default", () => {
    expect(getCheckboxSubmissionValue()).toBe("on")
    expect(getCheckboxSubmissionValue("yes")).toBe("yes")
  })

  it("rejects unsupported input type", () => {
    expect(() => assertNativeInputType("number")).toThrowError("Unsupported input type: number")
  })
})
