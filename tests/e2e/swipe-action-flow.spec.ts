import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

test("swipe action demo reveals sides and executes actions", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="swipe-action-basic"></div>')

  const root = page.locator("[data-role='swipe-root']")
  const content = page.locator("[data-role='swipe-content']")
  const state = page.locator("[data-role='swipe-state']")

  await expect(root).toHaveAttribute("data-open-side", "none")

  const endBox = await content.boundingBox()
  expect(endBox).not.toBeNull()
  if (!endBox) return

  const endX = endBox.x + endBox.width / 2
  const endY = endBox.y + endBox.height / 2

  await page.mouse.move(endX, endY)
  await page.mouse.down()
  await page.mouse.move(endX - 180, endY)
  await page.mouse.up()

  await expect(root).toHaveAttribute("data-open-side", "end")
  await page.waitForTimeout(220)
  await page.getByRole("button", { name: "Delete" }).click()
  await expect(state).toHaveText("Last action: delete (end)")
  await expect(root).toHaveAttribute("data-open-side", "none")

  const startBox = await content.boundingBox()
  expect(startBox).not.toBeNull()
  if (!startBox) return

  const startX = startBox.x + startBox.width / 2
  const startY = startBox.y + startBox.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + 120, startY)
  await page.mouse.up()

  await expect(root).toHaveAttribute("data-open-side", "start")
  await page.waitForTimeout(220)
  await page.getByRole("button", { name: "Pin" }).click()
  await expect(state).toHaveText("Last action: pin (start)")
  await expect(root).toHaveAttribute("data-open-side", "none")
})
