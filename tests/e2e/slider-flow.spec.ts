import { expect, test } from "@playwright/test"

test("slider keyboard updates value", async ({ page }) => {
  await page.setContent(`
    <div style="display:grid;gap:8px;max-width:320px;">
      <label for="slider">Volume</label>
      <input id="slider" type="range" min="0" max="10" step="1" value="4" />
      <p id="state">Current value: 4</p>
    </div>
    <script>
      const slider = document.getElementById('slider');
      const state = document.getElementById('state');
      function sync() {
        state.textContent = 'Current value: ' + slider.value;
      }
      slider.addEventListener('input', sync);
      sync();
    </script>
  `)

  const slider = page.locator("#slider")
  const state = page.locator("#state")

  await slider.focus()
  await slider.press("ArrowRight")
  await expect(slider).toHaveValue("5")
  await expect(state).toHaveText("Current value: 5")

  await slider.press("End")
  await expect(slider).toHaveValue("10")
  await expect(state).toHaveText("Current value: 10")
})
