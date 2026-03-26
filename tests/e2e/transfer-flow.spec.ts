import { expect, test } from "@playwright/test"

test("transfer moves selected items between lists", async ({ page }) => {
  await page.setContent(`
    <ul id="left">
      <li data-key="alerts"><label><input type="checkbox" />Alerts</label></li>
      <li data-key="billing"><label><input type="checkbox" />Billing</label></li>
    </ul>
    <button id="to-right" type="button">></button>
    <button id="to-left" type="button"><</button>
    <ul id="right"></ul>
    <script>
      const left = document.getElementById('left')
      const right = document.getElementById('right')
      const selectedItems = (container) => Array.from(container.querySelectorAll('li')).filter((item) => item.querySelector('input')?.checked)
      document.getElementById('to-right').addEventListener('click', () => {
        for (const item of selectedItems(left)) {
          item.querySelector('input').checked = false
          right.append(item)
        }
      })
      document.getElementById('to-left').addEventListener('click', () => {
        for (const item of selectedItems(right)) {
          item.querySelector('input').checked = false
          left.append(item)
        }
      })
    </script>
  `)

  await page.locator("#left [data-key='alerts'] input").check()
  await page.locator("#to-right").click()
  await expect(page.locator("#right [data-key='alerts']")).toBeVisible()

  await page.locator("#right [data-key='alerts'] input").check()
  await page.locator("#to-left").click()
  await expect(page.locator("#left [data-key='alerts']")).toBeVisible()
})
