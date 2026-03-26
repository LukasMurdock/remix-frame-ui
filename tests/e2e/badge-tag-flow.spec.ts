import { expect, test } from "@playwright/test"

test("badge and tag tone attributes are present", async ({ page }) => {
  await page.setContent(`
    <div>
      <span class="rf-badge" data-tone="success">Live</span>
      <span class="rf-tag" data-tone="brand">Engineering</span>
    </div>
  `)

  await expect(page.locator(".rf-badge")).toHaveText("Live")
  await expect(page.locator(".rf-badge")).toHaveAttribute("data-tone", "success")
  await expect(page.locator(".rf-tag")).toHaveText("Engineering")
  await expect(page.locator(".rf-tag")).toHaveAttribute("data-tone", "brand")
})
