import { expect, test } from "@playwright/test"

test("progress, skeleton, and spinner baseline behavior", async ({ page }) => {
  await page.setContent(`
    <div style="display:grid;gap:8px;max-width:320px;">
      <input id="progress-input" type="range" min="0" max="100" step="10" value="40" />
      <div id="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40">
        <div id="bar" style="width:40%"></div>
      </div>
      <p id="progress-text">40%</p>
      <div id="skeleton" aria-hidden="true">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </div>
      <span id="spinner" role="status" aria-live="polite">
        <span aria-hidden="true">*</span>
        <span>Loading</span>
      </span>
    </div>
    <script>
      const input = document.getElementById('progress-input');
      const progress = document.getElementById('progress');
      const bar = document.getElementById('bar');
      const text = document.getElementById('progress-text');
      input.addEventListener('input', () => {
        progress.setAttribute('aria-valuenow', input.value);
        bar.style.width = input.value + '%';
        text.textContent = input.value + '%';
      });
    </script>
  `)

  const progressInput = page.locator("#progress-input")
  const progress = page.locator("#progress")
  const progressText = page.locator("#progress-text")
  const skeletonLines = page.locator("#skeleton .line")
  const spinner = page.locator("#spinner")

  await expect(skeletonLines).toHaveCount(3)
  await expect(spinner).toHaveAttribute("role", "status")

  await progressInput.focus()
  await progressInput.press("ArrowRight")
  await expect(progress).toHaveAttribute("aria-valuenow", "50")
  await expect(progressText).toHaveText("50%")
})
