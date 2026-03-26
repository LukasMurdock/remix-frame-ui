import { expect, test } from "@playwright/test"

test("side nav updates active item", async ({ page }) => {
  await page.setContent(`
    <nav aria-label="Side navigation">
      <ul>
        <li data-active="true"><a id="overview" href="#overview" aria-current="page">Overview</a></li>
        <li data-active="false"><a id="projects" href="#projects">Projects</a></li>
      </ul>
    </nav>
    <script>
      const links = [...document.querySelectorAll('a')];
      function activate(target) {
        links.forEach((link) => {
          const active = link === target;
          link.closest('li').dataset.active = active ? 'true' : 'false';
          if (active) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      }
      links.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          activate(link);
        });
      });
    </script>
  `)

  const overview = page.locator("#overview")
  const projects = page.locator("#projects")

  await expect(overview).toHaveAttribute("aria-current", "page")
  await projects.click()
  await expect(projects).toHaveAttribute("aria-current", "page")
  await expect(overview).not.toHaveAttribute("aria-current", "page")
})
