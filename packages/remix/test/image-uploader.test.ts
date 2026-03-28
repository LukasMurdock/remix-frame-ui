import { describe, expect, it } from "vitest"
import {
  limitImageUploaderItems,
  resolveImageUploaderAccept,
  resolveImageUploaderAddLabel,
  resolveImageUploaderDeletable,
  resolveImageUploaderMaxCount,
  resolveImageUploaderMultiple,
  resolveImageUploaderUploadResult,
  type ImageUploaderValueItem,
} from "../src/components/ImageUploader"

const items: ImageUploaderValueItem[] = [
  { id: "1", src: "a.jpg", fileName: "a.jpg" },
  { id: "2", src: "b.jpg", fileName: "b.jpg" },
  { id: "3", src: "c.jpg", fileName: "c.jpg" },
]

describe("image uploader helpers", () => {
  it("resolves defaults", () => {
    expect(resolveImageUploaderMaxCount()).toBe(9)
    expect(resolveImageUploaderMaxCount(0)).toBe(1)
    expect(resolveImageUploaderMaxCount(6.8)).toBe(7)
    expect(resolveImageUploaderMultiple(undefined, 9)).toBe(true)
    expect(resolveImageUploaderMultiple(undefined, 1)).toBe(false)
    expect(resolveImageUploaderMultiple(false, 9)).toBe(false)
    expect(resolveImageUploaderDeletable()).toBe(true)
    expect(resolveImageUploaderDeletable(false)).toBe(false)
    expect(resolveImageUploaderAccept()).toBe("image/*")
    expect(resolveImageUploaderAddLabel()).toBe("Add image")
  })

  it("normalizes accept values and item limits", () => {
    expect(resolveImageUploaderAccept([" image/png ", "image/jpeg"])).toBe("image/png,image/jpeg")
    expect(resolveImageUploaderAccept("image/*, .webp, ")).toBe("image/*,.webp")
    expect(limitImageUploaderItems(items, 2).map((item) => item.id)).toEqual(["1", "2"])
  })

  it("normalizes upload result payloads", () => {
    const fallback = { alt: "fallback alt", fileName: "fallback.jpg" }
    expect(resolveImageUploaderUploadResult("https://cdn/image.jpg", fallback)).toEqual({
      src: "https://cdn/image.jpg",
      alt: "fallback alt",
      fileName: "fallback.jpg",
    })

    expect(
      resolveImageUploaderUploadResult(
        {
          src: "https://cdn/new.jpg",
          alt: "new alt",
          fileName: "new.jpg",
        },
        fallback,
      ),
    ).toEqual({
      src: "https://cdn/new.jpg",
      alt: "new alt",
      fileName: "new.jpg",
    })
  })
})
