import { expect, test } from "@playwright/test"

test("confirm dialog captures cancel and confirm actions", async ({ page }) => {
  await page.setContent(`
    <button id="open" type="button">Delete record</button>
    <p>Last action: <strong id="result">none</strong></p>
    <div id="overlay" hidden>
      <section role="dialog" aria-modal="true" aria-labelledby="title" tabindex="-1">
        <h2 id="title">Delete this record?</h2>
        <button id="cancel" type="button">Cancel</button>
        <button id="confirm" type="button">Delete</button>
      </section>
    </div>
    <script>
      const open = document.getElementById('open');
      const overlay = document.getElementById('overlay');
      const cancel = document.getElementById('cancel');
      const confirm = document.getElementById('confirm');
      const result = document.getElementById('result');
      const dialog = overlay.querySelector('[role="dialog"]');

      function close(reason) {
        overlay.hidden = true;
        result.textContent = reason;
      }

      open.addEventListener('click', () => {
        overlay.hidden = false;
        dialog.focus();
      });

      cancel.addEventListener('click', () => close('cancel'));
      confirm.addEventListener('click', () => close('confirm'));
    </script>
  `)

  const open = page.locator("#open")
  const overlay = page.locator("#overlay")
  const cancel = page.locator("#cancel")
  const confirm = page.locator("#confirm")
  const result = page.locator("#result")

  await open.click()
  await expect(overlay).toBeVisible()
  await cancel.click()
  await expect(result).toHaveText("cancel")

  await open.click()
  await expect(overlay).toBeVisible()
  await confirm.click()
  await expect(result).toHaveText("confirm")
})
