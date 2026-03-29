import type { Page } from "@playwright/test"

const docsBaseUrl = process.env.DOCS_BASE_URL ?? "http://localhost:4173/"

export async function mountWithDocsRuntime(page: Page, html: string): Promise<void> {
  await page.goto(docsBaseUrl)
  await page.evaluate((markup) => {
    document.body.innerHTML = markup
  }, html)

  const runtimeUrl = new URL("docs-runtime.js", docsBaseUrl)
  runtimeUrl.searchParams.set("e2e", String(Date.now()))
  await page.addScriptTag({ type: "module", url: runtimeUrl.toString() })

  await page.waitForFunction(
    () =>
      typeof (window as Window & { __docsMountRuntimeDemoById?: unknown }).__docsMountRuntimeDemoById === "function",
  )
}
