import { expect, test } from "@playwright/test"

test("filter panel opens and applies filters", async ({ page }) => {
  await page.setContent(`
    <button id="open" type="button">Open filters</button>
    <div id="overlay" hidden>
      <section role="dialog" aria-modal="true" aria-label="Filters">
        <h2>Filters</h2>
        <input id="query" type="search" placeholder="Search releases" />
        <select id="status">
          <option value="all">All</option>
          <option value="running">Running</option>
          <option value="failed">Failed</option>
        </select>
        <button id="clear" type="button">Clear</button>
        <button id="apply" type="button">Apply filters</button>
        <button id="close" type="button">Close</button>
      </section>
    </div>
    <p id="state">No filters applied</p>
    <script>
      const overlay = document.getElementById("overlay")
      const query = document.getElementById("query")
      const status = document.getElementById("status")
      const state = document.getElementById("state")
      document.getElementById("open").addEventListener("click", () => {
        overlay.hidden = false
      })
      document.getElementById("close").addEventListener("click", () => {
        overlay.hidden = true
      })
      document.getElementById("clear").addEventListener("click", () => {
        query.value = ""
        status.value = "all"
        state.textContent = "Filters cleared"
      })
      document.getElementById("apply").addEventListener("click", () => {
        state.textContent = "Applied: " + (query.value || "none") + " / " + status.value
        overlay.hidden = true
      })
    </script>
  `)

  const overlay = page.locator("#overlay")
  const state = page.locator("#state")

  await expect(overlay).toBeHidden()
  await page.locator("#open").click()
  await expect(overlay).toBeVisible()

  await page.locator("#query").fill("release")
  await page.locator("#status").selectOption("running")
  await page.locator("#apply").click()

  await expect(overlay).toBeHidden()
  await expect(state).toHaveText("Applied: release / running")
})
