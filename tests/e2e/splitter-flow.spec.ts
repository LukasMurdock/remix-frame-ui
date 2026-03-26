import { expect, test } from "@playwright/test"

test("splitter separator keyboard resizing updates pane size", async ({ page }) => {
  await page.setContent(`
    <section class="rf-splitter" style="--rf-splitter-size:50%;display:grid;grid-template-columns:minmax(0,var(--rf-splitter-size)) 10px minmax(0,calc(100% - var(--rf-splitter-size)));width:900px;">
      <div id="first">First pane</div>
      <div id="separator" role="separator" tabindex="0" aria-valuemin="20" aria-valuemax="80" aria-valuenow="50"></div>
      <div>Second pane</div>
    </section>
    <script>
      const root = document.querySelector('.rf-splitter')
      const separator = document.getElementById('separator')
      const setSize = (next) => {
        const value = Math.max(20, Math.min(80, next))
        root.style.setProperty('--rf-splitter-size', value + '%')
        separator.setAttribute('aria-valuenow', String(value))
      }
      separator.addEventListener('keydown', (event) => {
        const current = Number(separator.getAttribute('aria-valuenow') || 50)
        if (event.key === 'ArrowRight') { event.preventDefault(); setSize(current + 5) }
        if (event.key === 'ArrowLeft') { event.preventDefault(); setSize(current - 5) }
      })
    </script>
  `)

  const separator = page.locator("#separator")
  await separator.focus()
  await page.keyboard.press("ArrowRight")
  await expect(separator).toHaveAttribute("aria-valuenow", "55")
  await page.keyboard.press("ArrowLeft")
  await expect(separator).toHaveAttribute("aria-valuenow", "50")
})
