import { expect, test } from "@playwright/test"

test("time picker updates selected value", async ({ page }) => {
  await page.setContent(`
    <label for="time">Deployment time</label>
    <input id="time" type="time" min="08:00" max="20:00" step="900" value="09:30" />
    <p id="state">Selected: 09:30</p>
    <script>
      const input = document.querySelector('#time');
      const state = document.querySelector('#state');
      input.addEventListener('input', () => {
        state.textContent = input.value ? 'Selected: ' + input.value : 'No time selected';
      });
    </script>
  `)

  const input = page.locator("#time")
  await expect(input).toHaveValue("09:30")

  await input.fill("10:45")
  await expect(input).toHaveValue("10:45")
  await expect(page.locator("#state")).toHaveText("Selected: 10:45")
})
