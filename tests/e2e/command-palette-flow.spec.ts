import { expect, test } from "@playwright/test"

test("command palette keyboard flow", async ({ page }) => {
  await page.setContent(`
    <style>
      .rf-command-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.4); display: grid; place-items: start center; padding-top: 10vh; }
      .rf-command-overlay[hidden] { display: none; }
      .rf-command { width: min(640px, 100%); border: 1px solid #cbd5e1; border-radius: 12px; background: white; padding: 12px; }
      .rf-command-list { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 4px; }
      .rf-command-item { padding: 8px 10px; border-radius: 8px; }
      .rf-command-item[data-highlighted="true"] { background: #eef4ff; }
      .rf-command-item[data-disabled="true"] { opacity: .45; }
    </style>
    <button id="open">Open command palette</button>
    <div id="overlay" class="rf-command-overlay" hidden>
      <section class="rf-command" role="dialog" aria-modal="true">
        <input id="search" type="search" role="combobox" aria-autocomplete="list" aria-controls="commands" />
        <ul id="commands" class="rf-command-list" role="listbox">
          <li class="rf-command-item" role="option" data-id="create" data-highlighted="true">Create issue</li>
          <li class="rf-command-item" role="option" data-id="deploy" data-disabled="true" data-highlighted="false">Open deployments</li>
          <li class="rf-command-item" role="option" data-id="invite" data-highlighted="false">Invite teammate</li>
        </ul>
      </section>
    </div>
    <script>
      const openButton = document.getElementById('open');
      const overlay = document.getElementById('overlay');
      const search = document.getElementById('search');
      const options = [...document.querySelectorAll('[role="option"]')];
      let highlighted = 0;

      function setOpen(next) {
        overlay.hidden = !next;
        if (next) search.focus();
        else openButton.focus();
      }

      function setHighlighted(index) {
        highlighted = index;
        options.forEach((option, i) => option.setAttribute('data-highlighted', i === index ? 'true' : 'false'));
      }

      function move(step) {
        let next = highlighted;
        for (let i = 0; i < options.length; i++) {
          next = (next + step + options.length) % options.length;
          if (options[next].dataset.disabled !== 'true') {
            setHighlighted(next);
            return;
          }
        }
      }

      openButton.addEventListener('click', () => setOpen(true));
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) setOpen(false);
      });
      search.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setOpen(false);
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          move(1);
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          move(-1);
        }
      });
    </script>
  `)

  await page.click("#open")
  await expect(page.locator("#overlay")).toBeVisible()
  await expect(page.locator("#search")).toBeFocused()

  await page.keyboard.press("ArrowDown")
  await expect(page.locator("[data-id='invite']")).toHaveAttribute("data-highlighted", "true")

  await page.keyboard.press("ArrowDown")
  await expect(page.locator("[data-id='create']")).toHaveAttribute("data-highlighted", "true")

  await page.keyboard.press("Escape")
  await expect(page.locator("#overlay")).toBeHidden()
  await expect(page.locator("#open")).toBeFocused()
})
