import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

test("tab bar demo supports click and keyboard navigation", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="tab-bar-basic"></div>')

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
