import { expect, test } from "@playwright/test"

test("range slider maintains ordered bounds", async ({ page }) => {
  await page.setContent(`
    <div id="range" style="--start:25;--end:75;">
      <input id="start" type="range" min="0" max="100" step="5" value="25" />
      <input id="end" type="range" min="0" max="100" step="5" value="75" />
      <p id="state">Selected: 25 to 75</p>
    </div>
    <script>
      const start = document.getElementById('start');
      const end = document.getElementById('end');
      const state = document.getElementById('state');
      function sync(active) {
        let s = Number(start.value);
        let e = Number(end.value);
        if (s > e) {
          if (active === 'start') e = s;
          else s = e;
        }
        start.value = String(s);
        end.value = String(e);
        state.textContent = 'Selected: ' + s + ' to ' + e;
      }
      start.addEventListener('input', () => sync('start'));
      end.addEventListener('input', () => sync('end'));
      sync();
    </script>
  `)

  const start = page.locator("#start")
  const end = page.locator("#end")
  const state = page.locator("#state")

  await end.focus()
  await end.press("Home")
  await expect(state).toHaveText("Selected: 0 to 0")

  await start.focus()
  await start.press("End")
  await expect(state).toHaveText("Selected: 100 to 100")
})
