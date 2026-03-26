import { expect, test } from "@playwright/test"

test("date picker opens and selects a day", async ({ page }) => {
  await page.setContent(`
    <div class="rf-date-picker">
      <input id="date-input" type="text" value="2026-03-25" aria-expanded="false" />
      <button id="date-toggle" type="button" aria-label="Open calendar">Open</button>
      <section id="calendar" role="dialog" hidden>
        <button type="button" data-date="2026-03-26">26</button>
        <button type="button" data-date="2026-03-27">27</button>
      </section>
    </div>
    <script>
      const input = document.querySelector('#date-input');
      const toggle = document.querySelector('#date-toggle');
      const calendar = document.querySelector('#calendar');
      const days = Array.from(document.querySelectorAll('#calendar [data-date]'));

      const setOpen = (next) => {
        calendar.hidden = !next;
        input.setAttribute('aria-expanded', String(next));
      };

      toggle.addEventListener('click', () => setOpen(calendar.hidden));
      for (const day of days) {
        day.addEventListener('click', () => {
          input.value = day.dataset.date;
          setOpen(false);
        });
      }
    </script>
  `)

  await page.click("#date-toggle")
  await expect(page.locator("#date-input")).toHaveAttribute("aria-expanded", "true")

  await page.click("#calendar [data-date='2026-03-27']")
  await expect(page.locator("#date-input")).toHaveValue("2026-03-27")
  await expect(page.locator("#date-input")).toHaveAttribute("aria-expanded", "false")

  await page.fill("#date-input", "2026-04-02")
  await expect(page.locator("#date-input")).toHaveValue("2026-04-02")
})
