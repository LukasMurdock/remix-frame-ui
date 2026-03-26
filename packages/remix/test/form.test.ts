import { describe, expect, it } from "vitest"
import { resolveFormBusy, resolveFormMethod, resolveFormNoValidate } from "../src/components/Form"

describe("form helpers", () => {
  it("defaults method to get", () => {
    expect(resolveFormMethod()).toBe("get")
    expect(resolveFormMethod("post")).toBe("post")
  })

  it("defaults busy to false", () => {
    expect(resolveFormBusy()).toBe(false)
    expect(resolveFormBusy(true)).toBe(true)
  })

  it("defaults noValidate to false", () => {
    expect(resolveFormNoValidate()).toBe(false)
    expect(resolveFormNoValidate(true)).toBe(true)
  })
})
