import metadata from "../../../packages/remix/src/component-metadata.json"
import { applyGeneratedApiSection } from "./component-api-sections.js"
import { demoByComponent } from "./component-demo-registry.js"
import { resolvePlatformLabel } from "./component-doc-maturity.js"
import { requiredSections } from "./component-doc-sections.js"
import { guideOrder } from "./guide-config.js"
import { mountAllDemos } from "./docs-runtime.js"
import { renderMarkdownToHtml } from "./render-markdown.js"

const componentMarkdownModules = import.meta.glob("../content/components/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
})

const guideMarkdownModules = import.meta.glob("../content/guides/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
})

const metadataByName = new Map(metadata.map((entry) => [entry.name.toLowerCase(), entry]))
const maturitySortOrder = { stable: 0, experimental: 1 }
const guideOrderRank = new Map(guideOrder.map((slug, index) => [slug, index]))

bootDocs().catch((error) => {
  console.error(error)
  const app = document.querySelector("#app")
  if (app) {
    app.innerHTML = `<pre style="color:#dc2626;white-space:pre-wrap;">${error instanceof Error ? error.message : "Failed to build docs view"}</pre>`
  }
})

async function bootDocs() {
  const componentPages = (
    await Promise.all(
      Object.entries(componentMarkdownModules).map(async ([file, markdown]) => {
        const name = file.split("/").pop()?.replace(".md", "")
        if (!name) throw new Error(`Unable to parse component name from ${file}`)

        const metadataEntry = metadataByName.get(name)
        if (!metadataEntry) {
          throw new Error(`${name}.md does not have a maturity entry in component metadata`)
        }

        for (const section of requiredSections) {
          if (!markdown.includes(section)) {
            throw new Error(`${name}.md is missing required section: ${section}`)
          }
        }

        const markdownWithApi = applyGeneratedApiSection(name, markdown)
        const html = await renderMarkdownToHtml(markdownWithApi)
        return {
          id: name,
          title: metadataEntry.name,
          html,
          maturity: metadataEntry.maturity,
          platform: resolvePlatformLabel(metadataEntry.platform),
        }
      }),
    )
  ).sort((a, b) => maturitySortOrder[a.maturity] - maturitySortOrder[b.maturity] || a.title.localeCompare(b.title))

  const guidePages = (
    await Promise.all(
      Object.entries(guideMarkdownModules).map(async ([file, markdown]) => {
        const slug = file.split("/").pop()?.replace(".md", "")
        if (!slug) throw new Error(`Unable to parse guide name from ${file}`)

        const html = await renderMarkdownToHtml(markdown)
        return {
          slug,
          id: `guide-${slug}`,
          title: extractMarkdownTitle(markdown, titleFromSlug(slug)),
          html,
        }
      }),
    )
  ).sort((a, b) => {
    const rankA = guideOrderRank.get(a.slug) ?? Number.MAX_SAFE_INTEGER
    const rankB = guideOrderRank.get(b.slug) ?? Number.MAX_SAFE_INTEGER
    return rankA - rankB || a.title.localeCompare(b.title)
  })

  const firstPageId = guidePages[0]?.id ?? componentPages[0]?.id ?? ""

  const guideNav = guidePages
    .map(
      (page) =>
        `<li class="rf-side-nav-item" data-doc-kind="guide" data-active="${page.id === firstPageId ? "true" : "false"}"><a class="rf-side-nav-link" href="#${page.id}" ${page.id === firstPageId ? 'aria-current="page"' : ""}>${page.title}</a></li>`,
    )
    .join("\n")

  const componentNav = componentPages
    .map(
      (page) =>
        `<li class="rf-side-nav-item" data-doc-kind="component" data-maturity="${page.maturity}" data-platform="${page.platform}" data-active="${page.id === firstPageId ? "true" : "false"}"><a class="rf-side-nav-link" href="#${page.id}" ${page.id === firstPageId ? 'aria-current="page"' : ""}>${page.title}</a></li>`,
    )
    .join("\n")

  const navSections = [
    guidePages.length
      ? `<section class="rf-side-nav-section"><h2 class="docs-site-nav-title">Start Here</h2><ul class="rf-side-nav-list">${guideNav}</ul></section>`
      : "",
    componentPages.length
      ? `<section class="rf-side-nav-section"><h2 class="docs-site-nav-title">Components</h2><div class="docs-site-nav-filters"><label class="docs-site-nav-filter"><input type="checkbox" data-docs-stable-only /> Stable only</label><label class="docs-site-nav-filter"><input type="checkbox" data-docs-mobile-only /> Mobile only</label></div><ul class="rf-side-nav-list">${componentNav}</ul></section>`
      : "",
  ]
    .filter(Boolean)
    .join("\n")

  const guideBody = guidePages.map((page) => `<article id="${page.id}">${page.html}</article>`).join("\n")

  const componentBody = componentPages
    .map((page) => {
      const demo = demoByComponent.get(page.id)
      const demoSection = demo
        ? `<section class="demo-block"><h3>${demo.title}</h3><div class="demo-mount" data-demo="${demo.id}"></div></section>`
        : ""

      return `<article id="${page.id}"><p><strong>Maturity:</strong> ${page.maturity} · <strong>Platform:</strong> ${page.platform}</p>${demoSection}${page.html}</article>`
    })
    .join("\n")

  const docsBody = [guideBody, componentBody].filter(Boolean).join("\n")

  const app = document.querySelector("#app")
  if (!app) {
    throw new Error("Missing #app root")
  }

  app.innerHTML = `
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
    .docs-site-nav-filters { display: grid; gap: 0.35rem; }
    .docs-site-nav-filter { display: inline-flex; align-items: center; gap: 0.45rem; font-size: 0.8125rem; color: #475569; }
    .docs-site-nav-filter input { accent-color: #2563eb; }
    .docs-site-content article {
      margin-bottom: 2rem;
      scroll-margin-top: 5.25rem;
    }
    pre { white-space: pre-wrap; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1rem; }
    .demo-block {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 1rem;
      background: #fff;
      display: grid;
      gap: 0.65rem;
    }
    .demo-block h3 { margin: 0; font-size: 1rem; }
    .demo-mount { min-height: 2.25rem; }
    .docs-example-tabs { display: grid; gap: 0.6rem; }
    .docs-example-tablist {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.2rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.65rem;
      background: #f8fafc;
    }
    .docs-example-tab {
      border: 0;
      border-radius: 0.5rem;
      background: transparent;
      color: #334155;
      font: inherit;
      font-size: 0.875rem;
      line-height: 1.2;
      padding: 0.35rem 0.6rem;
      cursor: pointer;
    }
    .docs-example-tab[data-active="true"] {
      background: #fff;
      color: #1e3a8a;
      box-shadow: 0 0 0 1px #cbd5e1;
      font-weight: 600;
    }
    .docs-example-tab:focus-visible {
      outline: 2px solid #1d4ed8;
      outline-offset: 1px;
    }
    .docs-example-panel[hidden] { display: none; }
    .docs-example-panel[data-panel="code"] pre { margin: 0; }
    .docs-button { border-radius: 8px; min-height: 2.5rem; padding: 0 0.875rem; border: 1px solid #cbd5e1; background: #2563eb; color: #fff; cursor: pointer; }
    .docs-button[data-variant="outline"] { background: #fff; color: #0f172a; }
    .docs-button[data-tone="danger"] { background: #dc2626; border-color: #dc2626; color: #fff; }
    .docs-input { border: 1px solid #cbd5e1; border-radius: 8px; min-height: 2.5rem; padding: 0 0.75rem; }
    .rf-input-base {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 2.5rem;
      padding: 0 0.75rem;
      color: #0f172a;
      background: #fff;
      font: inherit;
    }
    .rf-focus-ring:focus-visible {
      outline: 2px solid #1d4ed8;
      outline-offset: 2px;
    }
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
    .rf-date-picker-field { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.45rem; align-items: center; }
    .rf-date-picker-field > .docs-input,
    .rf-date-picker-field > .rf-input-base { min-width: 0; width: 100%; }
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
    .docs-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); display: grid; place-items: center; z-index: 80; }
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
    .rf-space { display: inline-flex; align-items: center; gap: 0.75rem; }
    .rf-space[data-wrap="true"] { flex-wrap: wrap; }
    .rf-divider { border: 0; background: #cbd5e1; flex: none; }
    .rf-divider[data-orientation="horizontal"] { width: 100%; height: 1px; }
    .rf-divider[data-orientation="vertical"] { width: 1px; align-self: stretch; min-height: 1.25rem; }
    .rf-divider[data-inset="true"] { margin-inline: 0.75rem; }
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
    .rf-combobox-option[data-highlighted="true"] { background: #dbeafe; box-shadow: inset 0 0 0 1px #93c5fd; }
    .rf-combobox-option:hover { background: #eef4ff; }
    .rf-image-uploader { width: 100%; max-width: 42rem; }
    .rf-image-uploader-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .rf-image-uploader .rf-image-uploader-list,
    .rf-image-uploader .rf-image-uploader-list > li {
      list-style: none !important;
      margin: 0;
    }
    .rf-image-uploader .rf-image-uploader-list > li::marker { content: ""; }
    .rf-image-uploader-item {
      border: 1px solid #cbd5e1;
      border-radius: 14px;
      background: #fff;
      color: #0f172a;
      padding: 0.5rem;
      display: grid;
      gap: 0.3rem;
      align-content: start;
      min-width: 0;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .rf-image-uploader-thumb {
      margin: 0;
      border-radius: 11px;
      overflow: hidden;
      border: 1px solid #dbe3ee;
      background: #f8fafc;
      aspect-ratio: 4 / 3;
      display: grid;
      place-items: center;
      margin-bottom: 0.08rem;
    }
    .rf-image-uploader-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.2s ease;
    }
    .rf-image-uploader-preview {
      border: 0;
      background: transparent;
      display: block;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      cursor: pointer;
      border-radius: inherit;
      overflow: hidden;
    }
    .rf-image-uploader-preview:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 2px; }
    .rf-image-uploader-preview:hover .rf-image-uploader-image,
    .rf-image-uploader-preview:focus-visible .rf-image-uploader-image { transform: scale(1.02); }
    .rf-image-uploader-empty { font-size: 0.78rem; color: #64748b; }
    .rf-image-uploader-name {
      margin: 0;
      margin-top: 0.03rem;
      font-size: 0.82rem;
      font-weight: 600;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .rf-image-uploader-status {
      margin: 0;
      font-size: 0.7rem;
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: 0.01em;
      color: #475569;
      border: 1px solid #dbe3ee;
      background: #f8fafc;
      border-radius: 999px;
      padding: 0.14rem 0.42rem;
      display: inline-flex;
      justify-self: start;
      margin-top: 0.03rem;
    }
    .rf-image-uploader-item[data-uploading="true"] .rf-image-uploader-status {
      color: #1d4ed8;
      border-color: #93c5fd;
      background: #dbeafe;
    }
    .rf-image-uploader-item[data-error="true"] .rf-image-uploader-status {
      color: #b91c1c;
      border-color: #fca5a5;
      background: #fee2e2;
    }
    .rf-image-uploader-remove {
      border: 1px solid #cbd5e1;
      border-radius: 9px;
      min-height: 1.9rem;
      padding: 0.24rem 0.52rem;
      background: #f8fafc;
      color: #334155;
      font-size: 0.74rem;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      text-align: center;
      justify-self: stretch;
      margin-top: 0.06rem;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }
    .rf-image-uploader-remove[data-variant="danger"] {
      border-color: #fca5a5;
      color: #b91c1c;
    }
    .rf-image-uploader-remove[data-variant="neutral"] {
      border-color: #93c5fd;
      color: #1d4ed8;
    }
    .rf-image-uploader-add-wrap {
      border: 0;
      background: transparent;
      box-shadow: none;
      padding: 0;
      gap: 0;
      align-self: start;
    }
    .rf-image-uploader-add-wrap[data-hidden="true"] { display: none; }
    .rf-image-uploader-add {
      border: 1px dashed #cbd5e1;
      border-radius: 14px;
      min-height: 7rem;
      background: #f8fafc;
      display: grid;
      gap: 0.35rem;
      align-content: start;
      justify-items: start;
      padding: 0.65rem;
      cursor: pointer;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }
    .rf-image-uploader-add[data-disabled="true"] {
      cursor: not-allowed;
      opacity: 0.72;
    }
    .rf-image-uploader-add:not([data-disabled="true"]):hover,
    .rf-image-uploader-add:not([data-disabled="true"]):focus-within {
      border-color: #93c5fd;
      background: #eff6ff;
    }
    .rf-image-uploader-add-icon {
      inline-size: 1.75rem;
      block-size: 1.75rem;
      border-radius: 999px;
      border: 1px solid #93c5fd;
      background: #dbeafe;
      color: #1d4ed8;
      display: grid;
      place-items: center;
      font-size: 1rem;
      font-weight: 700;
    }
    .rf-image-uploader-add-label { font-size: 0.87rem; font-weight: 600; line-height: 1.25; }
    .rf-image-uploader-count { font-size: 0.75rem; color: #64748b; justify-self: start; }
    .rf-image-uploader-input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      position: absolute;
      pointer-events: none;
      margin: -1px;
      padding: 0;
      border: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
      appearance: none;
    }
    @media (min-width: 32rem) {
      .rf-image-uploader-list { grid-template-columns: repeat(2, minmax(10rem, 1fr)); }
    }
    @media (min-width: 48rem) {
      .rf-image-uploader-list { grid-template-columns: repeat(3, minmax(11rem, 1fr)); }
    }
    .rf-image-viewer-portal {
      position: relative;
      z-index: 998;
    }
    .rf-image-viewer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.72);
      display: grid;
      place-items: center;
      padding: 0.75rem;
      backdrop-filter: blur(1.5px);
      z-index: 998;
    }
    .rf-image-viewer-backdrop[hidden] { display: none; }
    .rf-image-viewer {
      width: min(100%, 56rem);
      max-height: calc(100vh - 1.5rem);
      border: 1px solid #cbd5e1;
      border-radius: 14px;
      background: #f8fafc;
      color: #0f172a;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      box-shadow: 0 24px 56px rgba(15, 23, 42, 0.36);
      overflow: hidden;
    }
    .rf-image-viewer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.6rem;
      padding: 0.65rem 0.8rem;
      border-bottom: 1px solid #dbe3ee;
      background: #ffffff;
    }
    .rf-image-viewer-counter {
      margin: 0;
      font-size: 0.84rem;
      line-height: 1.25;
      color: #475569;
      font-weight: 600;
    }
    .rf-image-viewer-close {
      border: 1px solid #cbd5e1;
      border-radius: 9px;
      min-height: 2.05rem;
      padding: 0.3rem 0.65rem;
      background: #fff;
      color: #0f172a;
      font-size: 0.82rem;
      cursor: pointer;
      font-weight: 600;
    }
    .rf-image-viewer-stage {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 0.65rem;
      min-height: 0;
      padding: 0.75rem;
    }
    .rf-image-viewer-nav {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      min-width: 3.1rem;
      min-height: 2.5rem;
      padding: 0.35rem 0.55rem;
      background: #fff;
      color: #0f172a;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 600;
    }
    .rf-image-viewer-nav:disabled {
      cursor: not-allowed;
      color: #94a3b8;
      border-color: #dbe3ee;
      background: #f8fafc;
    }
    .rf-image-viewer-frame {
      margin: 0;
      min-height: 0;
      width: 100%;
      display: grid;
      place-items: center;
      border: 1px solid #dbe3ee;
      border-radius: 12px;
      background: #0f172a;
      overflow: hidden;
    }
    .rf-image-viewer-image {
      width: 100%;
      max-height: calc(100vh - 10rem);
      object-fit: contain;
      display: block;
      background: rgba(248, 250, 252, 0.2);
      touch-action: pan-y;
    }
    .rf-image-viewer-empty {
      margin: 0;
      padding: 2rem 1rem;
      font-size: 0.9rem;
      color: #cbd5e1;
      text-align: center;
    }
    @media (max-width: 40rem) {
      .rf-image-viewer-stage {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr) auto;
      }
      .rf-image-viewer-frame {
        grid-column: 1 / -1;
      }
      .rf-image-viewer-nav[data-direction="prev"] {
        justify-self: start;
      }
      .rf-image-viewer-nav[data-direction="next"] {
        justify-self: end;
      }
    }
    .rf-avatar {
      --rf-avatar-status-size: 0.56rem;
      --rf-avatar-status-offset: 0.12rem;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      background: #fff;
      color: #0f172a;
      font-weight: 700;
      line-height: 1;
      border-radius: 999px;
    }
    .rf-avatar[data-shape="square"] { border-radius: 0.55rem; }
    .rf-avatar[data-size="sm"] { width: 1.75rem; height: 1.75rem; font-size: 0.7rem; --rf-avatar-status-size: 0.48rem; --rf-avatar-status-offset: 0.08rem; }
    .rf-avatar[data-size="md"] { width: 2.25rem; height: 2.25rem; font-size: 0.8rem; --rf-avatar-status-size: 0.56rem; --rf-avatar-status-offset: 0.12rem; }
    .rf-avatar[data-size="lg"] { width: 2.75rem; height: 2.75rem; font-size: 0.95rem; --rf-avatar-status-size: 0.64rem; --rf-avatar-status-offset: 0.16rem; }
    .rf-avatar-fallback { width: 100%; height: 100%; display: inline-flex; align-items: center; justify-content: center; }
    .rf-avatar[data-status]::after {
      content: "";
      position: absolute;
      right: var(--rf-avatar-status-offset);
      bottom: var(--rf-avatar-status-offset);
      width: var(--rf-avatar-status-size);
      height: var(--rf-avatar-status-size);
      border: 2px solid #fff;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.35);
    }
    .rf-avatar[data-status="online"]::after { background: #2563eb; }
    .rf-avatar[data-status="busy"]::after { background: #dc2626; }
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
    .rf-command-item[data-highlighted="true"] { background: #eef4ff; }
    .rf-command-item:hover { background: #eef4ff; }
    .rf-command-empty { padding: 0.55rem 0.65rem; color: #64748b; }
    .rf-collapse {
      width: min(100%, 40rem);
      border: 1px solid #cbd5e1;
      border-radius: 0.65rem;
      background: #ffffff;
      transition: border-color 140ms ease, box-shadow 140ms ease;
    }
    .rf-collapse + .rf-collapse { margin-top: 0.6rem; }
    .rf-collapse-trigger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 0.75rem;
      cursor: pointer;
      font-weight: 600;
      list-style: none;
      border-radius: 0.65rem;
    }
    .rf-collapse-trigger::-webkit-details-marker { display: none; }
    .rf-collapse-trigger::before {
      content: "▸";
      color: #64748b;
      transform-origin: center;
      transition: transform 140ms ease;
    }
    .rf-collapse[open] .rf-collapse-trigger::before { transform: rotate(90deg); }
    .rf-collapse-trigger:hover { background: #f8fafc; }
    .rf-collapse-trigger:focus-visible {
      outline: 2px solid #1d4ed8;
      outline-offset: 2px;
    }
    .rf-collapse[open] {
      border-color: #cbd5e1;
    }
    .rf-collapse-content {
      padding: 0.65rem 0.75rem 0.75rem;
      color: #334155;
      border-top: 1px solid #e2e8f0;
      margin-top: 0.1rem;
    }
    @media (max-width: 900px) {
      .docs-site-shell .rf-app-shell-body { grid-template-columns: 1fr; }
      .docs-site-shell .rf-app-shell-sidebar { position: static; top: auto; height: auto; border-right: 0; border-bottom: 1px solid #dbe3ee; }
      .docs-site-shell .rf-app-shell-main { padding-top: 1rem; }
    }
  </style>
  <section class="rf-app-shell docs-site-shell" data-sidebar-state="expanded">
    <header class="rf-app-shell-header">
      <h1 style="margin:0;font-size:1.25rem;">Remix Frame UI Docs (Dev)</h1>
    </header>
    <div class="rf-app-shell-body">
      <aside class="rf-app-shell-sidebar">
        <nav class="rf-side-nav docs-site-nav" aria-label="Documentation">${navSections}</nav>
      </aside>
      <main class="rf-app-shell-main docs-site-content">${docsBody}</main>
    </div>
  </section>
`

  await mountAllDemos(document)
  setupDocsSideNav()
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function extractMarkdownTitle(markdown, fallback) {
  const match = /^#\s+(.+)$/m.exec(markdown)
  return match?.[1]?.trim() || fallback
}

function setupDocsSideNav() {
  const links = Array.from(document.querySelectorAll(".docs-site-nav .rf-side-nav-link"))
  if (links.length === 0) return

  const stableOnlyToggle = document.querySelector("[data-docs-stable-only]")
  const mobileOnlyToggle = document.querySelector("[data-docs-mobile-only]")
  const componentItems = Array.from(
    document.querySelectorAll(".docs-site-nav .rf-side-nav-item[data-doc-kind='component']"),
  )

  const getVisibleLinks = () =>
    links.filter((link) => {
      if (!(link instanceof HTMLAnchorElement)) return false
      const item = link.closest(".rf-side-nav-item")
      return !(item instanceof HTMLElement && item.hidden)
    })

  const applyComponentFilter = () => {
    const stableOnly = stableOnlyToggle instanceof HTMLInputElement ? stableOnlyToggle.checked : false
    const mobileOnly = mobileOnlyToggle instanceof HTMLInputElement ? mobileOnlyToggle.checked : false
    for (const item of componentItems) {
      if (!(item instanceof HTMLElement)) continue
      const maturity = item.dataset.maturity
      const platform = item.dataset.platform ?? "universal"
      item.hidden = (stableOnly && maturity !== "stable") || (mobileOnly && platform !== "mobile")
    }
  }

  const update = () => {
    const visibleLinks = getVisibleLinks()
    if (visibleLinks.length === 0) return

    const fallback = visibleLinks[0]?.getAttribute("href") || ""
    const requested = window.location.hash || fallback
    const activeHref = visibleLinks.some((link) => link.getAttribute("href") === requested) ? requested : fallback

    if (activeHref && window.location.hash !== activeHref) {
      history.replaceState(null, "", activeHref)
    }

    for (const link of links) {
      if (!(link instanceof HTMLAnchorElement)) continue
      const item = link.closest(".rf-side-nav-item")
      const visible = !(item instanceof HTMLElement && item.hidden)
      const isActive = visible && link.getAttribute("href") === activeHref
      if (item instanceof HTMLElement) item.dataset.active = isActive ? "true" : "false"
      if (isActive) link.setAttribute("aria-current", "page")
      else link.removeAttribute("aria-current")
    }
  }

  for (const toggle of [stableOnlyToggle, mobileOnlyToggle]) {
    if (!(toggle instanceof HTMLInputElement)) continue
    toggle.addEventListener("change", () => {
      applyComponentFilter()
      update()
    })
  }

  window.addEventListener("hashchange", update)
  applyComponentFilter()
  update()
}
