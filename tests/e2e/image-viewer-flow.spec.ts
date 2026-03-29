import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

test("image viewer demo supports navigation and close reasons", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="image-viewer-basic"></div>')

  const open = page.locator("[data-role='image-viewer-open']")
  const overlay = page.locator("[data-role='image-viewer-overlay']")
  const panel = page.locator(".rf-image-viewer")
  const counter = page.locator("[data-role='image-viewer-counter']")
  const state = page.locator("[data-role='image-viewer-state']")

  await expect(overlay).toBeHidden()
  await open.click()
  await expect(overlay).toBeVisible()
  await expect(counter).toHaveText("1 / 3")

  await page.getByRole("button", { name: "Next image" }).click()
  await expect(counter).toHaveText("2 / 3")

  await panel.press("End")
  await expect(counter).toHaveText("3 / 3")

  await panel.press("ArrowRight")
  await expect(counter).toHaveText("3 / 3")

  await panel.press("Escape")
  await expect(overlay).toBeHidden()
  await expect(state).toHaveText("escape")

  await open.click()
  await expect(overlay).toBeVisible()
  await overlay.evaluate((node) => {
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  })
  await expect(overlay).toBeHidden()
  await expect(state).toHaveText("backdrop")

  await open.click()
  await expect(overlay).toBeVisible()
  await page.getByRole("button", { name: "Close" }).click()
  await expect(overlay).toBeHidden()
  await expect(state).toHaveText("close-button")
  await expect(open).toBeFocused()
})
