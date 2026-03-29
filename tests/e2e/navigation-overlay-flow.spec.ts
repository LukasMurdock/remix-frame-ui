import { expect, test } from "@playwright/test"
import { mountWithDocsRuntime } from "./docs-runtime-fixture"

test("command palette demo opens with focused search and closes on escape", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="command-palette-basic"></div>')

  const open = page.getByRole("button", { name: "Open command palette" })
  const overlay = page.locator(".rf-command-overlay")
  const input = page.locator(".rf-command input[type='search']")

  await open.click()
  await expect(overlay).toBeVisible()
  await expect(input).toBeFocused()

  await input.fill("invite")
  await expect(page.getByRole("option", { name: "Invite teammate" })).toBeVisible()
  await expect(page.getByRole("option", { name: "Create issue" })).toBeHidden()

  await page.keyboard.press("Escape")
  await expect(overlay).toBeHidden()
  await expect(open).toBeFocused()
})

test("menu demo restores trigger focus after escape", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="menu-actions"></div>')

  const trigger = page.getByRole("button", { name: "Actions" })
  const menu = page.getByRole("menu")
  const firstItem = page.getByRole("menuitem", { name: "Edit" })

  await trigger.click()
  await expect(menu).toBeVisible()
  await expect(firstItem).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("tabs demo activates overflow tabs and collapses more menu", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="tabs-basic"></div>')

  const overflow = page.locator("#tabs-overflow")
  const settingsTab = page.locator("#tab-settings")
  const settingsPanel = page.locator("#panel-settings")

  await overflow.locator("summary").click()
  await expect(overflow).toHaveJSProperty("open", true)

  await settingsTab.click()
  await expect(settingsTab).toHaveAttribute("aria-selected", "true")
  await expect(settingsPanel).toBeVisible()
  await expect(overflow).toHaveJSProperty("open", false)
})

test("collapse demo toggles disclosure content", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="collapse-basic"></div>')

  const disclosures = page.locator("details.rf-collapse")
  const second = disclosures.nth(1)

  await expect(disclosures.nth(0)).toHaveAttribute("open", "")
  await expect(second).not.toHaveAttribute("open", "")

  await second.locator("summary").click()
  await expect(second).toHaveAttribute("open", "")
})

test("calendar demo updates selected date state", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="calendar-basic"></div>')

  const input = page.locator("#calendar-date")
  const state = page.locator("#calendar-state")

  await input.fill("2026-04-09")
  await expect(state).toHaveText("Selected: 2026-04-09")
})

test("divider demo renders semantic and decorative separators", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="divider-basic"></div>')

  const semanticSeparators = page.locator(".rf-divider[role='separator']")
  const horizontalDecorative = page.locator(".rf-divider[data-orientation='horizontal']")

  await expect(semanticSeparators).toHaveCount(2)
  await expect(horizontalDecorative).toHaveCount(1)
})

test("dropdown demo toggles expanded state and menu visibility", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="dropdown-basic"></div>')

  const trigger = page.getByRole("button", { name: "Bulk actions" })
  const menu = page.getByRole("menu")

  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(menu).toBeVisible()

  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(menu).toBeHidden()
})

test("popover demo toggles panel visibility", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="popover-basic"></div>')

  const trigger = page.getByRole("button", { name: "Open details" })
  const panel = page.locator(".rf-popover-panel")

  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(panel).toBeVisible()

  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(panel).toBeHidden()
})

test("radio demo updates selected state text", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="radio-group"></div>')

  const overnight = page.locator("input[type='radio'][value='overnight']")
  const state = page.locator("#radio-state")

  await overnight.check()
  await expect(state).toHaveText("Selected: overnight")
})

test("textarea demo updates character count", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="textarea-basic"></div>')

  const textarea = page.locator("#textarea-demo")
  const counter = page.locator("#textarea-count")

  await textarea.fill("Release notes ready")
  await expect(counter).toHaveText("19 / 120 characters")
})

test("time picker demo updates selected time", async ({ page }) => {
  await mountWithDocsRuntime(page, '<div class="demo-mount" data-demo="time-picker-basic"></div>')

  const input = page.locator("#time-picker-demo")
  const state = page.locator("#time-picker-state")

  await input.fill("10:45")
  await expect(state).toHaveText("Selected: 10:45")
})
