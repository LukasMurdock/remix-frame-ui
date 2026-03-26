import { expect, test } from "@playwright/test"

test("data table filtering resets pagination and narrows rows", async ({ page }) => {
  await page.setContent(`
    <button id="open" type="button">Open filters</button>
    <div id="overlay" hidden>
      <input id="query" type="search" placeholder="Search releases" />
      <select id="status">
        <option value="all">All</option>
        <option value="success">Success</option>
        <option value="running">Running</option>
        <option value="failed">Failed</option>
      </select>
      <button id="apply" type="button">Apply filters</button>
      <button id="close" type="button">Close</button>
    </div>

    <table>
      <tbody id="body"></tbody>
    </table>
    <button id="prev" type="button">Previous</button>
    <button id="next" type="button">Next</button>
    <p id="status-line"></p>

    <script>
      const overlay = document.getElementById("overlay")
      const queryInput = document.getElementById("query")
      const statusInput = document.getElementById("status")
      const body = document.getElementById("body")
      const statusLine = document.getElementById("status-line")
      const prev = document.getElementById("prev")
      const next = document.getElementById("next")
      const pageSize = 2

      const allRows = [
        { key: "release-1", name: "Release 1.0", status: "success" },
        { key: "release-2", name: "Release 1.1", status: "failed" },
        { key: "release-3", name: "Release 1.2", status: "running" },
        { key: "release-4", name: "Release 1.3", status: "success" },
      ]

      let rows = [...allRows]
      let page = 1

      function render() {
        const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
        page = Math.min(Math.max(1, page), totalPages)
        const pageRows = rows.slice((page - 1) * pageSize, page * pageSize)
        body.innerHTML = pageRows.map((row) => '<tr data-key="' + row.key + '"><td>' + row.name + '</td></tr>').join("")
        statusLine.textContent = 'Page ' + page + ' of ' + totalPages + ' | ' + rows.length + ' results'
        prev.disabled = page <= 1
        next.disabled = page >= totalPages
      }

      function applyFilters() {
        const query = queryInput.value.trim().toLowerCase()
        const status = statusInput.value
        rows = allRows.filter((row) => {
          const matchesQuery = query === "" || row.name.toLowerCase().includes(query)
          const matchesStatus = status === "all" || row.status === status
          return matchesQuery && matchesStatus
        })
        page = 1
        overlay.hidden = true
        render()
      }

      document.getElementById("open").addEventListener("click", () => {
        overlay.hidden = false
      })
      document.getElementById("close").addEventListener("click", () => {
        overlay.hidden = true
      })
      document.getElementById("apply").addEventListener("click", applyFilters)
      prev.addEventListener("click", () => { page -= 1; render() })
      next.addEventListener("click", () => { page += 1; render() })

      render()
    </script>
  `)

  const statusLine = page.locator("#status-line")
  const firstRow = page.locator("#body tr").first()

  await expect(statusLine).toHaveText("Page 1 of 2 | 4 results")
  await page.locator("#next").click()
  await expect(statusLine).toHaveText("Page 2 of 2 | 4 results")

  await page.locator("#open").click()
  await page.locator("#status").selectOption("success")
  await page.locator("#apply").click()

  await expect(statusLine).toHaveText("Page 1 of 1 | 2 results")
  await expect(firstRow).toHaveAttribute("data-key", "release-1")
})
