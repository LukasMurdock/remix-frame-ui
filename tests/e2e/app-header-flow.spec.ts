import { expect, test } from "@playwright/test"

test("app header exposes title and primary nav", async ({ page }) => {
  await page.setContent(`
    <header>
      <h1 id="title">Workspace</h1>
      <nav aria-label="Primary">
        <a href="#overview">Overview</a>
        <a href="#deployments">Deployments</a>
      </nav>
    </header>
  `)

  await expect(page.locator("#title")).toHaveText("Workspace")
  await expect(page.locator("nav[aria-label='Primary'] a")).toHaveCount(2)
})
