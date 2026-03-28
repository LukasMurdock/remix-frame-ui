import fs from "node:fs"
import path from "node:path"
import { expect, test } from "@playwright/test"

function runtimeSource(): string {
  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  return fs.readFileSync(runtimePath, "utf8")
}

function extractBatchCount(text: string): number {
  const match = text.match(/Loaded batches:\s*(\d+)\s*\/\s*4/)
  if (!match || !match[1]) return 0
  return Number(match[1])
}

test("infinite scroll demo progressively loads feed batches", async ({ page }) => {
  await page.setContent('<div class="demo-mount" data-demo="infinite-scroll-basic"></div>')
  await page.addScriptTag({ content: runtimeSource(), type: "module" })

  const viewport = page.locator("[data-role='infinite-viewport']")
  const status = page.locator("[data-role='infinite-status']")
  const meta = page.locator("[data-role='infinite-meta']")

  await expect(viewport).toBeVisible()
  await expect(meta).toContainText("/ 4")

  let currentBatch = extractBatchCount((await meta.textContent()) ?? "")
  while (currentBatch < 4) {
    const previousBatch = currentBatch

    await viewport.evaluate((node) => {
      node.scrollTop = node.scrollHeight
    })

    await expect
      .poll(async () => {
        const nextText = (await meta.textContent()) ?? ""
        return extractBatchCount(nextText)
      })
      .toBeGreaterThan(previousBatch)

    currentBatch = extractBatchCount((await meta.textContent()) ?? "")
  }

  await expect(meta).toHaveText("Loaded batches: 4 / 4")
  await expect(status).toHaveText("No more items")
})

test("infinite scroll demo does not error when unmounted during async load", async ({ page }) => {
  const pageErrors: string[] = []
  page.on("pageerror", (error) => {
    pageErrors.push(error.message)
  })

  await page.setContent('<div id="mount" class="demo-mount" data-demo="infinite-scroll-basic"></div>')
  await page.addScriptTag({ content: runtimeSource(), type: "module" })

  const viewport = page.locator("[data-role='infinite-viewport']")
  await expect(viewport).toBeVisible()

  await viewport.evaluate((node) => {
    node.scrollTop = node.scrollHeight
  })

  await page.evaluate(() => {
    const mount = document.getElementById("mount")
    mount?.remove()
  })

  await page.waitForTimeout(420)
  expect(pageErrors).toEqual([])
})
