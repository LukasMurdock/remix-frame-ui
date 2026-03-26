import { expect, test } from "@playwright/test"

test("date time picker combines date and time", async ({ page }) => {
  await page.setContent(`
    <div>
      <input id="date" type="date" value="2026-03-25" />
      <input id="time" type="time" value="09:30" />
      <input id="combined" type="hidden" name="scheduledAt" value="2026-03-25T09:30" />
      <script>
        const date = document.querySelector('#date');
        const time = document.querySelector('#time');
        const combined = document.querySelector('#combined');

        function sync() {
          combined.value = date.value && time.value ? date.value + 'T' + time.value : '';
        }

        date.addEventListener('input', sync);
        time.addEventListener('input', sync);
      </script>
    </div>
  `)

  await expect(page.locator("#combined")).toHaveValue("2026-03-25T09:30")

  await page.locator("#date").fill("2026-04-01")
  await page.locator("#time").fill("10:45")
  await expect(page.locator("#combined")).toHaveValue("2026-04-01T10:45")
})
