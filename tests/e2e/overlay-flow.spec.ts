import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("M2 dialog keyboard flow", async ({ page }) => {
  await page.setContent(`
    <html lang="en">
      <head><title>Dialog Test</title></head>
      <body>
        <main>
          <h1>Dialog keyboard flow</h1>
          <button id="open">Open dialog</button>
        </main>
        <div id="backdrop" style="position:fixed;inset:0;background:rgba(0,0,0,.4);display:none;place-items:center;">
          <div id="dialog" role="dialog" aria-modal="true" aria-labelledby="title" tabindex="-1" style="background:white;padding:16px;min-width:300px;">
            <h2 id="title">Dialog</h2>
            <input id="first" />
            <button id="close">Close</button>
          </div>
        </div>
      </body>
    </html>
    <script>
      const open = document.getElementById('open');
      const backdrop = document.getElementById('backdrop');
      const dialog = document.getElementById('dialog');
      const first = document.getElementById('first');
      const close = document.getElementById('close');
      let previouslyFocused = null;

      function show() {
        previouslyFocused = document.activeElement;
        backdrop.style.display = 'grid';
        first.focus();
      }

      function hide() {
        backdrop.style.display = 'none';
        if (previouslyFocused) previouslyFocused.focus();
      }

      open.addEventListener('click', show);
      close.addEventListener('click', hide);
      backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) hide();
      });

      dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          hide();
          return;
        }
        if (event.key !== 'Tab') return;

        const focusables = [first, close];
        const current = document.activeElement;
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (!event.shiftKey && current === lastEl) {
          event.preventDefault();
          firstEl.focus();
        }

        if (event.shiftKey && current === firstEl) {
          event.preventDefault();
          lastEl.focus();
        }
      });
    </script>
  `)

  await page.click("#open")
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.locator("#first")).toBeFocused()

  await page.keyboard.press("Tab")
  await expect(page.locator("#close")).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(page.locator("#first")).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(page.locator("#backdrop")).toHaveCSS("display", "none")
  await expect(page.locator("#open")).toBeFocused()

  await page.click("#open")
  await page.mouse.click(8, 8)
  await expect(page.locator("#backdrop")).toHaveCSS("display", "none")

  const axe = await new AxeBuilder({ page }).include("main").include("#backdrop").analyze()
  expect(axe.violations).toEqual([])
})

test("M2 menu keyboard flow", async ({ page }) => {
  await page.setContent(`
    <html lang="en">
      <head><title>Menu Test</title></head>
      <body>
        <main>
          <h1>Menu keyboard flow</h1>
          <button id="trigger" aria-haspopup="menu" aria-expanded="false">Actions</button>
          <ul id="menu" role="menu" hidden>
            <li role="none"><button role="menuitem" id="edit">Edit</button></li>
            <li role="none"><button role="menuitem" id="archive">Archive</button></li>
          </ul>
        </main>
      </body>
    </html>
    <script>
      const trigger = document.getElementById('trigger');
      const menu = document.getElementById('menu');
      const items = [document.getElementById('edit'), document.getElementById('archive')];
      let index = 0;

      function openMenu() {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        index = 0;
        items[index].focus();
      }

      function closeMenu() {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }

      trigger.addEventListener('click', () => {
        if (menu.hidden) openMenu();
        else closeMenu();
      });

      menu.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeMenu();
          return;
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          index = (index + 1) % items.length;
          items[index].focus();
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          index = (index - 1 + items.length) % items.length;
          items[index].focus();
        }
      });
    </script>
  `)

  await page.click("#trigger")
  await expect(page.locator("#menu")).toBeVisible()
  await expect(page.locator("#edit")).toBeFocused()

  await page.keyboard.press("ArrowDown")
  await expect(page.locator("#archive")).toBeFocused()
  await page.keyboard.press("ArrowUp")
  await expect(page.locator("#edit")).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(page.locator("#menu")).toBeHidden()
  await expect(page.locator("#trigger")).toBeFocused()

  const axe = await new AxeBuilder({ page }).include("main").analyze()
  expect(axe.violations).toEqual([])
})
