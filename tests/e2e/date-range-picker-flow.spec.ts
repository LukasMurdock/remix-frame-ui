import { expect, test } from "@playwright/test"

test("date range picker selects start and end", async ({ page }) => {
  await page.setContent(`
    <div>
      <input id="range-input" type="text" value="" aria-expanded="false" />
      <button id="range-toggle" type="button">Open</button>
      <section id="range-panel" hidden>
        <button type="button" data-date="2026-03-12">12</button>
        <button type="button" data-date="2026-03-16">16</button>
      </section>
      <script>
        const input = document.querySelector('#range-input');
        const toggle = document.querySelector('#range-toggle');
        const panel = document.querySelector('#range-panel');
        let range = { start: undefined, end: undefined };

        function setOpen(next) {
          panel.hidden = !next;
          input.setAttribute('aria-expanded', String(next));
        }

        function sync() {
          if (range.start && range.end) {
            input.value = range.start + ' - ' + range.end;
          } else if (range.start) {
            input.value = range.start + ' -';
          } else {
            input.value = '';
          }
        }

        toggle.addEventListener('click', () => setOpen(panel.hidden));
        panel.addEventListener('click', (event) => {
          const target = event.target;
          if (!(target instanceof HTMLElement)) return;
          const button = target.closest('button[data-date]');
          if (!(button instanceof HTMLButtonElement)) return;
          const date = button.dataset.date;
          if (!date) return;

          if (!range.start || range.end) {
            range = { start: date, end: undefined };
          } else if (date < range.start) {
            range = { start: date, end: range.start };
          } else {
            range = { start: range.start, end: date };
          }

          sync();
          if (range.start && range.end) setOpen(false);
        });
      </script>
    </div>
  `)

  await page.click("#range-toggle")
  await expect(page.locator("#range-input")).toHaveAttribute("aria-expanded", "true")

  await page.click("#range-panel [data-date='2026-03-12']")
  await expect(page.locator("#range-input")).toHaveValue("2026-03-12 -")

  await page.click("#range-panel [data-date='2026-03-16']")
  await expect(page.locator("#range-input")).toHaveValue("2026-03-12 - 2026-03-16")
  await expect(page.locator("#range-input")).toHaveAttribute("aria-expanded", "false")
})
