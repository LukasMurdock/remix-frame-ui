import { expect, test } from "@playwright/test"

test("descriptions layout toggles between horizontal and vertical", async ({ page }) => {
  await page.setContent(`
    <section id="root" class="rf-descriptions" data-layout="horizontal" style="--rf-descriptions-columns: 3;">
      <dl class="rf-descriptions-list">
        <div class="rf-descriptions-item"><dt>Environment</dt><dd>Production</dd></div>
      </dl>
    </section>
    <button id="toggle" type="button">Toggle</button>
    <p id="state">Layout: horizontal</p>
    <script>
      const root = document.getElementById('root')
      const state = document.getElementById('state')
      document.getElementById('toggle').addEventListener('click', () => {
        const next = root.dataset.layout === 'vertical' ? 'horizontal' : 'vertical'
        root.dataset.layout = next
        state.textContent = 'Layout: ' + next
      })
    </script>
  `)

  const root = page.locator("#root")
  await expect(root).toHaveAttribute("data-layout", "horizontal")
  await page.locator("#toggle").click()
  await expect(root).toHaveAttribute("data-layout", "vertical")
  await expect(page.locator("#state")).toHaveText("Layout: vertical")
})
