import { describe, expect, it } from "vitest"
import { resolveImageFallbackText, resolveImageFit, resolveImageLoading } from "../src/components/Image"

describe("image helpers", () => {
  it("resolves defaults", () => {
    expect(resolveImageFit()).toBe("cover")
    expect(resolveImageLoading()).toBe("lazy")
    expect(resolveImageFallbackText()).toBe("Image unavailable")
  })

  it("keeps explicit options", () => {
    expect(resolveImageFit("contain")).toBe("contain")
    expect(resolveImageLoading("eager")).toBe("eager")
    expect(resolveImageFallbackText("No preview")).toBe("No preview")
  })
})
