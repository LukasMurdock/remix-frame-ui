import fs from "node:fs"
import path from "node:path"
import { expect, test } from "@playwright/test"

test("cascader demo opens, drills down, and commits leaf selection", async ({ page }) => {
  await page.setContent('<div class="demo-mount" data-demo="cascader-basic"></div>')

  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  const runtimeSource = fs.readFileSync(runtimePath, "utf8")
  await page.addScriptTag({ content: runtimeSource, type: "module" })

  const trigger = page.locator("#cascader-trigger")
  const panel = page.locator("#cascader-panel")
  const state = page.locator("#cascader-state")

  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(panel).toBeVisible()

  await page.locator("button[data-level='1'][data-value='platform']").click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(state).toHaveText("Selected: engineering / platform / api")
  await expect(page.locator("#cascader-col-2")).toBeVisible()

  await page.locator("button[data-level='2'][data-value='jobs']").click()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(panel).toBeHidden()
  await expect(page.locator("#cascader-label")).toHaveText("engineering / platform / jobs")
  await expect(state).toHaveText("Selected: engineering / platform / jobs")

  await trigger.click()
  await page.locator("button[data-level='0'][data-value='design']").click()
  await expect(page.locator("#cascader-label")).toHaveText("design")
  await expect(state).toHaveText("Selected: design")
})

test("cascader demo supports keyboard navigation and escape close", async ({ page }) => {
  await page.setContent('<div class="demo-mount" data-demo="cascader-basic"></div>')

  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  const runtimeSource = fs.readFileSync(runtimePath, "utf8")
  await page.addScriptTag({ content: runtimeSource, type: "module" })

  const trigger = page.locator("#cascader-trigger")
  const panel = page.locator("#cascader-panel")
  const label = page.locator("#cascader-label")

  await trigger.focus()
  await page.keyboard.press("ArrowDown")
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(panel).toBeVisible()
  await expect(page.locator("button[data-level='2'][data-value='api']")).toBeFocused()

  await page.keyboard.press("ArrowUp")
  await expect(page.locator("button[data-level='2'][data-value='jobs']")).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(label).toHaveText("engineering / platform / jobs")

  await page.keyboard.press("Enter")
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("ArrowLeft")
  await expect(page.locator("button[data-level='1'][data-value='platform']")).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(page.locator("button[data-level='0'][data-value='engineering']")).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(page.locator("button[data-level='0'][data-value='design']")).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(label).toHaveText("design")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")

  await page.keyboard.press("Enter")
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("Escape")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(trigger).toBeFocused()
})

test("cascader demo closes on outside click and focus leave", async ({ page }) => {
  await page.setContent(
    '<button id="outside">Outside</button><div class="demo-mount" data-demo="cascader-basic"></div>',
  )

  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  const runtimeSource = fs.readFileSync(runtimePath, "utf8")
  await page.addScriptTag({ content: runtimeSource, type: "module" })

  const trigger = page.locator("#cascader-trigger")
  const panel = page.locator("#cascader-panel")
  const outside = page.locator("#outside")

  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(panel).toBeVisible()

  await outside.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(panel).toBeHidden()

  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await page.locator("button[data-level='2'][data-value='api']").focus()
  await outside.focus()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(panel).toBeHidden()
})
