import { expect, test } from "@playwright/test"

test("autocomplete supports free text and suggestion commit", async ({ page }) => {
  await page.setContent(`
    <style>
      .rf-combobox { position: relative; width: 320px; }
      .rf-combobox-list { position: absolute; top: calc(100% + 4px); left: 0; right: 0; margin: 0; padding: 4px; border: 1px solid #cbd5e1; border-radius: 10px; list-style: none; background: white; }
      .rf-combobox-list[hidden] { display: none; }
      .rf-combobox-option { padding: 8px 10px; border-radius: 8px; }
      .rf-combobox-option[data-highlighted="true"] { background: #eef4ff; }
    </style>
    <div class="rf-combobox">
      <input id="auto" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="auto-list" />
      <ul id="auto-list" role="listbox" class="rf-combobox-list" hidden>
        <li class="rf-combobox-option" role="option" data-label="Ada Lovelace" data-value="Ada Lovelace" data-highlighted="false">Ada Lovelace</li>
        <li class="rf-combobox-option" role="option" data-label="Grace Hopper" data-value="Grace Hopper" data-highlighted="false">Grace Hopper</li>
        <li class="rf-combobox-option" role="option" data-label="Margaret Hamilton" data-value="Margaret Hamilton" data-highlighted="false">Margaret Hamilton</li>
      </ul>
      <div id="commit">None</div>
    </div>
    <script>
      const input = document.getElementById('auto');
      const list = document.getElementById('auto-list');
      const commit = document.getElementById('commit');
      const options = [...list.querySelectorAll('[role="option"]')];
      let highlighted = -1;

      function visibleOptions() {
        return options.filter((option) => !option.hidden);
      }

      function setOpen(next) {
        list.hidden = !next;
        input.setAttribute('aria-expanded', String(next));
      }

      function setHighlighted(index) {
        highlighted = index;
        const visible = visibleOptions();
        visible.forEach((option, i) => option.setAttribute('data-highlighted', i === index ? 'true' : 'false'));
      }

      function applyFilter(query) {
        const normalized = query.trim().toLowerCase();
        let count = 0;
        options.forEach((option) => {
          const label = (option.dataset.label || '').toLowerCase();
          const match = normalized === '' || label.includes(normalized);
          option.hidden = !match;
          option.setAttribute('data-highlighted', 'false');
          if (match) count += 1;
        });
        highlighted = count > 0 ? 0 : -1;
        if (highlighted === 0) setHighlighted(0);
      }

      function commitValue(value) {
        input.value = value;
        commit.textContent = value || 'None';
        setOpen(false);
      }

      input.addEventListener('focus', () => setOpen(true));
      input.addEventListener('input', () => {
        applyFilter(input.value);
        setOpen(true);
      });
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          setOpen(false);
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          const visible = visibleOptions();
          if (visible.length === 0) return;
          const next = highlighted < 0 ? 0 : (highlighted + 1) % visible.length;
          setHighlighted(next);
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          const visible = visibleOptions();
          if (visible.length === 0) return;
          const next = highlighted < 0 ? visible.length - 1 : (highlighted - 1 + visible.length) % visible.length;
          setHighlighted(next);
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          const visible = visibleOptions();
          const option = highlighted >= 0 ? visible[highlighted] : undefined;
          commitValue(option?.dataset.value || input.value);
        }
        if (event.key === 'Tab') {
          const visible = visibleOptions();
          const option = highlighted >= 0 ? visible[highlighted] : undefined;
          if (option) commitValue(option.dataset.value || input.value);
        }
      });

      applyFilter('');
    </script>
  `)

  const input = page.locator("#auto")
  const list = page.locator("#auto-list")
  const commit = page.locator("#commit")
  const options = page.locator("[role='option']")

  await input.click()
  await expect(list).toBeVisible()
  await expect(options.nth(0)).toHaveAttribute("data-highlighted", "true")

  await input.press("ArrowDown")
  await expect(options.nth(1)).toHaveAttribute("data-highlighted", "true")

  await input.press("ArrowUp")
  await expect(options.nth(0)).toHaveAttribute("data-highlighted", "true")

  await input.fill("gr")
  await expect(options.filter({ hasText: "Grace Hopper" })).toBeVisible()
  await input.press("Tab")
  await expect(input).toHaveValue("Grace Hopper")
  await expect(commit).toHaveText("Grace Hopper")

  await input.click()
  await expect(list).toBeVisible()
  await input.press("Escape")
  await expect(list).toBeHidden()

  await input.click()
  await input.fill("Custom Person")
  await input.press("Enter")
  await expect(input).toHaveValue("Custom Person")
  await expect(commit).toHaveText("Custom Person")
})
