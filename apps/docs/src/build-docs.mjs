import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const contentDir = path.join(root, "content", "components")
const outDir = path.join(root, "dist")
const runtimeSourcePath = path.join(root, "src", "docs-runtime.js")
const metadataPath = path.resolve(root, "..", "..", "packages", "remix", "src", "component-metadata.json")

const demoByComponent = new Map([
  ["alert", { id: "alert-basic", title: "Alert: tone and dismiss patterns" }],
  ["appheader", { id: "app-header-basic", title: "AppHeader: brand, nav, and actions" }],
  ["appshell", { id: "app-shell-basic", title: "AppShell: header, sidebar, and content regions" }],
  ["autocomplete", { id: "autocomplete-basic", title: "Autocomplete: free text with suggestion commit" }],
  ["badge", { id: "badge-basic", title: "Badge: compact status labels" }],
  ["breadcrumboverflow", { id: "breadcrumbs-overflow-basic", title: "BreadcrumbOverflow: collapsed long paths" }],
  ["breadcrumbs", { id: "breadcrumbs-basic", title: "Breadcrumbs: hierarchical location path" }],
  ["button", { id: "button-basic", title: "Button: interactive counter" }],
  ["card", { id: "card-basic", title: "Card: header, body, footer composition" }],
  ["chip", { id: "chip-basic", title: "Chip: compact metadata token" }],
  ["combobox", { id: "combobox-basic", title: "Combobox: search and select options" }],
  ["confirmdialog", { id: "confirm-dialog-basic", title: "ConfirmDialog: destructive action confirmation" }],
  ["commandpalette", { id: "command-palette-basic", title: "CommandPalette: quick action launcher" }],
  ["datagridlite", { id: "data-grid-lite-basic", title: "DataGridLite: sorting and selection" }],
  ["datalist", { id: "data-list-basic", title: "DataList: item metadata and actions" }],
  ["datatable", { id: "data-table-basic", title: "DataTable: sorting, selection, and pagination" }],
  ["datepicker", { id: "date-picker-basic", title: "DatePicker: calendar date selection" }],
  ["datetimepicker", { id: "date-time-picker-basic", title: "DateTimePicker: combined date and time" }],
  ["daterangepicker", { id: "date-range-picker-basic", title: "DateRangePicker: start and end selection" }],
  ["dropdown", { id: "dropdown-basic", title: "Dropdown: menu wrapper for actions" }],
  ["drawer", { id: "drawer-basic", title: "Drawer: side panel workflow" }],
  ["emptystate", { id: "empty-state-basic", title: "EmptyState: recovery-focused messaging" }],
  ["emptyresults", { id: "empty-results-basic", title: "EmptyResults: no-match recovery state" }],
  ["fileupload", { id: "file-upload-basic", title: "FileUpload: native file picker and constraints" }],
  ["field", { id: "field-basic", title: "Field: label, description, error wiring" }],
  ["formfieldset", { id: "form-fieldset-basic", title: "FormFieldset: grouped controls with legend" }],
  ["formlayout", { id: "form-layout-basic", title: "FormLayout: structured form sections" }],
  ["formmessage", { id: "form-message-basic", title: "FormMessage: helper and validation feedback" }],
  ["filterbar", { id: "filter-bar-basic", title: "FilterBar: grouped controls and actions" }],
  ["input", { id: "field-input", title: "Field + Input: live validation" }],
  ["inlinealert", { id: "inline-alert-basic", title: "InlineAlert: compact in-flow status" }],
  ["checkbox", { id: "checkbox-basic", title: "Checkbox: native checked semantics" }],
  ["radio", { id: "radio-group", title: "RadioGroup: single selection" }],
  ["rangeslider", { id: "range-slider-basic", title: "RangeSlider: two-thumb range selection" }],
  ["result", { id: "result-basic", title: "Result: outcome and recovery actions" }],
  ["pageheader", { id: "page-header-basic", title: "PageHeader: title, subtitle, actions" }],
  ["popover", { id: "popover-basic", title: "Popover: anchored disclosure panel" }],
  ["progress", { id: "progress-basic", title: "Progress: completion and status tracking" }],
  ["select", { id: "select-basic", title: "Select: native option selection" }],
  ["sidenav", { id: "side-nav-basic", title: "SideNav: sectioned app navigation" }],
  ["skeleton", { id: "skeleton-basic", title: "Skeleton: loading placeholders" }],
  ["slider", { id: "slider-basic", title: "Slider: range selection with live value" }],
  ["spinner", { id: "spinner-basic", title: "Spinner: inline loading indicator" }],
  ["steps", { id: "steps-basic", title: "Steps: multi-step progress indicator" }],
  ["switch", { id: "switch-basic", title: "Switch: boolean setting toggle" }],
  ["table", { id: "table-basic", title: "Table: semantic columns and rows" }],
  ["tag", { id: "tag-basic", title: "Tag: categorization labels" }],
  ["tabs", { id: "tabs-basic", title: "Tabs: manual activation" }],
  ["textarea", { id: "textarea-basic", title: "Textarea: multiline field input" }],
  ["timepicker", { id: "time-picker-basic", title: "TimePicker: time-of-day selection" }],
  ["dialog", { id: "dialog-controlled", title: "Dialog: controlled open/close" }],
  ["menu", { id: "menu-actions", title: "Menu: keyboard navigation" }],
  ["numberinput", { id: "number-input-basic", title: "NumberInput: constrained numeric value" }],
  ["pagination", { id: "pagination-basic", title: "Pagination: previous, next, and current page" }],
  ["toast", { id: "toast-queue", title: "Toast: queue and auto-dismiss" }],
  ["tooltip", { id: "tooltip-basic", title: "Tooltip: hover and focus context" }],
])

