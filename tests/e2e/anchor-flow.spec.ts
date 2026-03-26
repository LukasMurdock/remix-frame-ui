import fs from "node:fs"
import path from "node:path"
import { expect, test } from "@playwright/test"

test("anchor demo updates active link state", async ({ page }) => {
  await page.setContent('<div class="demo-mount" data-demo="anchor-basic"></div>')

  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  const runtimeSource = fs.readFileSync(runtimePath, "utf8")
  await page.addScriptTag({ content: runtimeSource, type: "module" })

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

test("anchor demo syncs active item from URL hash", async ({ page }) => {
  await page.setContent('<div class="demo-mount" data-demo="anchor-basic"></div>')

  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  const runtimeSource = fs.readFileSync(runtimePath, "utf8")
  await page.addScriptTag({ content: runtimeSource, type: "module" })

  const overview = page.locator(".rf-anchor-link[data-value='#overview']")
  const faq = page.locator(".rf-anchor-link[data-value='#faq']")
  const state = page.locator("#anchor-state")

  await page.evaluate(() => {
    window.location.hash = "#faq"
  })
  await expect(faq).toHaveAttribute("data-active", "true")
  await expect(state).toHaveText("Active: #faq")

  await page.evaluate(() => {
    window.location.hash = "#missing"
  })
  await expect(overview).toHaveAttribute("data-active", "true")
  await expect(state).toHaveText("Active: #overview")
})

test("controlled anchor demo reacts to hashchange via callback state", async ({ page }) => {
  await page.setContent('<div class="demo-mount" data-demo="anchor-controlled"></div>')

  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  const runtimeSource = fs.readFileSync(runtimePath, "utf8")
  await page.addScriptTag({ content: runtimeSource, type: "module" })

  const overview = page.locator(".rf-anchor-link[data-value='#overview']")
  const faq = page.locator(".rf-anchor-link[data-value='#faq']")
  const state = page.locator("#anchor-controlled-state")

  await expect(overview).toHaveAttribute("data-active", "true")
  await expect(state).toHaveText("onActiveHrefChange: #overview")

  await page.evaluate(() => {
    window.location.hash = "#faq"
  })

  await expect(faq).toHaveAttribute("data-active", "true")
  await expect(faq).toHaveAttribute("aria-current", "location")
  await expect(overview).toHaveAttribute("data-active", "false")
  await expect(state).toHaveText("onActiveHrefChange: #faq")
})
