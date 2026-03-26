import { expect, test } from "@playwright/test"

test("data grid sort and selection flow", async ({ page }) => {
  await page.setContent(`
    <table id="grid">
      <thead>
        <tr>
          <th><input id="all" type="checkbox" /></th>
          <th><button id="sort-name" type="button">Name</button></th>
          <th><button id="sort-duration" type="button">Duration</button></th>
        </tr>
      </thead>
      <tbody>
        <tr data-key="a"><td><input type="checkbox" /></td><td data-col="name">Deploy 3</td><td data-col="duration" data-sort-value="91">91s</td></tr>
        <tr data-key="b"><td><input type="checkbox" /></td><td data-col="name">Deploy 1</td><td data-col="duration" data-sort-value="132">132s</td></tr>
        <tr data-key="c"><td><input type="checkbox" /></td><td data-col="name">Deploy 2</td><td data-col="duration" data-sort-value="64">64s</td></tr>
      </tbody>
    </table>
    <script>
      const tbody = document.querySelector('#grid tbody');
      const all = document.getElementById('all');
      const sortDuration = document.getElementById('sort-duration');
      let direction = 'asc';

      all.addEventListener('change', () => {
        for (const check of tbody.querySelectorAll('input[type="checkbox"]')) {
          check.checked = all.checked;
        }
      });

      sortDuration.addEventListener('click', () => {
        const rows = [...tbody.querySelectorAll('tr')];
        rows.sort((a, b) => {
          const av = Number(a.querySelector('[data-col="duration"]').getAttribute('data-sort-value'));
          const bv = Number(b.querySelector('[data-col="duration"]').getAttribute('data-sort-value'));
          return direction === 'asc' ? av - bv : bv - av;
        });
        rows.forEach((row) => tbody.appendChild(row));
        direction = direction === 'asc' ? 'desc' : 'asc';
      });
    </script>
  `)

  await page.click("#sort-duration")
  await expect(page.locator("tbody tr").nth(0)).toHaveAttribute("data-key", "c")

  await page.click("#sort-duration")
  await expect(page.locator("tbody tr").nth(0)).toHaveAttribute("data-key", "b")

  await page.check("#all")
  const checks = page.locator("tbody input[type='checkbox']")
  await expect(checks.nth(0)).toBeChecked()
  await expect(checks.nth(1)).toBeChecked()
  await expect(checks.nth(2)).toBeChecked()
})
