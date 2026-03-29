import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

test("anchor demo updates active link state", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="anchor-basic"></div>')

  const overview = page.locator(".rf-anchor-link[data-value='#overview']")
  const api = page.locator(".rf-anchor-link[data-value='#api']")
  const state = page.locator("#anchor-state")

  await expect(overview).toHaveAttribute("data-active", "true")
  await expect(state).toHaveText("Active: #overview")

  await api.click()
  await expect(api).toHaveAttribute("data-active", "true")
  await expect(api).toHaveAttribute("aria-current", "location")
  await expect(overview).toHaveAttribute("data-active", "false")
  await expect(state).toHaveText("Active: #api")
})

test("anchor demo keeps default active item when hash changes", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="anchor-basic"></div>')

  const overview = page.locator(".rf-anchor-link[data-value='#overview']")
  const api = page.locator(".rf-anchor-link[data-value='#api']")
  const state = page.locator("#anchor-state")

  await page.evaluate(() => {
    window.location.hash = "#api"
    window.dispatchEvent(new HashChangeEvent("hashchange"))
  })
  await expect(overview).toHaveAttribute("data-active", "true")
  await expect(api).toHaveAttribute("data-active", "false")
  await expect(state).toHaveText("Active: #overview")

  await page.evaluate(() => {
    window.location.hash = "#missing"
    window.dispatchEvent(new HashChangeEvent("hashchange"))
  })
  await expect(overview).toHaveAttribute("data-active", "true")
  await expect(state).toHaveText("Active: #overview")
})

test("controlled anchor demo updates callback state on click", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="anchor-controlled"></div>')

  const overview = page.locator(".rf-anchor-link[data-value='#overview']")
  const api = page.locator(".rf-anchor-link[data-value='#api']")
  const state = page.locator("#anchor-controlled-state")

  await expect(overview).toHaveAttribute("data-active", "true")
  await expect(state).toHaveText("onActiveHrefChange: #overview")

  await api.click()

  await expect(api).toHaveAttribute("data-active", "true")
  await expect(api).toHaveAttribute("aria-current", "location")
  await expect(overview).toHaveAttribute("data-active", "false")
  await expect(state).toHaveText("onActiveHrefChange: #api")
})
