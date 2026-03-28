import fs from "node:fs"
import path from "node:path"
import { expect, test } from "@playwright/test"

function runtimeSource(): string {
  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  return fs.readFileSync(runtimePath, "utf8")
}

test("action sheet demo supports action, cancel, escape, and backdrop close reasons", async ({ page }) => {
  await page.setContent('<div class="demo-mount" data-demo="action-sheet-basic"></div>')
  await page.addScriptTag({ content: runtimeSource(), type: "module" })

  const open = page.getByRole("button", { name: "Open actions" })
  const overlay = page.locator("#action-sheet-overlay")
  const state = page.locator("#action-sheet-state")

  await expect(overlay).toBeHidden()
  await open.click()
  await expect(overlay).toBeVisible()

  await page.getByRole("button", { name: "Share" }).click()
  await expect(overlay).toBeHidden()
  await expect(state).toHaveText("Last close reason: action:share")

  await open.click()
  await expect(overlay).toBeVisible()

  await expect(page.getByRole("button", { name: "Archive (disabled)" })).toBeDisabled()
  await expect(overlay).toBeVisible()
  await expect(state).toHaveText("Last close reason: action:share")

  await page.keyboard.press("Escape")
  await expect(overlay).toBeHidden()
  await expect(state).toHaveText("Last close reason: escape")

  await open.click()
  await expect(overlay).toBeVisible()
  await overlay.click({ position: { x: 1, y: 1 } })
  await expect(overlay).toBeHidden()
  await expect(state).toHaveText("Last close reason: backdrop")

  await open.click()
  await expect(overlay).toBeVisible()
  await page.getByRole("button", { name: "Cancel" }).click()
  await expect(overlay).toBeHidden()
  await expect(state).toHaveText("Last close reason: cancel")
  await expect(open).toBeFocused()
})
