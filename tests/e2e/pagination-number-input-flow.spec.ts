import { expect, test } from "@playwright/test"

test("number input keyboard increments and decrements", async ({ page }) => {
  await page.setContent(`
    <label for="seats">Seats</label>
    <input id="seats" type="number" min="1" max="5" step="1" value="2" />
  `)

  const input = page.locator("#seats")
  await input.focus()
  await page.keyboard.press("ArrowUp")
  await expect(input).toHaveValue("3")
  await page.keyboard.press("ArrowDown")
  await expect(input).toHaveValue("2")
})

test("pagination next and previous controls", async ({ page }) => {
  await page.setContent(`
    <nav aria-label="Pagination">
      <button id="prev" type="button">Previous</button>
      <button class="page" type="button" data-page="1">1</button>
      <button class="page" type="button" data-page="2" aria-current="page">2</button>
      <button class="page" type="button" data-page="3">3</button>
      <button id="next" type="button">Next</button>
    </nav>
    <p id="state">2</p>
    <script>
      let current = 2;
      const total = 3;
      const pages = Array.from(document.querySelectorAll('.page'));
      const prev = document.querySelector('#prev');
      const next = document.querySelector('#next');
      const state = document.querySelector('#state');

      function sync() {
        for (const page of pages) {
          const numeric = Number(page.dataset.page);
          if (numeric === current) page.setAttribute('aria-current', 'page');
          else page.removeAttribute('aria-current');
        }
        prev.disabled = current <= 1;
        next.disabled = current >= total;
        state.textContent = String(current);
      }

      prev.addEventListener('click', () => {
        current = Math.max(1, current - 1);
        sync();
      });
      next.addEventListener('click', () => {
        current = Math.min(total, current + 1);
        sync();
      });
      for (const page of pages) {
        page.addEventListener('click', () => {
          current = Number(page.dataset.page);
          sync();
        });
      }
      sync();
    </script>
  `)

  await page.click("#next")
  await expect(page.locator("#state")).toHaveText("3")
  await expect(page.locator(".page[data-page='3']")).toHaveAttribute("aria-current", "page")
  await expect(page.locator("#next")).toBeDisabled()

  await page.click("#prev")
  await expect(page.locator("#state")).toHaveText("2")
  await expect(page.locator(".page[data-page='2']")).toHaveAttribute("aria-current", "page")
})
