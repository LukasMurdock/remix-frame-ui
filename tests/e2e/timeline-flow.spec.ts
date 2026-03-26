import { expect, test } from "@playwright/test"

test("timeline renders ordered events with pending row", async ({ page }) => {
  await page.setContent(`
    <section class="rf-timeline-wrap">
      <ol class="rf-timeline" role="list">
        <li class="rf-timeline-item" data-tone="success"><span class="rf-timeline-title">Build completed</span></li>
        <li class="rf-timeline-item" data-tone="warning"><span class="rf-timeline-title">Pending approval</span></li>
        <li class="rf-timeline-item" data-pending="true" data-tone="neutral"><span class="rf-timeline-title">Waiting</span></li>
      </ol>
    </section>
  `)

  const items = page.locator(".rf-timeline-item")
  await expect(items).toHaveCount(3)
  await expect(items.nth(0)).toHaveAttribute("data-tone", "success")
  await expect(items.nth(1)).toHaveAttribute("data-tone", "warning")
  await expect(items.nth(2)).toHaveAttribute("data-pending", "true")
})
