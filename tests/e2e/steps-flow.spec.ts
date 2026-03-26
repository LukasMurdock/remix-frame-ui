import { expect, test } from "@playwright/test"

test("steps marks current step and moves status", async ({ page }) => {
  await page.setContent(`
    <ol>
      <li data-status="current"><span aria-current="step">Account</span></li>
      <li data-status="upcoming"><span>Team</span></li>
      <li data-status="upcoming"><span>Confirm</span></li>
    </ol>
    <button id="next" type="button">Next</button>
    <script>
      const items = [...document.querySelectorAll('li')];
      const next = document.getElementById('next');
      let current = 0;
      function sync() {
        items.forEach((item, index) => {
          const label = item.querySelector('span');
          const status = index < current ? 'complete' : (index === current ? 'current' : 'upcoming');
          item.dataset.status = status;
          if (status === 'current') label.setAttribute('aria-current', 'step');
          else label.removeAttribute('aria-current');
        });
      }
      next.addEventListener('click', () => {
        current = Math.min(items.length - 1, current + 1);
        sync();
      });
      sync();
    </script>
  `)

  const current = page.locator("[aria-current='step']")
  const next = page.locator("#next")

  await expect(current).toHaveText("Account")
  await next.click()
  await expect(page.locator("li[data-status='complete']")).toHaveCount(1)
  await expect(page.locator("[aria-current='step']")).toHaveText("Team")
})
