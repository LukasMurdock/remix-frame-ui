import { expect, test } from "@playwright/test"

test("tree select opens, toggles branch, and selects option", async ({ page }) => {
  await page.setContent(`
    <button id="trigger" type="button" aria-expanded="false">Projects</button>
    <div id="panel" hidden>
      <button id="toggle" type="button">▾</button>
      <div id="group">
        <button id="select-alpha" type="button">Alpha</button>
      </div>
      <button id="select-settings" type="button">Settings</button>
    </div>
    <p id="state">Selected: projects</p>
    <script>
      const trigger = document.getElementById('trigger')
      const panel = document.getElementById('panel')
      const group = document.getElementById('group')
      const state = document.getElementById('state')
      trigger.addEventListener('click', () => {
        panel.hidden = !panel.hidden
        trigger.setAttribute('aria-expanded', panel.hidden ? 'false' : 'true')
      })
      document.getElementById('toggle').addEventListener('click', () => {
        group.hidden = !group.hidden
      })
      document.getElementById('select-alpha').addEventListener('click', () => {
        trigger.textContent = 'Alpha'
        state.textContent = 'Selected: alpha'
        panel.hidden = true
        trigger.setAttribute('aria-expanded', 'false')
      })
      document.getElementById('select-settings').addEventListener('click', () => {
        trigger.textContent = 'Settings'
        state.textContent = 'Selected: settings'
        panel.hidden = true
        trigger.setAttribute('aria-expanded', 'false')
      })
    </script>
  `)

  const trigger = page.locator("#trigger")
  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")

  await page.locator("#toggle").click()
  await expect(page.locator("#group")).toBeHidden()

  await page.locator("#toggle").click()
  await page.locator("#select-settings").click()

  await expect(trigger).toHaveText("Settings")
  await expect(page.locator("#state")).toHaveText("Selected: settings")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
})
