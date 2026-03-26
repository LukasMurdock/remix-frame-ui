import { expect, test } from "@playwright/test"

test("popover dismiss and focus return flow", async ({ page }) => {
  await page.setContent(`
    <style>
      .rf-popover { position: relative; display: inline-block; }
      .rf-popover-panel { position: absolute; top: calc(100% + 6px); left: 0; min-width: 220px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; padding: 10px; }
      .rf-popover-panel[hidden] { display: none; }
    </style>
    <div class="rf-popover">
      <button id="trigger" aria-expanded="false" aria-controls="panel">Open details</button>
      <section id="panel" class="rf-popover-panel" role="dialog" aria-label="Popover" hidden tabindex="-1">
        <button id="inside">Action</button>
      </section>
    </div>
    <script>
      const trigger = document.getElementById('trigger');
      const panel = document.getElementById('panel');
      const inside = document.getElementById('inside');

      function setOpen(next, restore = false) {
        panel.hidden = !next;
        trigger.setAttribute('aria-expanded', String(next));
        if (next) inside.focus();
        if (!next && restore) trigger.focus();
      }

      trigger.addEventListener('click', () => {
        const next = panel.hidden;
        setOpen(next);
      });

      panel.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setOpen(false, true);
        if (event.key === 'Tab') setOpen(false);
      });

      document.addEventListener('pointerdown', (event) => {
        if (panel.hidden) return;
        if (panel.contains(event.target) || trigger.contains(event.target)) return;
        setOpen(false);
      });
    </script>
  `)

  const trigger = page.locator("#trigger")
  const panel = page.locator("#panel")
  const inside = page.locator("#inside")

  await trigger.click()
  await expect(panel).toBeVisible()
  await expect(inside).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()

  await trigger.click()
  await page.mouse.click(4, 4)
  await expect(panel).toBeHidden()
})

test("dropdown menu keyboard navigation flow", async ({ page }) => {
  await page.setContent(`
    <button id="trigger" aria-haspopup="menu" aria-expanded="false">Actions</button>
    <ul id="menu" role="menu" hidden>
      <li role="none"><button id="edit" role="menuitem">Edit</button></li>
      <li role="none"><button id="archive" role="menuitem" disabled>Archive</button></li>
      <li role="none"><button id="share" role="menuitem">Share</button></li>
    </ul>
    <script>
      const trigger = document.getElementById('trigger');
      const menu = document.getElementById('menu');
      const items = [document.getElementById('edit'), document.getElementById('archive'), document.getElementById('share')];
      let index = 0;

      function enabledItems() {
        return items.filter((item) => !item.disabled);
      }

      function setOpen(next, restore = false) {
        menu.hidden = !next;
        trigger.setAttribute('aria-expanded', String(next));
        if (!next && restore) trigger.focus();
      }

      trigger.addEventListener('click', () => {
        const next = menu.hidden;
        setOpen(next);
        if (next) enabledItems()[0].focus();
      });

      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          if (menu.hidden) {
            setOpen(true);
            enabledItems()[0].focus();
          }
        }
      });

      menu.addEventListener('keydown', (event) => {
        const enabled = enabledItems();
        const current = enabled.findIndex((item) => item === document.activeElement);
        if (event.key === 'Escape') {
          setOpen(false, true);
          return;
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          const next = current === -1 ? 0 : (current + 1) % enabled.length;
          enabled[next].focus();
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          const next = current === -1 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length;
          enabled[next].focus();
        }
      });
    </script>
  `)

  const trigger = page.locator("#trigger")
  const menu = page.locator("#menu")
  const edit = page.locator("#edit")
  const share = page.locator("#share")

  await trigger.press("ArrowDown")
  await expect(menu).toBeVisible()
  await expect(edit).toBeFocused()

  await page.keyboard.press("ArrowDown")
  await expect(share).toBeFocused()

  await page.keyboard.press("ArrowDown")
  await expect(edit).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()
})
