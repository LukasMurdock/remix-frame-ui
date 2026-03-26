import { expect, test } from "@playwright/test"

test("breadcrumbs marks current page and exposes links", async ({ page }) => {
  await page.setContent(`
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="#home">Home</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><span aria-current="page">Roadmap</span></li>
      </ol>
    </nav>
  `)

  const nav = page.locator("nav[aria-label='Breadcrumb']")
  const links = page.locator("nav a")
  const current = page.locator("[aria-current='page']")

  await expect(nav).toBeVisible()
  await expect(links).toHaveCount(2)
  await expect(current).toHaveText("Roadmap")
})
