import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

test("docs tree demo toggle expands and collapses", async ({ page }) => {
  await mountWithDocsRuntime(
    page,
    `
    <style>
      .rf-tree-group { display: grid; }
    </style>
    <div class="demo-mount" data-demo="tree-basic"></div>
  `,
  )

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
