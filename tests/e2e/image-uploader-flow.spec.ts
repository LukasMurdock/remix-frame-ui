import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

function tinyPngBuffer(): Buffer {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
    "base64",
  )
}

test("image uploader demo previews, removes, and caps image count", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="image-uploader-basic"></div>')

  const state = page.locator("[data-role='image-uploader-state']")
  const listItems = page.locator("[data-role='image-uploader-list'] .rf-image-uploader-item[data-item-id]")
  const viewerOverlay = page.locator("[data-role='image-uploader-viewer-overlay']")
  const viewerCounter = page.locator("[data-role='image-uploader-viewer-counter']")

  await expect(state).toHaveText("No images selected")
  await expect(viewerOverlay).toBeHidden()

  await page.locator("[data-role='image-uploader-input']").setInputFiles([
    {
      name: "one.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer(),
    },
    {
      name: "two.jpg",
      mimeType: "image/png",
      buffer: tinyPngBuffer(),
    },
  ])

  await expect(state).toHaveText("2 selected")
  await expect(listItems).toHaveCount(2)
  await expect
    .poll(async () =>
      page
        .locator("[data-role='image-uploader-list'] .rf-image-uploader-image")
        .first()
        .evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0)

  await page.locator("button[data-preview-id]").first().click()
  await expect(viewerOverlay).toBeVisible()
  await expect(viewerCounter).toHaveText("1 / 2")
  await page.locator("[data-role='image-uploader-viewer-close']").click()
  await expect(viewerOverlay).toBeHidden()

  await page.locator("button[data-remove-id]").first().click()
  await expect(state).toHaveText("1 selected")
  await expect(listItems).toHaveCount(1)

  await page.locator("[data-role='image-uploader-input']").setInputFiles([
    {
      name: "three.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer(),
    },
    {
      name: "four.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer(),
    },
    {
      name: "five.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer(),
    },
  ])

  await expect(state).toHaveText("4 selected")
  await expect(listItems).toHaveCount(4)
  await expect(page.locator("[data-role='image-uploader-input']")).toHaveCount(0)
})

test("image uploader demo revokes object urls on unmount", async ({ page }) => {
  await mountWithDocsRuntime(
    page,
    '<div id="image-uploader-mount" class="demo-mount" data-demo="image-uploader-basic"></div>',
  )

  await page.evaluate(() => {
    const current = URL.revokeObjectURL.bind(URL)
    let count = 0
    URL.revokeObjectURL = (value) => {
      count += 1
      return current(value)
    }
    ;(window as Window & { __getRevokeCount?: () => number }).__getRevokeCount = () => count
  })

  await page.locator("[data-role='image-uploader-input']").setInputFiles([
    {
      name: "cleanup.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer(),
    },
  ])

  await page.evaluate(() => {
    document.getElementById("image-uploader-mount")?.remove()
  })

  await expect
    .poll(() =>
      page.evaluate(() => {
        const getter = (window as Window & { __getRevokeCount?: () => number }).__getRevokeCount
        return getter ? getter() : 0
      }),
    )
    .toBeGreaterThan(0)
})
