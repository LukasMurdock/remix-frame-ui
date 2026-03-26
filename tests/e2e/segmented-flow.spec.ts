import { expect, test } from "@playwright/test"

test("segmented selects option and updates checked state", async ({ page }) => {
  await page.setContent(`
    <div class="rf-segmented" role="radiogroup">
      <button class="rf-segmented-option" role="radio" aria-checked="true" data-selected="true" data-value="overview" type="button">Overview</button>
      <button class="rf-segmented-option" role="radio" aria-checked="false" data-selected="false" data-value="activity" type="button">Activity</button>
      <button class="rf-segmented-option" role="radio" aria-checked="false" data-selected="false" data-value="settings" type="button">Settings</button>
    </div>
    <p id="state">Selected: overview</p>
    <script>
      const buttons = Array.from(document.querySelectorAll('.rf-segmented-option'))
      const state = document.getElementById('state')
      for (const button of buttons) {
        button.addEventListener('click', () => {
          const value = button.dataset.value
          for (const next of buttons) {
            const selected = next.dataset.value === value
            next.dataset.selected = selected ? 'true' : 'false'
            next.setAttribute('aria-checked', selected ? 'true' : 'false')
          }
          state.textContent = 'Selected: ' + value
        })
      }
    </script>
  `)

  const activity = page.locator(".rf-segmented-option[data-value='activity']")
  await activity.click()

  await expect(activity).toHaveAttribute("aria-checked", "true")
  await expect(page.locator("#state")).toHaveText("Selected: activity")
})
