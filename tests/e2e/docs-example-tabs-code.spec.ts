import fs from "node:fs"
import path from "node:path"
import { expect, test } from "@playwright/test"

function runtimeSource(): string {
  const runtimePath = path.resolve(process.cwd(), "apps/docs/src/docs-runtime.js")
  return fs.readFileSync(runtimePath, "utf8")
}

test("docs example Code tab shows authored snippets for consumers", async ({ page }) => {
  await page.setContent(`
    <article id="checkbox">
      <p><strong>Maturity:</strong> experimental · <strong>Platform:</strong> universal</p>
      <section class="demo-block">
        <h3>Checkbox: native checked semantics</h3>
        <div class="demo-mount" data-demo="checkbox-basic"></div>
      </section>

      <h2>Example</h2>
      <h3>Basic usage</h3>
      <pre><code class="language-tsx">const marker = "docs-example-source"

export function CheckboxExample() {
  return &lt;Checkbox label="Accept terms" /&gt;
}</code></pre>

      <h3>Controlled usage</h3>
      <pre><code class="language-ts">const controlledMarker = "docs-example-controlled"

let checked = false</code></pre>

      <h2>HTML parity</h2>
      <p>Parity notes.</p>
    </article>
  `)

  await page.addScriptTag({ content: runtimeSource(), type: "module" })
  await page.getByRole("tab", { name: "Code" }).click()

  const codePanel = page.locator(".docs-example-panel[data-panel='code']")
  const codeBlocks = codePanel.locator("code")

  await expect(codeBlocks).toHaveCount(2)
  await expect(codeBlocks.nth(0)).toContainText('const marker = "docs-example-source"')
  await expect(codeBlocks.nth(0)).toContainText('return <Checkbox label="Accept terms" />')
  await expect(codeBlocks.nth(0)).toHaveClass(/language-tsx/)
  await expect(codeBlocks.nth(1)).toContainText('const controlledMarker = "docs-example-controlled"')
  await expect(codeBlocks.nth(1)).toHaveClass(/language-ts/)
  await expect(codePanel).toContainText("Basic usage")
  await expect(codePanel).toContainText("Controlled usage")
})

test("docs example section is moved into tabs to avoid duplicate snippets", async ({ page }) => {
  await page.setContent(`
    <article id="checkbox-duplicate">
      <p><strong>Maturity:</strong> experimental · <strong>Platform:</strong> universal</p>
      <section class="demo-block">
        <h3>Checkbox: native checked semantics</h3>
        <div class="demo-mount" data-demo="checkbox-basic"></div>
      </section>

      <h2>Example</h2>
      <pre><code class="language-tsx">export function Example() { return &lt;Checkbox /&gt; }</code></pre>

      <h2>HTML parity</h2>
      <p>Parity notes.</p>
    </article>
  `)

  await page.addScriptTag({ content: runtimeSource(), type: "module" })

  await expect(page.locator("article h2", { hasText: "Example" })).toHaveCount(0)
  await page.getByRole("tab", { name: "Code" }).click()
  await expect(page.locator(".docs-example-panel[data-panel='code'] code").first()).toContainText(
    "export function Example()",
  )
})

test("docs example Code tab shows unavailable message when Example section is missing", async ({ page }) => {
  await page.setContent(`
    <article id="checkbox-fallback">
      <p><strong>Maturity:</strong> experimental · <strong>Platform:</strong> universal</p>
      <section class="demo-block">
        <h3>Checkbox: native checked semantics</h3>
        <div class="demo-mount" data-demo="checkbox-basic"></div>
      </section>

      <h2>HTML parity</h2>
      <p>Parity notes.</p>
    </article>
  `)

  await page.addScriptTag({ content: runtimeSource(), type: "module" })
  await page.getByRole("tab", { name: "Code" }).click()

  const code = page.locator(".docs-example-panel[data-panel='code'] code").first()
  await expect(code).toContainText("Consumer example unavailable for demo: checkbox-basic")
})
