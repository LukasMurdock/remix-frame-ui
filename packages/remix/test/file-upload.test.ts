import { describe, expect, it } from "vitest"
import { normalizeFileUploadAccept } from "../src/components/FileUpload"

describe("file upload helpers", () => {
  it("normalizes array accept lists", () => {
    expect(normalizeFileUploadAccept(["image/png", " image/jpeg "])).toBe("image/png,image/jpeg")
  })

  it("normalizes comma-separated accept string", () => {
    expect(normalizeFileUploadAccept("image/*, .pdf , ")).toBe("image/*,.pdf")
  })

  it("returns undefined for empty values", () => {
    expect(normalizeFileUploadAccept("")).toBeUndefined()
    expect(normalizeFileUploadAccept([])).toBeUndefined()
  })
})
