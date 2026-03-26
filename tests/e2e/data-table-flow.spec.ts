import { expect, test } from "@playwright/test"

test("data table sorts and paginates rows", async ({ page }) => {
  await page.setContent(`
    <table>
      <thead>
        <tr>
          <th><button id="sort" type="button">Sort</button></th>
        </tr>
      </thead>
      <tbody id="body"></tbody>
    </table>
    <button id="prev" type="button">Previous</button>
    <button id="next" type="button">Next</button>
    <p id="status"></p>
    <script>
      let page = 1;
      const pageSize = 2;
      let rows = [
        { key: 'a', name: 'Release 1.0', duration: 91 },
        { key: 'b', name: 'Release 1.1', duration: 132 },
        { key: 'c', name: 'Release 1.2', duration: 64 },
      ];
      const body = document.getElementById('body');
      const status = document.getElementById('status');
      const prev = document.getElementById('prev');
      const next = document.getElementById('next');
      let asc = true;

      function render() {
        const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
        page = Math.min(Math.max(1, page), totalPages);
        const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);
        body.innerHTML = pageRows.map((row) => '<tr data-key="' + row.key + '"><td>' + row.duration + '</td></tr>').join('');
        status.textContent = 'Page ' + page + ' of ' + totalPages;
        prev.disabled = page <= 1;
        next.disabled = page >= totalPages;
      }

      document.getElementById('sort').addEventListener('click', () => {
        rows = [...rows].sort((a, b) => asc ? a.duration - b.duration : b.duration - a.duration);
        asc = !asc;
        page = 1;
        render();
      });
      prev.addEventListener('click', () => { page -= 1; render(); });
      next.addEventListener('click', () => { page += 1; render(); });
      render();
    </script>
  `)

  const status = page.locator("#status")
  const firstRow = page.locator("#body tr").first()

  await expect(status).toHaveText("Page 1 of 2")
  await page.locator("#sort").click()
  await expect(firstRow).toHaveAttribute("data-key", "c")
  await page.locator("#next").click()
  await expect(status).toHaveText("Page 2 of 2")
})
