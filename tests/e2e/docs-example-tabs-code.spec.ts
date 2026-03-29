import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

test("docs example Code tab shows demo entry source", async ({ page }) => {
  await mountWithDocsRuntime(
    page,
    `
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
  `,
  )
  await page.getByRole("tab", { name: "Code" }).click()

  const code = page.locator(".docs-example-panel[data-panel='code'] code").first()
  await expect(code).toContainText("export function TermsCheckbox()")
  await expect(code).toContainText('import { Checkbox } from "@lukasmurdock/remix-ui-components"')
  await expect(code).toHaveClass(/language-tsx/)
})

test("docs example section remains in article body", async ({ page }) => {
  await mountWithDocsRuntime(
    page,
    `
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
  `,
  )

  await expect(page.locator("article h2", { hasText: "Example" })).toHaveCount(1)
  await page.getByRole("tab", { name: "Code" }).click()
  await expect(page.locator(".docs-example-panel[data-panel='code'] code").first()).toContainText(
    "export function TermsCheckbox()",
  )
})

test("docs example Code tab still loads when Example section is missing", async ({ page }) => {
  await mountWithDocsRuntime(
    page,
    `
    <article id="checkbox-fallback">
      <p><strong>Maturity:</strong> experimental · <strong>Platform:</strong> universal</p>
      <section class="demo-block">
        <h3>Checkbox: native checked semantics</h3>
        <div class="demo-mount" data-demo="checkbox-basic"></div>
      </section>

      <h2>HTML parity</h2>
      <p>Parity notes.</p>
    </article>
  `,
  )
  await page.getByRole("tab", { name: "Code" }).click()

  const code = page.locator(".docs-example-panel[data-panel='code'] code").first()
  await expect(code).toContainText("export function TermsCheckbox()")
})
