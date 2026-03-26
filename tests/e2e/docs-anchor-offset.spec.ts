import { expect, test } from "@playwright/test"

test("docs anchor navigation accounts for sticky header offset", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.setContent(`
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; }
      .rf-app-shell { min-height: 100vh; }
      .rf-app-shell-header {
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid #dbe3ee;
        background: #fff;
        padding: 1rem 1.25rem;
      }
      .rf-app-shell-main { padding: 1rem 1.25rem; }
      .docs-site-content article {
        margin-bottom: 70vh;
        scroll-margin-top: 5.25rem;
      }
    </style>
    <section class="rf-app-shell">
      <header class="rf-app-shell-header" id="header">Docs header</header>
      <main class="rf-app-shell-main docs-site-content">
        <a id="jump" href="#target">Go to target</a>
        <div style="height:2200px"></div>
        <article id="target"><h2>Target</h2></article>
        <div style="height:1400px"></div>
      </main>
    </section>
  `)

  await page.locator("#jump").click()

  const headerHeight = await page.locator("#header").evaluate((el) => el.getBoundingClientRect().height)
  const targetTop = await page.locator("#target").evaluate((el) => el.getBoundingClientRect().top)

  expect(targetTop).toBeGreaterThanOrEqual(headerHeight - 2)
  expect(targetTop).toBeLessThanOrEqual(headerHeight + 48)
})
