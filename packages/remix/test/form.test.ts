import { describe, expect, it } from "vitest"
import {
  normalizeFormErrorSummaryItems,
  resolveFormBusy,
  resolveFormMethod,
  resolveFormNoValidate,
} from "../src/components/Form"

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

  it("normalizes summary errors for plain and linked modes", () => {
    expect(normalizeFormErrorSummaryItems(["Email is required"])).toEqual([{ message: "Email is required" }])
    expect(normalizeFormErrorSummaryItems([{ message: "Enter a valid email", fieldId: "email" }])).toEqual([
      { message: "Enter a valid email", href: "#email" },
    ])
    expect(normalizeFormErrorSummaryItems([{ message: "Choose a plan", fieldId: "#plan" }])).toEqual([
      { message: "Choose a plan", href: "#plan" },
    ])
  })
})
