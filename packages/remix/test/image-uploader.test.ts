import { describe, expect, it } from "vitest"
import {
  countImageUploaderActiveItems,
  limitImageUploaderItemsByActiveCount,
  limitImageUploaderItems,
  resolveImageUploaderAccept,
  resolveImageUploaderAddLabel,
  resolveImageUploaderDisableUpload,
  resolveImageUploaderDeletable,
  resolveImageUploaderMaxCount,
  resolveImageUploaderMultiple,
  resolveImageUploaderPreview,
  resolveImageUploaderShowFailed,
  resolveImageUploaderShowUpload,
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
    expect(resolveImageUploaderPreview()).toBe(true)
    expect(resolveImageUploaderPreview(false)).toBe(false)
    expect(resolveImageUploaderShowFailed()).toBe(true)
    expect(resolveImageUploaderShowFailed(false)).toBe(false)
    expect(resolveImageUploaderShowUpload()).toBe(true)
    expect(resolveImageUploaderShowUpload(false)).toBe(false)
    expect(resolveImageUploaderDisableUpload()).toBe(false)
    expect(resolveImageUploaderDisableUpload(true)).toBe(true)
    expect(resolveImageUploaderAccept()).toBe("image/*")
    expect(resolveImageUploaderAddLabel()).toBe("Add image")
  })

  it("normalizes accept values and item limits", () => {
    expect(resolveImageUploaderAccept([" image/png ", "image/jpeg"])).toBe("image/png,image/jpeg")
    expect(resolveImageUploaderAccept("image/*, .webp, ")).toBe("image/*,.webp")
    expect(limitImageUploaderItems(items, 2).map((item) => item.id)).toEqual(["1", "2"])
  })

  it("counts active items when failed tiles are hidden", () => {
    expect(countImageUploaderActiveItems(items, true)).toBe(3)
    expect(
      countImageUploaderActiveItems(
        [
          ...items,
          {
            id: "4",
            src: "d.jpg",
            fileName: "d.jpg",
            error: true,
          },
        ],
        false,
      ),
    ).toBe(3)
  })

  it("limits by active count while preserving failed entries", () => {
    expect(
      limitImageUploaderItemsByActiveCount(
        [
          items[0]!,
          {
            id: "4",
            src: "d.jpg",
            fileName: "d.jpg",
            error: true,
          },
          items[1]!,
          items[2]!,
        ],
        2,
        false,
      ).map((item) => item.id),
    ).toEqual(["1", "4", "2"])
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
