import { expect, test } from "@playwright/test"

test("app shell toggles sidebar state", async ({ page }) => {
  await page.setContent(`
    <section id="shell" data-sidebar-state="expanded">
      <button id="toggle" type="button">Toggle</button>
      <aside id="sidebar">Sidebar</aside>
    </section>
    <script>
      const shell = document.getElementById('shell');
      const toggle = document.getElementById('toggle');
      const sidebar = document.getElementById('sidebar');

      function sync() {
        sidebar.hidden = shell.dataset.sidebarState === 'collapsed';
      }

      toggle.addEventListener('click', () => {
        shell.dataset.sidebarState = shell.dataset.sidebarState === 'collapsed' ? 'expanded' : 'collapsed';
        sync();
      });

      sync();
    </script>
  `)

  const shell = page.locator("#shell")
  const toggle = page.locator("#toggle")
  const sidebar = page.locator("#sidebar")

  await expect(shell).toHaveAttribute("data-sidebar-state", "expanded")
  await expect(sidebar).toBeVisible()
  await toggle.click()
  await expect(shell).toHaveAttribute("data-sidebar-state", "collapsed")
  await expect(sidebar).toBeHidden()
  await toggle.click()
  await expect(shell).toHaveAttribute("data-sidebar-state", "expanded")
  await expect(sidebar).toBeVisible()
})
