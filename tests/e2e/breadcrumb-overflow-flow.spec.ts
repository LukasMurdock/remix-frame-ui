import { expect, test } from "@playwright/test"

test("breadcrumb overflow includes ellipsis marker and current page", async ({ page }) => {
  await page.setContent(`
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="#home">Home</a></li>
        <li><span aria-label="3 hidden breadcrumb items">...</span></li>
        <li><a href="#engineering">Engineering</a></li>
        <li><span aria-current="page">Deployments</span></li>
      </ol>
    </nav>
  `)

  await expect(page.locator("nav[aria-label='Breadcrumb']")).toBeVisible()
  await expect(page.locator("span[aria-label='3 hidden breadcrumb items']")).toHaveText("...")
  await expect(page.locator("[aria-current='page']")).toHaveText("Deployments")
})