const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md"))
const metadata = JSON.parse(await readFile(metadataPath, "utf8"))
const maturityByName = new Map(metadata.map((entry) => [entry.name.toLowerCase(), entry.maturity]))
const requiredSections = ["## HTML parity", "## Runtime notes", "## Accessibility matrix"]

const pages = []
for (const file of files) {
  const markdown = await readFile(path.join(contentDir, file), "utf8")
  const componentName = file.replace(/\.md$/, "")
  if (!maturityByName.has(componentName)) {
    throw new Error(`${file} does not have a maturity entry in component metadata`)
  }
  for (const section of requiredSections) {
    if (!markdown.includes(section)) {
      throw new Error(`${file} is missing required section: ${section}`)
    }
  }
  pages.push({ file, markdown, maturity: maturityByName.get(componentName) })
}

await mkdir(outDir, { recursive: true })

const nav = pages
  .map((page) => `<li><a href="#${page.file.replace(/\.md$/, "")}">${page.file.replace(/\.md$/, "")}</a></li>`)
  .join("\n")

const docsBody = pages
  .map((page) => {
    const name = page.file.replace(/\.md$/, "")
    const demo = demoByComponent.get(name)
    const demoSection = demo
      ? `<section class="demo-block"><h3>${demo.title}</h3><div class="demo-mount" data-demo="${demo.id}"></div></section>`
      : ""

    return `<article id="${name}"><p><strong>Maturity:</strong> ${page.maturity}</p>${demoSection}<pre>${escapeHtml(page.markdown)}</pre></article>`
  })
  .join("\n")

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Remix Frame UI Docs</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 2rem; line-height: 1.5; }
      main { display: grid; grid-template-columns: 260px 1fr; gap: 2rem; }
      pre { white-space: pre-wrap; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1rem; }
      .demo-block { border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.75rem; margin-bottom: 1rem; background: #fff; }
      .demo-block h3 { margin-top: 0; font-size: 1rem; }
      .demo-mount { min-height: 2.25rem; }
      .docs-button { border-radius: 8px; min-height: 2.5rem; padding: 0 0.875rem; border: 1px solid #cbd5e1; background: #2563eb; color: #fff; cursor: pointer; }
      .docs-button[data-variant="outline"] { background: #fff; color: #0f172a; }
      .docs-button[data-tone="danger"] { background: #dc2626; border-color: #dc2626; color: #fff; }
      .docs-input { border: 1px solid #cbd5e1; border-radius: 8px; min-height: 2.5rem; padding: 0 0.75rem; }
      .rf-badge,
      .rf-tag {
        display: inline-flex;
        align-items: center;
        min-height: 1.5rem;
        padding: 0 0.5rem;
        border-radius: 999px;
        border: 1px solid #cbd5e1;
        background: #f8fafc;
        color: #0f172a;
        font-size: 0.75rem;
        line-height: 1;
        font-weight: 600;
      }
      .rf-badge[data-tone="success"] { border-color: #93c5fd; background: #e0f2fe; }
      .rf-badge[data-tone="warning"] { border-color: #fca5a5; background: #fff1f2; }
      .rf-badge[data-tone="danger"] { border-color: #f87171; background: #fee2e2; }
      .rf-tag[data-tone="brand"] { border-color: #93c5fd; background: #dbeafe; }
      .rf-file-upload {
        display: block;
        width: min(100%, 28rem);
        border: 1px dashed #cbd5e1;
        border-radius: 10px;
        background: #f8fafc;
        color: #0f172a;
        padding: 0.45rem 0.55rem;
      }
      .rf-file-upload::file-selector-button {
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: #fff;
        color: #0f172a;
        min-height: 2rem;
        padding: 0 0.7rem;
        margin-right: 0.6rem;
      }
      .rf-date-picker { position: relative; width: min(100%, 20rem); }
      .rf-date-picker-field { display: grid; grid-template-columns: 1fr auto; gap: 0.45rem; align-items: center; }
      .rf-date-picker-toggle {
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        min-height: 2.5rem;
        min-width: 2.5rem;
        background: #fff;
        color: #0f172a;
      }
      .rf-date-picker-panel {
        position: absolute;
        top: calc(100% + 0.35rem);
        left: 0;
        width: min(22rem, 100vw - 2rem);
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 16px 32px rgba(15, 23, 42, 0.16);
        padding: 0.65rem;
        z-index: 50;
      }
      .rf-date-picker-panel[hidden] { display: none; }
      .rf-date-picker-header { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.35rem; margin-bottom: 0.45rem; }
      .rf-date-picker-title { margin: 0; text-align: center; font-size: 0.95rem; }
      .rf-date-picker-nav {
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: #fff;
        color: #0f172a;
        min-height: 2rem;
        min-width: 2rem;
      }
      .rf-date-picker-grid { width: 100%; border-collapse: collapse; }
      .rf-date-picker-grid th { font-size: 0.75rem; color: #64748b; text-align: center; padding: 0.2rem; }
      .rf-date-picker-grid td { padding: 0.1rem; }
      .rf-date-picker-day {
        width: 100%;
        border: 1px solid transparent;
        border-radius: 7px;
        min-height: 2rem;
        background: transparent;
        color: #0f172a;
      }
      .rf-date-picker-day[data-selected="true"] { border-color: #2563eb; background: #e0edff; font-weight: 600; }
      .rf-date-picker-day[data-in-range="true"] { background: #edf3ff; }
      .rf-date-range-picker .docs-input { width: 100%; }
      .rf-time-picker { width: min(100%, 14rem); }
      .rf-date-time-picker-fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.5rem;
        width: min(100%, 24rem);
      }
      .rf-textarea-base { min-height: 6.5rem; padding: 0.625rem 0.75rem; resize: vertical; }
      .rf-switch { display: inline-flex; align-items: center; gap: 0.55rem; cursor: pointer; }
      .rf-switch-input {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
        clip: rect(0 0 0 0);
        overflow: hidden;
        white-space: nowrap;
      }
      .rf-switch-control {
        position: relative;
        flex: 0 0 auto;
        width: 2.5rem;
        height: 1.5rem;
        border-radius: 999px;
        border: 1px solid #cbd5e1;
        background: #dbe3ee;
      }
      .rf-switch-thumb {
        position: absolute;
        top: 0.125rem;
        left: 0.125rem;
        width: 1.125rem;
        height: 1.125rem;
        border-radius: 999px;
        background: #fff;
        border: 1px solid #cbd5e1;
        transition: transform 120ms ease;
      }
      .rf-switch-input:checked + .rf-switch-control { background: #2563eb; border-color: #2563eb; }
      .rf-switch-input:checked + .rf-switch-control .rf-switch-thumb { transform: translateX(1rem); }
      .rf-switch-input:focus-visible + .rf-switch-control { outline: 2px solid #1d4ed8; outline-offset: 2px; }
      .rf-switch-input:disabled + .rf-switch-control,
      .rf-switch-input:disabled ~ .rf-switch-label { opacity: 0.55; cursor: not-allowed; }
      .rf-pagination { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
      .rf-pagination-list { display: inline-flex; align-items: center; gap: 0.35rem; list-style: none; margin: 0; padding: 0; }
      .rf-pagination-page {
        min-width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.5rem;
        border: 1px solid #cbd5e1;
        background: #fff;
        color: #0f172a;
        font: inherit;
        cursor: pointer;
      }
      .rf-pagination-page[data-current="true"] { border-color: #2563eb; background: #eef4ff; font-weight: 600; }
      .rf-pagination-ellipsis { color: #64748b; min-width: 1.5rem; text-align: center; }
      .docs-error { color: #dc2626; font-size: 0.875rem; }
      .docs-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); display: grid; place-items: center; }
      .docs-overlay[hidden] { display: none; }
      .docs-panel { width: min(36rem, 100%); background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 1rem; display: grid; gap: 0.75rem; }
      .docs-drawer-backdrop { place-items: stretch; backdrop-filter: blur(1.5px); background: rgba(15, 23, 42, 0.36); }
      .docs-drawer-panel {
        margin-left: auto;
        width: min(30rem, 100vw);
        height: 100vh;
        background: #fff;
        border-left: 1px solid #cbd5e1;
        box-shadow: -24px 0 42px rgba(15, 23, 42, 0.24);
        display: grid;
        grid-template-rows: auto 1fr auto;
      }
      .docs-drawer-header { padding: 1rem 1rem 0.85rem; border-bottom: 1px solid #e2e8f0; }
      .docs-drawer-header h3 { margin: 0; font-size: 1rem; }
      .docs-drawer-body { padding: 1rem; display: grid; gap: 0.75rem; align-content: start; overflow: auto; }
      .docs-drawer-footer { padding: 0.85rem 1rem 1rem; border-top: 1px solid #e2e8f0; display: flex; gap: 0.5rem; justify-content: flex-end; }
      .docs-menu { display: inline-block; position: relative; }
      .docs-menu-list {
        margin: 0.375rem 0 0;
        padding: 0.25rem;
        list-style: none;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        background: #fff;
        position: absolute;
        min-width: 200px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.14);
        z-index: 40;
      }
      .docs-menu-list[hidden] { display: none; }
      .docs-menu-item {
        width: 100%;
        text-align: left;
        border: 0;
        background: transparent;
        color: #0f172a;
        border-radius: 7px;
        padding: 0.55rem 0.65rem;
        min-height: auto;
        font-size: 1rem;
        line-height: 1.2;
        cursor: pointer;
      }
      .docs-menu-item:hover { background: #eef4ff; }
      .docs-menu-item:focus-visible {
        outline: 2px solid #1d4ed8;
        outline-offset: 1px;
        background: #eef4ff;
      }
      .docs-toast-stack {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 0.625rem;
        max-width: 24rem;
      }
      .docs-toast {
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 0.625rem 0.75rem 0.5rem;
        background: #ffffff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
        animation: docs-toast-in 140ms ease-out;
      }
      .docs-toast.is-leaving { animation: docs-toast-out 140ms ease-in forwards; }
      .docs-toast[data-tone="neutral"] { background: #f8fafc; }
      .docs-toast[data-tone="success"] { background: #f0fdf4; }
      .docs-toast[data-tone="danger"] { background: #fef2f2; }
      .docs-toast-head { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
      .docs-toast-tone {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #334155;
        font-weight: 700;
      }
      .docs-toast-message { margin: 0.35rem 0 0; font-size: 1.05rem; font-weight: 600; color: #0f172a; }
      .docs-toast-meta { margin: 0.2rem 0 0; font-size: 0.8rem; color: #475569; }
      .docs-toast-close {
        border: 0;
        background: transparent;
        color: #334155;
        font-size: 1.1rem;
        line-height: 1;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 999px;
        cursor: pointer;
      }
      .docs-toast-close:hover { background: rgba(15, 23, 42, 0.08); }
      .docs-toast-close:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 1px; }
      .docs-toast-progress {
        margin-top: 0.45rem;
        height: 3px;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.14);
        overflow: hidden;
      }
      .docs-toast-progress > span {
        display: block;
        height: 100%;
        width: 100%;
        background: #2563eb;
      }
      @keyframes docs-toast-progress { from { transform: scaleX(1); transform-origin: left; } to { transform: scaleX(0); transform-origin: left; } }
      @keyframes docs-toast-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes docs-toast-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(4px); } }
      @keyframes docs-skeleton-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
      @keyframes docs-spinner-rotate { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        .docs-toast,
        .docs-toast.is-leaving,
        .docs-toast-progress > span,
        .rf-skeleton-line,
        .rf-spinner-dot {
          animation: none;
        }
      }
      .rf-alert {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 0.75rem 0.875rem;
        background: #f8fafc;
      }
      .rf-alert-title { margin: 0 0 0.25rem; font-size: 1rem; }
      .rf-alert-dismiss {
        border: 0;
        background: transparent;
        color: inherit;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 999px;
        font-size: 1.125rem;
        line-height: 1;
        cursor: pointer;
      }
      .rf-inline-alert {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.65rem;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 0.5rem 0.625rem;
        background: #f8fafc;
      }
      .rf-inline-alert[data-tone="success"] { border-color: #93c5fd; background: #e0f2fe; }
      .rf-inline-alert[data-tone="warning"],
      .rf-inline-alert[data-tone="danger"] { border-color: #fca5a5; background: #fff1f2; }
      .rf-inline-alert-body { font-size: 0.9rem; line-height: 1.35; }
      .rf-result {
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        background: #fff;
        padding: 1rem;
        display: grid;
        gap: 0.65rem;
        text-align: center;
        justify-items: center;
      }
      .rf-result[data-tone="success"] { border-color: #93c5fd; background: #e0f2fe; }
      .rf-result[data-tone="warning"],
      .rf-result[data-tone="danger"] { border-color: #fca5a5; background: #fff1f2; }
      .rf-result-title { margin: 0; font-size: 1.1rem; }
      .rf-result-description { margin: 0; max-width: 46ch; color: #475569; }
      .rf-result-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
      .rf-card { border: 1px solid #cbd5e1; border-radius: 14px; background: #fff; overflow: clip; }
      .rf-card-header,
      .rf-card-body,
      .rf-card-footer { padding: 0.875rem 1rem; }
      .rf-card-header { border-bottom: 1px solid #dbe3ee; }
      .rf-card-footer { border-top: 1px solid #dbe3ee; }
      .rf-card-title { margin: 0; font-size: 1.05rem; }
      .rf-card-subtitle { margin: 0.25rem 0 0; color: #475569; }
      .rf-page-header {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 1px solid #cbd5e1;
        padding-bottom: 0.75rem;
      }
      .rf-page-header-title { margin: 0; font-size: clamp(1.35rem, 1.1rem + 1.2vw, 2rem); }
      .rf-page-header-subtitle { margin: 0.35rem 0 0; color: #475569; }
      .rf-app-header { display: grid; gap: 0.5rem; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; background: #fff; }
      .rf-app-header[data-density="compact"] { gap: 0.35rem; padding: 0.55rem 0.75rem; }
      .rf-app-header-top { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
      .rf-app-header-branding { display: flex; align-items: center; gap: 0.6rem; min-width: 0; }
      .rf-app-header-brand { font-weight: 700; }
      .rf-app-header-title { margin: 0; font-size: 1rem; line-height: 1.3; }
      .rf-app-header-subtitle { margin: 0.15rem 0 0; font-size: 0.85rem; color: #64748b; }
      .rf-app-header-right, .rf-app-header-actions { display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; }
      .rf-app-header-nav { border-top: 1px solid #dbe3ee; padding-top: 0.45rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
      .rf-app-shell { --rf-app-shell-sidebar-width: 15rem; display: grid; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; background: #fff; min-height: 16rem; }
      .rf-app-shell-header { border-bottom: 1px solid #cbd5e1; background: #f8fafc; padding: 0.75rem 1rem; }
      .rf-app-shell-body { display: grid; grid-template-columns: var(--rf-app-shell-sidebar-width) minmax(0, 1fr); min-height: 0; }
      .rf-app-shell[data-sidebar-state="collapsed"] .rf-app-shell-body { grid-template-columns: 0 minmax(0, 1fr); }
      .rf-app-shell-sidebar { border-right: 1px solid #cbd5e1; padding: 0.75rem; background: #f8fafc; }
      .rf-app-shell-main { padding: 1rem; min-width: 0; }
      .rf-side-nav { display: grid; gap: 0.85rem; }
      .rf-side-nav-section { display: grid; gap: 0.4rem; }
      .rf-side-nav-heading { margin: 0; font-size: 0.75rem; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b; }
      .rf-side-nav-list, .rf-side-nav-sublist { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.2rem; }
      .rf-side-nav-sublist { margin-top: 0.2rem; margin-left: 0.75rem; padding-left: 0.55rem; border-left: 1px solid #dbe3ee; }
      .rf-side-nav-link { display: block; border-radius: 0.5rem; padding: 0.42rem 0.5rem; color: #334155; text-decoration: none; font-size: 0.9rem; line-height: 1.3; }
      .rf-side-nav-link:hover { background: #eff6ff; }
      .rf-side-nav-item[data-active="true"] > .rf-side-nav-link,
      .rf-side-nav-link[aria-current="page"] { background: #dbeafe; color: #1e3a8a; font-weight: 600; }
      .rf-breadcrumbs-list { margin: 0; padding: 0; list-style: none; display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; }
      .rf-breadcrumbs-item { display: inline-flex; align-items: center; gap: 0.45rem; }
      .rf-breadcrumbs-link,
      .rf-breadcrumbs-label { font-size: 0.9rem; line-height: 1.3; color: #334155; text-decoration: none; }
      .rf-breadcrumbs-link:hover { text-decoration: underline; }
      .rf-breadcrumbs-label[aria-current="page"] { font-weight: 600; color: #0f172a; }
      .rf-breadcrumbs-separator { color: #94a3b8; user-select: none; }
      .rf-breadcrumbs-overflow { color: #64748b; font-weight: 600; letter-spacing: 0.02em; }
      .rf-steps-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.625rem; }
      .rf-steps-item { display: grid; grid-template-columns: auto 1fr; gap: 0.6rem; align-items: start; }
      .rf-steps-marker { width: 1.45rem; height: 1.45rem; border-radius: 999px; border: 1px solid #cbd5e1; color: #475569; background: #f8fafc; display: inline-grid; place-items: center; font-size: 0.78rem; line-height: 1; font-weight: 600; }
      .rf-steps-content { display: grid; gap: 0.2rem; }
      .rf-steps-label { font-size: 0.92rem; line-height: 1.3; color: #334155; }
      .rf-steps-description { font-size: 0.84rem; line-height: 1.3; color: #64748b; }
      .rf-steps-item[data-status="complete"] .rf-steps-marker { border-color: #93c5fd; background: #eff6ff; color: #1d4ed8; }
      .rf-steps-item[data-status="current"] .rf-steps-marker { border-color: #2563eb; background: #2563eb; color: #fff; }
      .rf-steps-item[data-status="current"] .rf-steps-label { font-weight: 600; color: #0f172a; }
      .rf-empty-state {
        border: 1px dashed #cbd5e1;
        border-radius: 14px;
        text-align: center;
        padding: 1.5rem 1rem;
        background: #f8fafc;
      }
      .rf-empty-state-title { margin: 0; font-size: 1.2rem; }
      .rf-empty-state-description { margin: 0.5rem auto 0; max-width: 32ch; color: #475569; }
      .rf-empty-state-action { margin-top: 0.875rem; }
      .rf-filter-bar {
        display: grid;
        gap: 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 14px;
        padding: 0.875rem;
        background: #f8fafc;
      }
      .rf-filter-bar-title { margin: 0; font-size: 1rem; }
      .rf-filter-bar-fields {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.625rem;
      }
      .rf-filter-bar-actions { display: flex; gap: 0.5rem; justify-content: end; }
      .rf-data-list {
        list-style: none;
        margin: 0;
        padding: 0;
        border: 1px solid #cbd5e1;
        border-radius: 14px;
        overflow: clip;
      }
      .rf-data-list-item {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.875rem 1rem;
        border-top: 1px solid #dbe3ee;
      }
      .rf-data-list-item:first-child { border-top: 0; }
      .rf-data-list-title { margin: 0; font-size: 1rem; }
      .rf-data-list-description,
      .rf-data-list-meta { margin: 0.3rem 0 0; color: #475569; font-size: 0.9rem; }
      .rf-data-list-right { display: grid; justify-items: end; align-content: center; gap: 0.45rem; }
      .rf-data-grid-wrap {
        overflow: auto;
        border: 1px solid #cbd5e1;
        border-radius: 14px;
        background: #fff;
      }
      .rf-data-grid {
        width: 100%;
        border-collapse: collapse;
        min-width: 620px;
      }
      .rf-data-grid caption {
        text-align: left;
        font-weight: 600;
        padding: 0.875rem 1rem 0.4rem;
      }
      .rf-data-grid th,
      .rf-data-grid td {
        border-top: 1px solid #dbe3ee;
        padding: 0.75rem 1rem;
        text-align: left;
        vertical-align: top;
      }
      .rf-data-grid th { background: #f1f5f9; font-weight: 600; border-top: 0; }
      .rf-data-grid [data-align="right"] { text-align: right; }
      .rf-data-grid-select-col { width: 2.75rem; text-align: center; }
      .rf-data-grid-sort {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 0;
      }
      .rf-data-grid-sort-indicator { font-size: 0.85rem; opacity: 0.75; }
      .rf-data-grid tbody tr[data-selected="true"] { background: #eef4ff; }
      .rf-data-table-wrap { border: 1px solid #cbd5e1; border-radius: 12px; background: #fff; overflow: hidden; display: grid; }
      .rf-data-table { width: 100%; border-collapse: collapse; min-width: 680px; }
      .rf-data-table caption { text-align: left; font-weight: 600; padding: 0.875rem 1rem 0.4rem; }
      .rf-data-table th,
      .rf-data-table td { border-top: 1px solid #dbe3ee; padding: 0.75rem 1rem; text-align: left; vertical-align: top; }
      .rf-data-table th { background: #f1f5f9; font-weight: 600; border-top: 0; }
      .rf-data-table [data-align="right"] { text-align: right; }
      .rf-data-table-select-col { width: 2.75rem; text-align: center; }
      .rf-data-table-sort { display: inline-flex; align-items: center; gap: 0.35rem; border: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; padding: 0; }
      .rf-data-table-sort-indicator { font-size: 0.85rem; opacity: 0.75; }
      .rf-data-table tbody tr[data-selected="true"] { background: #eef4ff; }
      .rf-data-table-footer { border-top: 1px solid #dbe3ee; padding: 0.65rem 0.875rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
      .rf-data-table-pagination-status { font-size: 0.84rem; color: #64748b; }
      .rf-data-table-pagination-actions { display: flex; gap: 0.45rem; }
      .rf-table-wrap {
        overflow: auto;
        border: 1px solid #cbd5e1;
        border-radius: 14px;
        background: #fff;
      }
      .rf-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 540px;
      }
      .rf-table caption {
        text-align: left;
        font-weight: 600;
        padding: 0.875rem 1rem 0.4rem;
      }
      .rf-table th,
      .rf-table td {
        border-top: 1px solid #dbe3ee;
        padding: 0.75rem 1rem;
        text-align: left;
        vertical-align: top;
      }
      .rf-table th { background: #f1f5f9; font-weight: 600; border-top: 0; }
      .rf-table [data-align="right"] { text-align: right; }
      .rf-empty-results {
        border: 1px dashed #cbd5e1;
        border-radius: 14px;
        text-align: center;
        padding: 1rem;
        background: #f8fafc;
      }
      .rf-empty-results-title { margin: 0; font-size: 1.05rem; }
      .rf-empty-results-description { margin: 0.45rem auto 0; max-width: 36ch; color: #475569; }
      .rf-empty-results-action { margin-top: 0.8rem; }
      .rf-popover { position: relative; display: inline-block; }
      .rf-popover-panel {
        position: absolute;
        top: calc(100% + 0.4rem);
        left: 0;
        min-width: 14rem;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
        padding: 0.625rem;
        z-index: 40;
      }
      .rf-popover-panel[hidden] { display: none; }
      .rf-tooltip-wrap { position: relative; display: inline-block; }
      .rf-tooltip {
        position: absolute;
        left: 50%;
        bottom: calc(100% + 0.35rem);
        transform: translateX(-50%);
        background: #0f172a;
        color: #f8fafc;
        padding: 0.3rem 0.55rem;
        border-radius: 0.4rem;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 50;
      }
      .rf-tooltip[hidden] { display: none; }
      .rf-tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 4px;
        border-style: solid;
        border-color: #0f172a transparent transparent transparent;
      }
      .rf-dropdown { display: inline-block; }
      .rf-combobox { position: relative; width: min(22rem, 100%); }
      .rf-combobox-list {
        position: absolute;
        top: calc(100% + 0.35rem);
        left: 0;
        right: 0;
        margin: 0;
        padding: 0.25rem;
        list-style: none;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
      }
      .rf-combobox-list[hidden] { display: none; }
      .rf-combobox-option { padding: 0.5rem 0.6rem; border-radius: 0.5rem; cursor: pointer; }
      .rf-combobox-option:hover { background: #eef4ff; }
      .rf-slider { width: min(100%, 20rem); accent-color: #2563eb; cursor: pointer; }
      .rf-range-slider { position: relative; width: min(100%, 22rem); height: 2rem; display: grid; align-items: center; --rf-range-start: 0%; --rf-range-end: 100%; }
      .rf-range-slider-track { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); height: 0.35rem; border-radius: 999px; background: #cbd5e1; overflow: hidden; }
      .rf-range-slider-track::before { content: ""; position: absolute; left: var(--rf-range-start); right: calc(100% - var(--rf-range-end)); top: 0; bottom: 0; background: #2563eb; }
      .rf-range-slider-input { position: absolute; inset: 0; margin: 0; appearance: none; background: none; pointer-events: none; }
      .rf-range-slider-input::-webkit-slider-thumb { appearance: none; pointer-events: auto; width: 0.9rem; height: 0.9rem; border-radius: 999px; border: 1px solid #93c5fd; background: #fff; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2); cursor: pointer; }
      .rf-range-slider-input::-moz-range-thumb { pointer-events: auto; width: 0.9rem; height: 0.9rem; border-radius: 999px; border: 1px solid #93c5fd; background: #fff; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2); cursor: pointer; }
      .rf-progress-wrap { display: grid; gap: 0.35rem; width: min(100%, 24rem); }
      .rf-progress-label, .rf-progress-value { font-size: 0.875rem; color: #475569; }
      .rf-progress { height: 0.625rem; border-radius: 999px; border: 1px solid #cbd5e1; background: #e2e8f0; overflow: clip; }
      .rf-progress-bar { height: 100%; background: #2563eb; }
      .rf-skeleton { display: grid; gap: 0.5rem; width: min(100%, 28rem); }
      .rf-skeleton-line { display: block; height: 0.9rem; border-radius: 0.4rem; background: #e2e8f0; animation: docs-skeleton-pulse 1300ms ease-in-out infinite; }
      .rf-spinner { display: inline-flex; align-items: center; gap: 0.5rem; color: #0f172a; }
      .rf-spinner-dot { display: inline-block; width: 1rem; height: 1rem; border-radius: 999px; border: 2px solid #bfdbfe; border-top-color: #2563eb; animation: docs-spinner-rotate 900ms linear infinite; }
      .rf-spinner[data-size="sm"] .rf-spinner-dot { width: 0.875rem; height: 0.875rem; }
      .rf-spinner[data-size="lg"] .rf-spinner-dot { width: 1.25rem; height: 1.25rem; }
      .rf-spinner-label { font-size: 0.875rem; }
      .rf-command-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.45);
        display: grid;
        place-items: start center;
        padding: 10vh 1rem 1rem;
        z-index: 60;
      }
      .rf-command-overlay[hidden] { display: none; }
      .rf-command {
        width: min(44rem, 100%);
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        background: #fff;
        padding: 0.85rem;
        display: grid;
        gap: 0.625rem;
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.24);
      }
      .rf-command-title { margin: 0; font-size: 1rem; }
      .rf-command-list { list-style: none; margin: 0; padding: 0.2rem; display: grid; gap: 0.2rem; }
      .rf-command-item { padding: 0.55rem 0.65rem; border-radius: 0.55rem; cursor: pointer; }
      .rf-command-item:hover { background: #eef4ff; }
      nav ul { margin: 0; padding-left: 1.2rem; }
      nav { position: sticky; top: 1rem; align-self: start; max-height: calc(100vh - 2rem); overflow: auto; }
      article { margin-bottom: 2rem; }
    </style>
  </head>
  <body>
    <h1>Remix Frame UI Docs</h1>
    <main>
      <nav>
        <h2>Components</h2>
        <ul>${nav}</ul>
      </nav>
      <section>${docsBody}</section>
    </main>
    <script type="module" src="./docs-runtime.js"></script>
  </body>
</html>`

await writeFile(path.join(outDir, "index.html"), html)
await writeFile(path.join(outDir, "docs-runtime.js"), await readFile(runtimeSourcePath, "utf8"))
console.log(`Built docs for ${pages.length} components`)

function escapeHtml(input) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
