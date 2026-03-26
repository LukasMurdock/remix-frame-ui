import fs from "node:fs"
import path from "node:path"
import { expect, test } from "@playwright/test"

test("docs tree demo toggle expands and collapses", async ({ page }) => {
  await page.setContent(`
    <style>
      .rf-tree-group { display: grid; }
    </style>
    <div class="demo-mount" data-demo="tree-basic"></div>
  `)

  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  const runtimeSource = fs.readFileSync(runtimePath, "utf8")
  await page.addScriptTag({ content: runtimeSource, type: "module" })

  const toggle = page.locator("[data-toggle='projects']")
  const group = page.locator("[data-group='projects']")
  const parentItem = page.locator("[data-node-id='projects']")

  await expect(toggle).toBeVisible()
  await expect(parentItem).toHaveAttribute("aria-expanded", "true")

  await toggle.click()
  await expect(parentItem).toHaveAttribute("aria-expanded", "false")
  await expect(group).toBeHidden()

  await toggle.click()
  await expect(parentItem).toHaveAttribute("aria-expanded", "true")
  await expect(group).toBeVisible()
})
