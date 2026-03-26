import { test, expect } from "@playwright/test"

test("M1 form flow smoke", async ({ page }) => {
  await page.setContent(`
    <form>
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />
      <label for="notes">Notes</label>
      <textarea id="notes" name="notes" rows="4"></textarea>
      <label>
        <input id="release-notes-toggle" type="checkbox" role="switch" name="releaseNotes" value="on" />
        Enable release notes
      </label>
      <button type="submit">Submit</button>
    </form>
  `)

  await page.fill("#email", "user@example.com")
  await expect(page.locator("#email")).toHaveValue("user@example.com")

  await page.fill("#notes", "Ship switch and textarea in tier 2")
  await expect(page.locator("#notes")).toHaveValue("Ship switch and textarea in tier 2")

  await page.check("#release-notes-toggle")
  await expect(page.locator("#release-notes-toggle")).toBeChecked()
})
