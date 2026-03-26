import { expect, test } from "@playwright/test"

test("app provider updates locale/direction and intercepts internal navigation", async ({ page }) => {
  await page.setContent(`
    <section id="provider" class="rf-app-provider" lang="en-US" dir="ltr">
      <input id="locale" value="en-US" />
      <select id="direction"><option value="ltr">ltr</option><option value="rtl">rtl</option></select>
      <a id="internal" href="/projects">Internal</a>
      <a id="external" href="https://example.com">External</a>
      <p id="status">none</p>
    </section>
    <script>
      const provider = document.getElementById("provider")
      const locale = document.getElementById("locale")
      const direction = document.getElementById("direction")
      const status = document.getElementById("status")
      locale.addEventListener("input", () => {
        provider.lang = locale.value || "en-US"
      })
      direction.addEventListener("change", () => {
        provider.dir = direction.value === "rtl" ? "rtl" : "ltr"
      })
      provider.addEventListener("click", (event) => {
        const anchor = event.target.closest("a[href]")
        if (!anchor) return
        const href = anchor.getAttribute("href")
        if (!href || !href.startsWith("/")) return
        event.preventDefault()
        status.textContent = href
      })
    </script>
  `)

  const provider = page.locator("#provider")
  await expect(provider).toHaveAttribute("lang", "en-US")
  await expect(provider).toHaveAttribute("dir", "ltr")

  await page.locator("#locale").fill("ar")
  await page.locator("#direction").selectOption("rtl")

  await expect(provider).toHaveAttribute("lang", "ar")
  await expect(provider).toHaveAttribute("dir", "rtl")

  await page.locator("#internal").click()
  await expect(page.locator("#status")).toHaveText("/projects")
})
