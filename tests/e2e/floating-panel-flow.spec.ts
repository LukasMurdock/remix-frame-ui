import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

test("floating panel demo snaps to anchor buttons and keyboard keys", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="floating-panel-basic"></div>')

  const panel = page.locator("#floating-panel-demo")
  const handle = page.locator("#floating-panel-handle")
  const heightValue = page.locator("#floating-panel-height")

  await expect(panel).toBeVisible()
  await expect(heightValue).toHaveText("190px")

  await page.getByRole("button", { name: "Expanded" }).click()
  await expect(heightValue).toHaveText("300px")

  await handle.focus()
  await page.keyboard.press("ArrowDown")
  await expect(heightValue).toHaveText("190px")

  await page.keyboard.press("Home")
  await expect(heightValue).toHaveText("96px")

  await page.keyboard.press("End")
  await expect(heightValue).toHaveText("300px")
})

test("floating panel demo drag gestures snap to nearest anchors", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="floating-panel-basic"></div>')

  const handle = page.locator("#floating-panel-handle")
  const heightValue = page.locator("#floating-panel-height")

  await expect(heightValue).toHaveText("190px")

  const box = await handle.boundingBox()
  expect(box).not.toBeNull()
  if (!box) return

  const x = box.x + box.width / 2
  const y = box.y + box.height / 2

  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x, y - 150)
  await page.mouse.up()

  await expect(heightValue).toHaveText("300px")

  const updatedBox = await handle.boundingBox()
  expect(updatedBox).not.toBeNull()
  if (!updatedBox) return

  const updatedX = updatedBox.x + updatedBox.width / 2
  const updatedY = updatedBox.y + updatedBox.height / 2

  await page.mouse.move(updatedX, updatedY)
  await page.mouse.down()
  await page.mouse.move(updatedX, updatedY + 220)
  await page.mouse.up()

  await expect(heightValue).toHaveText("96px")
})
