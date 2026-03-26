import { expect, test } from "@playwright/test"

test("result and inline alert expose status semantics", async ({ page }) => {
  await page.setContent(`
    <section id="result" role="status">
      <h2>Workspace created</h2>
      <p>Setup completed successfully.</p>
      <button type="button">Open settings</button>
    </section>
    <section id="inline" role="alert">
      <span>Your billing address is incomplete.</span>
      <button type="button">Update</button>
    </section>
  `)

  await expect(page.locator("#result")).toHaveAttribute("role", "status")
  await expect(page.locator("#result button")).toHaveText("Open settings")
  await expect(page.locator("#inline")).toHaveAttribute("role", "alert")
  await expect(page.locator("#inline button")).toHaveText("Update")
})
