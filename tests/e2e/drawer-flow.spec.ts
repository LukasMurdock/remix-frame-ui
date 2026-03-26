import { expect, test } from "@playwright/test"

test("drawer closes by escape and backdrop", async ({ page }) => {
  await page.setContent(`
    <button id="open" type="button">Open drawer</button>
    <div id="overlay" hidden>
      <section id="panel" role="dialog" aria-modal="true" tabindex="-1">
        <button id="close" type="button">Close</button>
      </section>
    </div>
    <script>
      const open = document.getElementById('open');
      const overlay = document.getElementById('overlay');
      const panel = document.getElementById('panel');
      const close = document.getElementById('close');

      function hide() {
        overlay.hidden = true;
      }

      open.addEventListener('click', () => {
        overlay.hidden = false;
        panel.focus();
      });

      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) hide();
      });

      panel.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') hide();
      });

      close.addEventListener('click', hide);
    </script>
  `)

  const open = page.locator("#open")
  const overlay = page.locator("#overlay")
  const panel = page.locator("#panel")

  await open.click()
  await expect(overlay).toBeVisible()
  await panel.press("Escape")
  await expect(overlay).toBeHidden()

  await open.click()
  await expect(overlay).toBeVisible()
  await overlay.click({ position: { x: 1, y: 1 } })
  await expect(overlay).toBeHidden()
})
