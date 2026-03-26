import { expect, test } from "@playwright/test"

test("tree toggles branch visibility and updates selection", async ({ page }) => {
  await page.setContent(`
    <ul class="rf-tree" role="tree">
      <li class="rf-tree-item" data-node-id="projects" aria-expanded="true" data-selected="true">
        <button id="toggle" type="button">▾</button>
        <button id="select-projects" type="button">Projects</button>
        <ul id="group-projects">
          <li class="rf-tree-item" data-node-id="alpha" data-selected="false"><button id="select-alpha" type="button">Alpha</button></li>
        </ul>
      </li>
    </ul>
    <p id="state">Selected: projects</p>
    <script>
      const projectsItem = document.querySelector('[data-node-id="projects"]')
      const alphaItem = document.querySelector('[data-node-id="alpha"]')
      const group = document.getElementById('group-projects')
      const state = document.getElementById('state')
      document.getElementById('toggle').addEventListener('click', () => {
        const expanded = projectsItem.getAttribute('aria-expanded') !== 'false'
        projectsItem.setAttribute('aria-expanded', expanded ? 'false' : 'true')
        group.hidden = expanded
      })
      document.getElementById('select-alpha').addEventListener('click', () => {
        projectsItem.dataset.selected = 'false'
        alphaItem.dataset.selected = 'true'
        state.textContent = 'Selected: alpha'
      })
    </script>
  `)

  const projectsItem = page.locator('[data-node-id="projects"]')
  const alphaItem = page.locator('[data-node-id="alpha"]')
  const group = page.locator("#group-projects")

  await expect(projectsItem).toHaveAttribute("aria-expanded", "true")
  await page.locator("#toggle").click()
  await expect(projectsItem).toHaveAttribute("aria-expanded", "false")
  await expect(group).toBeHidden()

  await page.locator("#toggle").click()
  await expect(group).toBeVisible()

  await page.locator("#select-alpha").click()
  await expect(alphaItem).toHaveAttribute("data-selected", "true")
  await expect(page.locator("#state")).toHaveText("Selected: alpha")
})
