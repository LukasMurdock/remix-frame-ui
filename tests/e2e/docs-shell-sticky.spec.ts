import { expect, test } from "@playwright/test"

test("docs sidebar remains sticky while page scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.setContent(`
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; }
      .rf-app-shell {
        --rf-app-shell-sidebar-width: 15rem;
        display: grid;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        overflow: hidden;
        background: #fff;
        min-height: 16rem;
      }
      .docs-site-shell.rf-app-shell {
        min-height: 100vh;
        border: 0;
        border-radius: 0;
        overflow: visible;
        background: transparent;
        --rf-app-shell-sidebar-width: 18rem;
      }
      .docs-site-shell .rf-app-shell-header {
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid #dbe3ee;
        background: #fff;
        padding: 1rem 1.25rem;
      }
      .docs-site-shell .rf-app-shell-body {
        display: grid;
        grid-template-columns: var(--rf-app-shell-sidebar-width) minmax(0, 1fr);
      }
      .docs-site-shell .rf-app-shell-sidebar {
        position: sticky;
        top: 4.2rem;
        height: calc(100vh - 4.2rem);
        overflow: auto;
        border-right: 1px solid #dbe3ee;
        background: #f8fafc;
        padding: 1rem;
      }
      .rf-app-shell-main { padding: 1rem; }
      .spacer { height: 2600px; background: linear-gradient(#fff, #e2e8f0); }
    </style>

    <section class="rf-app-shell docs-site-shell" data-sidebar-state="expanded">
      <header class="rf-app-shell-header">Docs header</header>
      <div class="rf-app-shell-body">
        <aside class="rf-app-shell-sidebar" id="sidebar">Sidebar</aside>
        <main class="rf-app-shell-main"><div class="spacer"></div></main>
      </div>
    </section>
  `)

  const topBefore = await page.locator("#sidebar").evaluate((el) => el.getBoundingClientRect().top)
  await page.evaluate(() => window.scrollTo(0, 800))
  const topAfter = await page.locator("#sidebar").evaluate((el) => el.getBoundingClientRect().top)

  expect(topAfter).toBeGreaterThan(50)
  expect(Math.abs(topAfter - topBefore)).toBeLessThan(4)
})
