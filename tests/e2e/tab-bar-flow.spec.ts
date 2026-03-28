import fs from "node:fs"
import path from "node:path"
import { expect, test } from "@playwright/test"

function runtimeSource(): string {
  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  return fs.readFileSync(runtimePath, "utf8")
}

test("tab bar demo supports click and keyboard navigation", async ({ page }) => {
  await page.setContent('<div class="demo-mount" data-demo="tab-bar-basic"></div>')
  await page.addScriptTag({ content: runtimeSource(), type: "module" })

  const demo = page.locator(".demo-mount")
  const state = page.locator("[data-role='tab-bar-state']")
  const homeTab = demo.locator("button[data-tab-value='home']")
  const alertsTab = demo.locator("button[data-tab-value='alerts']")
  const profileTab = demo.locator("button[data-tab-value='profile']")
  const settingsTab = demo.locator("button[data-tab-value='settings']")

  await expect(state).toHaveText("Active tab: home")
  await expect(settingsTab).toBeDisabled()

  await alertsTab.click()
  await expect(state).toHaveText("Active tab: alerts")
  await expect(alertsTab).toHaveAttribute("aria-current", "page")

  await alertsTab.focus()
  await page.keyboard.press("ArrowRight")
  await expect(state).toHaveText("Active tab: profile")
  await expect(profileTab).toHaveAttribute("aria-current", "page")

  await page.keyboard.press("Home")
  await expect(state).toHaveText("Active tab: home")
  await expect(homeTab).toHaveAttribute("aria-current", "page")

  await page.keyboard.press("End")
  await expect(state).toHaveText("Active tab: profile")
  await expect(profileTab).toHaveAttribute("aria-current", "page")
})
