import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { renderMarkdownToHtml } from "./render-markdown.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const contentDir = path.join(root, "content", "components")
const outDir = path.join(root, "dist")
const runtimeSourcePath = path.join(root, "src", "docs-runtime.js")
const metadataPath = path.resolve(root, "..", "..", "packages", "remix", "src", "component-metadata.json")

const demoByComponent = new Map([
  ["alert", { id: "alert-basic", title: "Alert: tone and dismiss patterns" }],
  ["anchor", { id: "anchor-basic", title: "Anchor: in-page section navigation" }],
  ["appheader", { id: "app-header-basic", title: "AppHeader: brand, nav, and actions" }],
  ["appprovider", { id: "app-provider-basic", title: "AppProvider: locale, direction, and navigation" }],
  ["appshell", { id: "app-shell-basic", title: "AppShell: header, sidebar, and content regions" }],
  ["avatar", { id: "avatar-basic", title: "Avatar: initials, size, shape, and status" }],
  ["autocomplete", { id: "autocomplete-basic", title: "Autocomplete: free text with suggestion commit" }],
  ["badge", { id: "badge-basic", title: "Badge: compact status labels" }],
  ["breadcrumboverflow", { id: "breadcrumbs-overflow-basic", title: "BreadcrumbOverflow: collapsed long paths" }],
  ["breadcrumbs", { id: "breadcrumbs-basic", title: "Breadcrumbs: hierarchical location path" }],
  ["button", { id: "button-basic", title: "Button: interactive counter" }],
  ["calendar", { id: "calendar-basic", title: "Calendar: native date/month selection" }],
  ["card", { id: "card-basic", title: "Card: header, body, footer composition" }],
  ["cascader", { id: "cascader-basic", title: "Cascader: multi-level option selection" }],
  ["chip", { id: "chip-basic", title: "Chip: compact metadata token" }],
  ["combobox", { id: "combobox-basic", title: "Combobox: search and select options" }],
  ["confirmdialog", { id: "confirm-dialog-basic", title: "ConfirmDialog: destructive action confirmation" }],
  ["commandpalette", { id: "command-palette-basic", title: "CommandPalette: quick action launcher" }],
  ["collapse", { id: "collapse-basic", title: "Collapse: details and summary disclosure" }],
  ["configprovider", { id: "config-provider-basic", title: "ConfigProvider: app-level locale and navigation context" }],
  ["datagridlite", { id: "data-grid-lite-basic", title: "DataGridLite: sorting and selection" }],
  ["datalist", { id: "data-list-basic", title: "DataList: item metadata and actions" }],
  ["descriptions", { id: "descriptions-basic", title: "Descriptions: record detail fields" }],
  ["divider", { id: "divider-basic", title: "Divider: horizontal and vertical separators" }],
  ["datatable", { id: "data-table-basic", title: "DataTable: sorting, selection, and pagination" }],
  ["datepicker", { id: "date-picker-basic", title: "DatePicker: calendar date selection" }],
  ["datetimepicker", { id: "date-time-picker-basic", title: "DateTimePicker: combined date and time" }],
  ["daterangepicker", { id: "date-range-picker-basic", title: "DateRangePicker: start and end selection" }],
  ["dropdown", { id: "dropdown-basic", title: "Dropdown: menu wrapper for actions" }],
  ["empty", { id: "empty-basic", title: "Empty: generic no-data messaging" }],
  ["drawer", { id: "drawer-basic", title: "Drawer: side panel workflow" }],
  ["emptystate", { id: "empty-state-basic", title: "EmptyState: recovery-focused messaging" }],
  ["emptyresults", { id: "empty-results-basic", title: "EmptyResults: no-match recovery state" }],
  ["fileupload", { id: "file-upload-basic", title: "FileUpload: native file picker and constraints" }],
  ["field", { id: "field-basic", title: "Field: label, description, error wiring" }],
  ["flex", { id: "flex-basic", title: "Flex: one-dimensional alignment and distribution" }],
  ["form", { id: "form-basic", title: "Form: submit and reset orchestration" }],
  ["formfieldset", { id: "form-fieldset-basic", title: "FormFieldset: grouped controls with legend" }],
  ["formlayout", { id: "form-layout-basic", title: "FormLayout: structured form sections" }],
  ["formmessage", { id: "form-message-basic", title: "FormMessage: helper and validation feedback" }],
  ["grid", { id: "grid-basic", title: "Grid: span-based tile layout" }],
  ["filterbar", { id: "filter-bar-basic", title: "FilterBar: grouped controls and actions" }],
  ["filterpanel", { id: "filter-panel-basic", title: "FilterPanel: drawer-based filters" }],
  ["input", { id: "field-input", title: "Field + Input: live validation" }],
  ["inlinealert", { id: "inline-alert-basic", title: "InlineAlert: compact in-flow status" }],
  ["image", { id: "image-basic", title: "Image: media with fit strategies" }],
  ["layout", { id: "layout-basic", title: "Layout: header, sider, content, footer shell" }],
  ["link", { id: "link-basic", title: "Link: internal routing and external navigation" }],
  ["checkbox", { id: "checkbox-basic", title: "Checkbox: native checked semantics" }],
  ["radio", { id: "radio-group", title: "RadioGroup: single selection" }],
  ["rangeslider", { id: "range-slider-basic", title: "RangeSlider: two-thumb range selection" }],
  ["result", { id: "result-basic", title: "Result: outcome and recovery actions" }],
  ["segmented", { id: "segmented-basic", title: "Segmented: mode and view switching" }],
  ["pageheader", { id: "page-header-basic", title: "PageHeader: title, subtitle, actions" }],
  ["popover", { id: "popover-basic", title: "Popover: anchored disclosure panel" }],
  ["progress", { id: "progress-basic", title: "Progress: completion and status tracking" }],
  ["select", { id: "select-basic", title: "Select: native option selection" }],
  ["sidenav", { id: "side-nav-basic", title: "SideNav: sectioned app navigation" }],
  ["topnav", { id: "top-nav-basic", title: "TopNav: horizontal route navigation" }],
  ["splitter", { id: "splitter-basic", title: "Splitter: resizable two-pane layout" }],
  ["skeleton", { id: "skeleton-basic", title: "Skeleton: loading placeholders" }],
  ["slider", { id: "slider-basic", title: "Slider: range selection with live value" }],
  ["spinner", { id: "spinner-basic", title: "Spinner: inline loading indicator" }],
  ["space", { id: "space-basic", title: "Space: consistent inline and wrapped spacing" }],
  ["statistic", { id: "statistic-basic", title: "Statistic: labeled value metrics" }],
  ["steps", { id: "steps-basic", title: "Steps: multi-step progress indicator" }],
  ["switch", { id: "switch-basic", title: "Switch: boolean setting toggle" }],
  ["table", { id: "table-basic", title: "Table: semantic columns and rows" }],
  ["tag", { id: "tag-basic", title: "Tag: categorization labels" }],
  ["tabs", { id: "tabs-basic", title: "Tabs: manual activation" }],
  ["textarea", { id: "textarea-basic", title: "Textarea: multiline field input" }],
  ["transfer", { id: "transfer-basic", title: "Transfer: move items between lists" }],
  ["timepicker", { id: "time-picker-basic", title: "TimePicker: time-of-day selection" }],
  ["timeline", { id: "timeline-basic", title: "Timeline: ordered event history" }],
  ["dialog", { id: "dialog-controlled", title: "Dialog: controlled open/close" }],
  ["menu", { id: "menu-actions", title: "Menu: keyboard navigation" }],
  ["numberinput", { id: "number-input-basic", title: "NumberInput: constrained numeric value" }],
  ["pagination", { id: "pagination-basic", title: "Pagination: previous, next, and current page" }],
  ["toast", { id: "toast-queue", title: "Toast: queue and auto-dismiss" }],
  ["tooltip", { id: "tooltip-basic", title: "Tooltip: hover and focus context" }],
  ["typography", { id: "typography-basic", title: "Typography: semantic text primitives" }],
  ["tree", { id: "tree-basic", title: "Tree: hierarchical navigation and selection" }],
  ["treeselect", { id: "tree-select-basic", title: "TreeSelect: hierarchical option picker" }],
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
  const html = await renderMarkdownToHtml(markdown)
  pages.push({ file, markdown: html, maturity: maturityByName.get(componentName) })
}

await mkdir(outDir, { recursive: true })

const nav = pages
  .map((page, index) => {
    const name = page.file.replace(/\.md$/, "")
    return `<li class="rf-side-nav-item" data-active="${index === 0 ? "true" : "false"}"><a class="rf-side-nav-link" href="#${name}" ${index === 0 ? 'aria-current="page"' : ""}>${name}</a></li>`
  })
  .join("\n")

const docsBody = pages
  .map((page) => {
    const name = page.file.replace(/\.md$/, "")
    const demo = demoByComponent.get(name)
    const demoSection = demo
      ? `<section class="demo-block"><h3>${demo.title}</h3><div class="demo-mount" data-demo="${demo.id}"></div></section>`
      : ""

    return `<article id="${name}"><p><strong>Maturity:</strong> ${page.maturity}</p>${demoSection}${page.markdown}</article>`
  })
  .join("\n")

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Remix Frame UI Docs</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; line-height: 1.5; background: #f1f5f9; color: #0f172a; }
      .docs-site-shell.rf-app-shell {
        min-height: 100vh;
        border: 0;
        border-radius: 0;
        overflow: visible;
        background: transparent;
        --rf-app-shell-sidebar-width: 18rem;
      }
      .docs-site-shell .rf-app-shell-header {
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid #dbe3ee;
        background: #fff;
        padding: 1rem 1.25rem;
      }
      .docs-site-shell .rf-app-shell-body {
        display: grid;
        grid-template-columns: var(--rf-app-shell-sidebar-width) minmax(0, 1fr);
        gap: 0;
      }
      .docs-site-shell .rf-app-shell-sidebar {
        position: sticky;
        top: 4.2rem;
        height: calc(100vh - 4.2rem);
        box-sizing: border-box;
        overflow: auto;
        border-right: 1px solid #dbe3ee;
        background: #f8fafc;
        padding: 1rem;
      }
      .docs-site-shell .rf-app-shell-main { padding: 1.25rem; }
      .docs-site-nav { display: grid; gap: 0.75rem; }
      .docs-site-nav-title { margin: 0; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; }
      .docs-site-nav .rf-side-nav-list { display: grid; gap: 0.2rem; margin: 0; padding: 0; list-style: none; }
      .docs-site-content article {
        margin-bottom: 2rem;
        scroll-margin-top: 5.25rem;
      }
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
      .rf-segmented { display: inline-grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: .25rem; padding: .25rem; border: 1px solid #cbd5e1; border-radius: .65rem; background: #f8fafc; }
      .rf-segmented-option { border: 0; border-radius: .5rem; background: transparent; color: #334155; font: inherit; padding: .4rem .65rem; min-height: 2rem; cursor: pointer; white-space: nowrap; }
      .rf-segmented-option[data-selected="true"] { background: #fff; color: #1e3a8a; box-shadow: 0 0 0 1px #cbd5e1; font-weight: 600; }
      .rf-segmented-option:disabled { opacity: .55; cursor: not-allowed; }
      .rf-transfer { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); gap: .8rem; align-items: center; }
      .rf-transfer-panel { border: 1px solid #cbd5e1; border-radius: .7rem; overflow: clip; background: #fff; min-height: 14rem; display: grid; grid-template-rows: auto minmax(0, 1fr); }
      .rf-transfer-panel-header { padding: .55rem .65rem; border-bottom: 1px solid #dbe3ee; display: flex; align-items: center; justify-content: space-between; gap: .5rem; font-size: .86rem; }
      .rf-transfer-list { margin: 0; padding: 0; list-style: none; overflow: auto; }
      .rf-transfer-item { border-top: 1px solid #e2e8f0; }
      .rf-transfer-item:first-child { border-top: 0; }
      .rf-transfer-item-label { display: grid; grid-template-columns: auto minmax(0,1fr); gap: .5rem; align-items: start; padding: .5rem .6rem; cursor: pointer; }
      .rf-transfer-item-check { margin-top: .2rem; }
      .rf-transfer-item-text { display: grid; gap: .2rem; min-width: 0; }
      .rf-transfer-item-title { font-size: .9rem; color: #0f172a; }
      .rf-transfer-item-description { font-size: .82rem; color: #64748b; }
      .rf-transfer-item[data-disabled="true"] .rf-transfer-item-label { opacity: .55; cursor: not-allowed; }
      .rf-transfer-empty { margin: 0; padding: .7rem; color: #64748b; font-size: .86rem; }
      .rf-transfer-ops { display: grid; gap: .45rem; }
      .rf-timeline-wrap { border: 1px solid #cbd5e1; border-radius: .85rem; background: #fff; box-shadow: 0 1px 0 #dbe3ee; padding: .9rem .95rem; }
      .rf-timeline { margin: 0; padding: 0; list-style: none; display: grid; gap: .45rem; }
      .rf-timeline-item { --rf-timeline-marker-size: .85rem; --rf-timeline-marker-offset: .28rem; --rf-timeline-line-width: 2px; display: grid; grid-template-columns: auto minmax(0,1fr); gap: .65rem; align-items: start; min-height: 2.4rem; position: relative; }
      .rf-timeline-item:not(:last-child)::after { content: ""; position: absolute; left: calc((var(--rf-timeline-marker-size) - var(--rf-timeline-line-width)) / 2); top: calc(var(--rf-timeline-marker-offset) + var(--rf-timeline-marker-size) + .22rem); bottom: -.55rem; width: var(--rf-timeline-line-width); background: #dbe3ee; border-radius: 999px; z-index: 0; }
      .rf-timeline-marker { width: var(--rf-timeline-marker-size); height: var(--rf-timeline-marker-size); border-radius: 999px; margin-top: var(--rf-timeline-marker-offset); background: #94a3b8; border: 2px solid #fff; box-shadow: 0 0 0 1px #cbd5e1; box-sizing: border-box; position: relative; z-index: 1; }
      .rf-timeline-item[data-tone="success"] .rf-timeline-marker { background: #22c55e; box-shadow: 0 0 0 1px #86efac; }
      .rf-timeline-item[data-tone="warning"] .rf-timeline-marker { background: #f59e0b; box-shadow: 0 0 0 1px #fcd34d; }
      .rf-timeline-item[data-tone="danger"] .rf-timeline-marker { background: #ef4444; box-shadow: 0 0 0 1px #fca5a5; }
      .rf-timeline-item[data-pending="true"] .rf-timeline-marker { background: transparent; border-style: dashed; box-shadow: 0 0 0 1px #cbd5e1; }
      .rf-timeline-item[data-pending="true"] .rf-timeline-title { color: #64748b; font-weight: 500; }
      .rf-timeline-title { margin: 0; font-size: .96rem; line-height: 1.3; font-weight: 650; }
      .rf-timeline-description, .rf-timeline-time { margin: .18rem 0 0; font-size: .84rem; line-height: 1.35; color: #64748b; }
      .rf-timeline-time { font-size: .78rem; letter-spacing: .01em; color: #475569; }
      .rf-timeline-empty { border: 1px dashed #cbd5e1; border-radius: .75rem; padding: .9rem; color: #64748b; }
      .rf-card { border: 1px solid #cbd5e1; border-radius: 14px; background: #fff; overflow: clip; }
      .rf-card-header,
      .rf-card-body,
      .rf-card-footer { padding: 0.875rem 1rem; }
      .rf-card-header { border-bottom: 1px solid #dbe3ee; }
      .rf-card-footer { border-top: 1px solid #dbe3ee; }
      .rf-card-title { margin: 0; font-size: 1.05rem; }
      .rf-card-subtitle { margin: 0.25rem 0 0; color: #475569; }
      .rf-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--rf-grid-gap, .75rem); align-items: stretch; }
      .rf-grid[data-columns="1"] { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .rf-grid[data-columns="2"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .rf-grid[data-columns="4"] { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .rf-grid[data-columns="6"] { grid-template-columns: repeat(6, minmax(0, 1fr)); }
      .rf-grid[data-columns="12"] { grid-template-columns: repeat(12, minmax(0, 1fr)); }
      .rf-statistic {
        display: grid;
        gap: 0.35rem;
        padding: 0.8rem 0.9rem;
        border: 1px solid #dbe3ee;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 1px 0 #e2e8f0;
      }
      .rf-statistic-label,
      .rf-statistic-caption,
      .rf-statistic-value { margin: 0; }
      .rf-statistic-label { font-size: 0.79rem; color: #64748b; font-weight: 600; letter-spacing: 0.01em; }
      .rf-statistic-value { font-size: 1.45rem; line-height: 1.15; font-weight: 750; color: #0f172a; }
      .rf-statistic-caption { font-size: 0.82rem; color: #64748b; display: inline-flex; align-items: center; gap: 0.3rem; }
      .rf-statistic-trend { font-weight: 700; font-size: 0.9em; }
      .rf-statistic[data-trend="up"] .rf-statistic-caption,
      .rf-statistic[data-trend="up"] .rf-statistic-trend { color: #15803d; }
      .rf-statistic[data-trend="down"] .rf-statistic-caption,
      .rf-statistic[data-trend="down"] .rf-statistic-trend { color: #b91c1c; }
      .rf-statistic[data-trend="neutral"] .rf-statistic-caption,
      .rf-statistic[data-trend="neutral"] .rf-statistic-trend { color: #475569; }
      @media (max-width: 1000px) {
        .rf-grid[data-columns="3"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 700px) {
        .rf-grid[data-columns="3"],
        .rf-grid[data-columns="2"],
        .rf-grid[data-columns="4"] { grid-template-columns: 1fr; }
        .rf-statistic-value { font-size: 1.28rem; }
      }
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
      .rf-splitter { --rf-splitter-size: 50%; display: grid; grid-template-columns: minmax(0, var(--rf-splitter-size)) 0.7rem minmax(0, calc(100% - var(--rf-splitter-size))); min-height: 14rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; overflow: hidden; background: #fff; }
      .rf-splitter[data-orientation="vertical"] { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, var(--rf-splitter-size)) 0.7rem minmax(0, calc(100% - var(--rf-splitter-size))); min-height: 18rem; }
      .rf-splitter-pane { min-width: 0; min-height: 0; padding: 0.9rem; overflow: auto; }
      .rf-splitter-pane[data-pane="first"] { background: #f8fafc; }
      .rf-splitter-handle { display: grid; place-items: center; background: #dbe3ee; cursor: col-resize; }
      .rf-splitter[data-orientation="vertical"] .rf-splitter-handle { cursor: row-resize; }
      .rf-splitter-handle-dot { width: 0.25rem; height: 2rem; border-radius: 999px; background: #94a3b8; }
      .rf-splitter[data-orientation="vertical"] .rf-splitter-handle-dot { width: 2rem; height: 0.25rem; }
      .rf-side-nav { display: grid; gap: 0.85rem; }
      .rf-side-nav-section { display: grid; gap: 0.4rem; }
      .rf-side-nav-heading { margin: 0; font-size: 0.75rem; letter-spacing: 0.04em; text-transform: uppercase; color: #64748b; }
      .rf-side-nav-list, .rf-side-nav-sublist { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.2rem; }
      .rf-side-nav-sublist { margin-top: 0.2rem; margin-left: 0.75rem; padding-left: 0.55rem; border-left: 1px solid #dbe3ee; }
      .rf-side-nav-link { display: block; border-radius: 0.5rem; padding: 0.42rem 0.5rem; color: #334155; text-decoration: none; font-size: 0.9rem; line-height: 1.3; }
      .rf-side-nav-link:hover { background: #eff6ff; }
      .rf-side-nav-item[data-active="true"] > .rf-side-nav-link,
      .rf-side-nav-link[aria-current="page"] { background: #dbeafe; color: #1e3a8a; font-weight: 600; }
      .rf-top-nav { overflow-x: auto; }
      .rf-top-nav-list { margin: 0; padding: 0; list-style: none; display: flex; align-items: center; gap: .3rem; min-width: max-content; }
      .rf-top-nav-link { display: inline-flex; align-items: center; border-radius: .5rem; padding: .45rem .6rem; color: #334155; text-decoration: none; font-size: .9rem; line-height: 1.3; white-space: nowrap; }
      .rf-top-nav-link:hover { background: #eff6ff; }
      .rf-top-nav-item[data-active="true"] > .rf-top-nav-link,
      .rf-top-nav-link[aria-current="page"] { background: #dbeafe; color: #1e3a8a; font-weight: 600; }
      .rf-top-nav-link[data-disabled="true"] { opacity: .55; cursor: not-allowed; }
      .rf-tree { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.15rem; }
      .rf-tree-group { margin: 0 0 0 .4rem; padding: 0 0 0 1rem; list-style: none; display: grid; gap: .15rem; border-left: 1px solid #dbe3ee; }
      .rf-tree-group[hidden] { display: none; }
      .rf-tree-row { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: .3rem; }
      .rf-tree-toggle, .rf-tree-label { border: 0; background: transparent; color: #0f172a; font: inherit; text-align: left; border-radius: .45rem; min-height: 1.9rem; }
      .rf-tree-toggle { width: 1.6rem; padding: 0; display: inline-grid; place-items: center; cursor: pointer; }
      .rf-tree-spacer { width: 1.6rem; height: 1.6rem; display: inline-block; }
      .rf-tree-label { padding: .22rem .4rem; cursor: pointer; }
      .rf-tree-item[data-selected="true"] > .rf-tree-row .rf-tree-label { background: #dbeafe; color: #1e3a8a; font-weight: 600; }
      .rf-tree-item[data-disabled="true"] > .rf-tree-row .rf-tree-label,
      .rf-tree-item[data-disabled="true"] > .rf-tree-row .rf-tree-toggle { opacity: .55; cursor: not-allowed; }
      .rf-tree-select { position: relative; display: grid; gap: .35rem; max-width: 22rem; }
      .rf-tree-select-trigger { border: 1px solid #cbd5e1; border-radius: .6rem; background: #fff; color: #0f172a; font: inherit; min-height: 2.25rem; padding: .4rem .6rem; display: flex; align-items: center; justify-content: space-between; gap: .5rem; cursor: pointer; }
      .rf-tree-select-trigger-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .rf-tree-select-trigger-icon { color: #64748b; font-size: .8rem; }
      .rf-tree-select-panel { border: 1px solid #cbd5e1; border-radius: .65rem; background: #fff; max-height: 15rem; overflow: auto; padding: .35rem; }
      .rf-tree-select-tree, .rf-tree-select-group { margin: 0; padding: 0; list-style: none; display: grid; gap: .15rem; }
      .rf-tree-select-group { margin-left: .4rem; padding-left: .95rem; border-left: 1px solid #dbe3ee; }
      .rf-tree-select-group[hidden] { display: none; }
      .rf-tree-select-row { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: .3rem; }
      .rf-tree-select-toggle, .rf-tree-select-option { border: 0; background: transparent; color: #0f172a; font: inherit; text-align: left; border-radius: .45rem; min-height: 1.85rem; }
      .rf-tree-select-toggle { width: 1.5rem; padding: 0; display: inline-grid; place-items: center; cursor: pointer; }
      .rf-tree-select-option { width: 100%; padding: .2rem .45rem; cursor: pointer; }
      .rf-tree-select-item[data-selected="true"] > .rf-tree-select-row .rf-tree-select-option { background: #dbeafe; color: #1e3a8a; font-weight: 600; }
      .rf-tree-select-item[data-disabled="true"] > .rf-tree-select-row .rf-tree-select-option,
      .rf-tree-select-item[data-disabled="true"] > .rf-tree-select-row .rf-tree-select-toggle { opacity: .55; cursor: not-allowed; }
      .rf-tree-select-spacer { width: 1.5rem; height: 1.5rem; display: inline-block; }
      .rf-tree-select-empty { margin: 0; padding: .4rem; color: #64748b; font-size: .86rem; }
      .rf-cascader { position: relative; display: grid; gap: .35rem; max-width: 24rem; }
      .rf-cascader-trigger { border: 1px solid #cbd5e1; border-radius: .6rem; background: #fff; color: #0f172a; font: inherit; min-height: 2.25rem; padding: .4rem .6rem; display: flex; align-items: center; justify-content: space-between; gap: .5rem; cursor: pointer; }
      .rf-cascader-trigger-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .rf-cascader-trigger-icon { color: #64748b; font-size: .8rem; }
      .rf-cascader-panel { border: 1px solid #cbd5e1; border-radius: .65rem; background: #fff; overflow: auto; max-height: 16rem; padding: .35rem; }
      .rf-cascader-columns { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(9rem, 1fr); gap: .35rem; min-width: min-content; }
      .rf-cascader-column { margin: 0; padding: 0; list-style: none; display: grid; gap: .1rem; }
      .rf-cascader-column[hidden] { display: none; }
      .rf-cascader-column + .rf-cascader-column { border-left: 1px solid #dbe3ee; padding-left: .35rem; }
      .rf-cascader-option { width: 100%; border: 0; background: transparent; color: #0f172a; font: inherit; text-align: left; border-radius: .45rem; min-height: 1.9rem; padding: .22rem .45rem; display: flex; justify-content: space-between; align-items: center; gap: .4rem; cursor: pointer; }
      .rf-cascader-option[data-active="true"] { background: #f1f5f9; }
      .rf-cascader-option:hover:not(:disabled) { background: #eef2ff; }
      .rf-cascader-option[data-selected="true"] { background: #dbeafe; color: #1e3a8a; font-weight: 600; }
      .rf-cascader-option:disabled { opacity: .55; cursor: not-allowed; }
      .rf-cascader-option-icon { color: #64748b; }
      .rf-cascader-empty { margin: 0; padding: .4rem; color: #64748b; font-size: .86rem; }
      .rf-anchor { display: block; }
      .rf-anchor-list { margin: 0; padding: 0; list-style: none; display: grid; gap: .2rem; }
      .rf-anchor-link { display: inline-flex; align-items: center; border-radius: .45rem; text-decoration: none; font-size: .9rem; line-height: 1.3; color: #334155; padding: .2rem .5rem; }
      .rf-anchor-link:hover { background: #eef2ff; color: #0f172a; }
      .rf-anchor-link[data-active="true"], .rf-anchor-link[aria-current="location"] { background: #dbeafe; color: #1e3a8a; font-weight: 600; }
      .rf-anchor-link[data-disabled="true"] { opacity: .55; cursor: not-allowed; }
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
      .rf-filter-panel { display: grid; gap: 0.875rem; }
      .rf-filter-panel-description { margin: 0; color: #64748b; font-size: 0.9rem; }
      .rf-filter-panel-fields { display: grid; gap: 0.75rem; }
      .rf-filter-panel-actions { display: flex; gap: 0.5rem; justify-content: flex-end; flex-wrap: wrap; }
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
      .rf-descriptions { border: 1px solid #cbd5e1; border-radius: 0.75rem; background: #fff; }
      .rf-descriptions-header { padding: .75rem .9rem; border-bottom: 1px solid #dbe3ee; display: flex; align-items: center; justify-content: space-between; gap: .6rem; }
      .rf-descriptions-title { margin: 0; font-size: 1rem; }
      .rf-descriptions-extra { color: #64748b; font-size: .85rem; }
      .rf-descriptions-list { margin: 0; padding: .7rem; display: grid; grid-template-columns: repeat(var(--rf-descriptions-columns, 3), minmax(0, 1fr)); gap: 0; }
      .rf-descriptions-item { margin: 0; padding: .55rem .65rem; display: grid; grid-template-columns: minmax(0, 42%) minmax(0, 1fr); gap: .55rem; border-bottom: 1px solid #e2e8f0; }
      .rf-descriptions-item:last-child { border-bottom: 0; }
      .rf-descriptions-label { margin: 0; color: #64748b; font-size: .86rem; }
      .rf-descriptions-content { margin: 0; color: #0f172a; font-size: .9rem; font-weight: 500; min-width: 0; }
      .rf-descriptions[data-layout="vertical"] .rf-descriptions-item { grid-template-columns: minmax(0, 1fr); gap: .25rem; }
      .rf-descriptions[data-size="compact"] .rf-descriptions-item { padding: .4rem .5rem; }
      .rf-descriptions-empty { margin: 0; padding: .85rem .9rem; color: #64748b; }
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
      @media (max-width: 900px) {
        .docs-site-shell .rf-app-shell-body { grid-template-columns: 1fr; }
        .docs-site-shell .rf-app-shell-sidebar { position: static; top: auto; height: auto; border-right: 0; border-bottom: 1px solid #dbe3ee; }
        .docs-site-shell .rf-app-shell-main { padding-top: 1rem; }
      }
    </style>
  </head>
  <body>
    <section class="rf-app-shell docs-site-shell" data-sidebar-state="expanded">
      <header class="rf-app-shell-header">
        <h1 style="margin:0;font-size:1.25rem;">Remix Frame UI Docs</h1>
      </header>
      <div class="rf-app-shell-body">
        <aside class="rf-app-shell-sidebar">
          <nav class="rf-side-nav docs-site-nav" aria-label="Components">
            <h2 class="docs-site-nav-title">Components</h2>
            <ul class="rf-side-nav-list">${nav}</ul>
          </nav>
        </aside>
        <main class="rf-app-shell-main docs-site-content">${docsBody}</main>
      </div>
    </section>
    <script>
      (() => {
        const links = Array.from(document.querySelectorAll(".docs-site-nav .rf-side-nav-link"))
        if (links.length === 0) return

        const update = () => {
          const fallback = links[0]?.getAttribute("href") || ""
          const target = (window.location.hash || fallback).replace(/^#/, "")
          for (const link of links) {
            if (!(link instanceof HTMLAnchorElement)) continue
            const item = link.closest(".rf-side-nav-item")
            const isActive = link.getAttribute("href") === "#" + target
            if (item instanceof HTMLElement) item.dataset.active = isActive ? "true" : "false"
            if (isActive) link.setAttribute("aria-current", "page")
            else link.removeAttribute("aria-current")
          }
        }

        window.addEventListener("hashchange", update)
        update()
      })()
    </script>
    <script type="module" src="./docs-runtime.js"></script>
  </body>
</html>`

await writeFile(path.join(outDir, "index.html"), html)
await writeFile(path.join(outDir, "docs-runtime.js"), await readFile(runtimeSourcePath, "utf8"))
console.log(`Built docs for ${pages.length} components`)
