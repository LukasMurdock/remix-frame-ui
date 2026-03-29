import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

test("pull to refresh demo triggers refresh only past threshold", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="pull-to-refresh-basic"></div>')

  const scroll = page.locator("[data-role='ptr-scroll']")
  const label = page.locator("[data-role='ptr-label']")
  const count = page.locator("[data-role='ptr-count']")

  await expect(count).toHaveText("Refresh count: 0")
  await expect(label).toHaveText("Pull to refresh")

  const shortBox = await scroll.boundingBox()
  expect(shortBox).not.toBeNull()
  if (!shortBox) return

  const shortX = shortBox.x + shortBox.width / 2
  const shortY = shortBox.y + 12

  await page.mouse.move(shortX, shortY)
  await page.mouse.down()
  await page.mouse.move(shortX, shortY + 36)
  await page.mouse.up()

  await expect(count).toHaveText("Refresh count: 0")
  await expect(label).toHaveText("Pull to refresh")

  const longBox = await scroll.boundingBox()
  expect(longBox).not.toBeNull()
  if (!longBox) return

  const longX = longBox.x + longBox.width / 2
  const longY = longBox.y + 12

  await page.mouse.move(longX, longY)
  await page.mouse.down()
  await page.mouse.move(longX, longY + 170)
  await page.mouse.up()

  await expect(label).toHaveText(/Refreshing\.\.\.|Refresh complete/)
  await expect(count).toHaveText("Refresh count: 1")
  await expect(label).toHaveText("Refresh complete")
})
