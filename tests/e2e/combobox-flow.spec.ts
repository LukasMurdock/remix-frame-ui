import { expect, test } from "@playwright/test"

test("combobox keyboard selection flow", async ({ page }) => {
  await page.setContent(`
    <style>
      .rf-combobox { position: relative; width: 320px; }
      .rf-combobox-list { position: absolute; top: calc(100% + 4px); left: 0; right: 0; margin: 0; padding: 4px; border: 1px solid #cbd5e1; border-radius: 10px; list-style: none; background: white; }
      .rf-combobox-list[hidden] { display: none; }
      .rf-combobox-option { padding: 8px 10px; border-radius: 8px; }
      .rf-combobox-option[data-highlighted="true"] { background: #eef4ff; }
    </style>
    <div class="rf-combobox">
      <input id="combo" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="combo-list" />
      <ul id="combo-list" role="listbox" class="rf-combobox-list" hidden>
        <li class="rf-combobox-option" role="option" data-label="Ada Lovelace" data-value="Ada Lovelace" data-highlighted="false">Ada Lovelace</li>
        <li class="rf-combobox-option" role="option" data-label="Grace Hopper" data-value="Grace Hopper" data-highlighted="false">Grace Hopper</li>
        <li class="rf-combobox-option" role="option" data-label="Margaret Hamilton" data-value="Margaret Hamilton" data-highlighted="false">Margaret Hamilton</li>
        <li id="combo-empty" hidden>No matches</li>
      </ul>
    </div>
    <script>
      const input = document.getElementById('combo');
      const list = document.getElementById('combo-list');
      const empty = document.getElementById('combo-empty');
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
        empty.hidden = count > 0;
        highlighted = count > 0 ? 0 : -1;
        if (highlighted === 0) setHighlighted(0);
      }

      input.addEventListener('focus', () => setOpen(true));
      input.addEventListener('input', () => {
        applyFilter(input.value);
        setOpen(true);
      });
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setOpen(false);
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          if (list.hidden) setOpen(true);
          const visible = visibleOptions();
          if (visible.length === 0) return;
          const next = highlighted < 0 ? 0 : (highlighted + 1) % visible.length;
          setHighlighted(next);
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          if (list.hidden) setOpen(true);
          const visible = visibleOptions();
          if (visible.length === 0) return;
          const next = highlighted < 0 ? visible.length - 1 : (highlighted - 1 + visible.length) % visible.length;
          setHighlighted(next);
        }
        if (event.key === 'Enter' && highlighted >= 0) {
          event.preventDefault();
          const visible = visibleOptions();
          input.value = visible[highlighted].dataset.value;
          setOpen(false);
        }
      });
      options.forEach((option) => {
        option.addEventListener('mouseenter', () => {
          const index = visibleOptions().indexOf(option);
          if (index >= 0) setHighlighted(index);
        });
        option.addEventListener('click', () => {
          input.value = option.dataset.value;
          setOpen(false);
        });
      });

      applyFilter('');
    </script>
  `)

  const input = page.locator("#combo")
  const list = page.locator("#combo-list")
  const options = page.locator("[role='option']")
  const empty = page.locator("#combo-empty")

  await input.click()
  await expect(list).toBeVisible()

  await input.fill("mar")
  await expect(options.filter({ hasText: "Margaret Hamilton" })).toBeVisible()
  await expect(options.filter({ hasText: "Ada Lovelace" })).toBeHidden()
  await expect(empty).toBeHidden()

  await input.fill("zzzz")
  await expect(empty).toBeVisible()

  await input.fill("")
  await expect(options.nth(0)).toHaveAttribute("data-highlighted", "true")

  await input.press("ArrowDown")
  await expect(options.nth(1)).toHaveAttribute("data-highlighted", "true")

  await input.press("ArrowDown")
  await expect(options.nth(2)).toHaveAttribute("data-highlighted", "true")

  await input.press("Enter")
  await expect(input).toHaveValue("Margaret Hamilton")
  await expect(list).toBeHidden()
})
