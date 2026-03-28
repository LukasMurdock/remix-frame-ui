const registry = {
  "alert-basic": mountAlertDemo,
  "anchor-basic": mountAnchorDemo,
  "anchor-controlled": mountAnchorControlledDemo,
  "app-header-basic": mountAppHeaderDemo,
  "app-provider-basic": mountAppProviderDemo,
  "avatar-basic": mountAvatarDemo,
  "app-shell-basic": mountAppShellDemo,
  "autocomplete-basic": mountAutocompleteDemo,
  "badge-basic": mountBadgeDemo,
  "breadcrumbs-overflow-basic": mountBreadcrumbOverflowDemo,
  "breadcrumbs-basic": mountBreadcrumbsDemo,
  "button-basic": mountButtonDemo,
  "calendar-basic": mountCalendarDemo,
  "cascader-basic": mountCascaderDemo,
  "card-basic": mountCardDemo,
  "chip-basic": mountChipDemo,
  "combobox-basic": mountComboboxDemo,
  "confirm-dialog-basic": mountConfirmDialogDemo,
  "command-palette-basic": mountCommandPaletteDemo,
  "collapse-basic": mountCollapseDemo,
  "config-provider-basic": mountConfigProviderDemo,
  "data-grid-lite-basic": mountDataGridLiteDemo,
  "data-list-basic": mountDataListDemo,
  "descriptions-basic": mountDescriptionsDemo,
  "divider-basic": mountDividerDemo,
  "data-table-basic": mountDataTableDemo,
  "date-picker-basic": mountDatePickerDemo,
  "date-time-picker-basic": mountDateTimePickerDemo,
  "date-range-picker-basic": mountDateRangePickerDemo,
  "dropdown-basic": mountDropdownDemo,
  "empty-basic": mountEmptyDemo,
  "empty-state-basic": mountEmptyStateDemo,
  "empty-results-basic": mountEmptyResultsDemo,
  "file-upload-basic": mountFileUploadDemo,
  "field-basic": mountFieldStructureDemo,
  "form-fieldset-basic": mountFormFieldsetDemo,
  "form-basic": mountFormDemo,
  "form-layout-basic": mountFormLayoutDemo,
  "form-message-basic": mountFormMessageDemo,
  "flex-basic": mountFlexDemo,
  "grid-basic": mountGridDemo,
  "field-input": mountFieldDemo,
  "checkbox-basic": mountCheckboxDemo,
  "filter-bar-basic": mountFilterBarDemo,
  "filter-panel-basic": mountFilterPanelDemo,
  "inline-alert-basic": mountInlineAlertDemo,
  "image-basic": mountImageDemo,
  "radio-group": mountRadioDemo,
  "range-slider-basic": mountRangeSliderDemo,
  "result-basic": mountResultDemo,
  "segmented-basic": mountSegmentedDemo,
  "page-header-basic": mountPageHeaderDemo,
  "popover-basic": mountPopoverDemo,
  "progress-basic": mountProgressDemo,
  "select-basic": mountSelectDemo,
  "side-nav-basic": mountSideNavDemo,
  "top-nav-basic": mountTopNavDemo,
  "layout-basic": mountLayoutDemo,
  "link-basic": mountLinkDemo,
  "splitter-basic": mountSplitterDemo,
  "skeleton-basic": mountSkeletonDemo,
  "slider-basic": mountSliderDemo,
  "spinner-basic": mountSpinnerDemo,
  "space-basic": mountSpaceDemo,
  "statistic-basic": mountStatisticDemo,
  "steps-basic": mountStepsDemo,
  "switch-basic": mountSwitchDemo,
  "table-basic": mountTableDemo,
  "tag-basic": mountTagDemo,
  "tabs-basic": mountTabsDemo,
  "textarea-basic": mountTextareaDemo,
  "transfer-basic": mountTransferDemo,
  "time-picker-basic": mountTimePickerDemo,
  "timeline-basic": mountTimelineDemo,
  "drawer-basic": mountDrawerDemo,
  "dialog-controlled": mountDialogDemo,
  "menu-actions": mountMenuDemo,
  "number-input-basic": mountNumberInputDemo,
  "pagination-basic": mountPaginationDemo,
  "toast-queue": mountToastDemo,
  "tooltip-basic": mountTooltipDemo,
  "typography-basic": mountTypographyDemo,
  "tree-basic": mountTreeDemo,
  "tree-select-basic": mountTreeSelectDemo,
}

export function mountAllDemos(root = document) {
  for (const mount of root.querySelectorAll("[data-demo]")) {
    if (!(mount instanceof HTMLElement)) continue
    if (mount.dataset.demoMounted === "true") continue

    const id = mount.dataset.demo
    if (!id) continue
    const run = registry[id]
    if (!run) continue

    mount.dataset.demoMounted = "true"
    run(mount)
  }

  mountExampleTabs(root)
}

let exampleTabsId = 0

function mountExampleTabs(root = document) {
  if (!root || typeof root.querySelectorAll !== "function") return

  for (const article of root.querySelectorAll("article")) {
    if (!(article instanceof HTMLElement)) continue

    const directChildren = Array.from(article.children)
    const demoBlock = directChildren.find(
      (child) => child instanceof HTMLElement && child.classList.contains("demo-block"),
    )
    if (!(demoBlock instanceof HTMLElement)) continue
    if (demoBlock.dataset.exampleTabsMounted === "true") continue

    const exampleHeading = directChildren.find(
      (child) =>
        child instanceof HTMLHeadingElement &&
        child.tagName === "H2" &&
        (child.textContent ?? "").trim().toLowerCase() === "example",
    )
    if (!(exampleHeading instanceof HTMLHeadingElement)) continue

    const headingIndex = directChildren.indexOf(exampleHeading)
    if (headingIndex < 0) continue

    const exampleNodes = []
    for (let index = headingIndex + 1; index < directChildren.length; index += 1) {
      const child = directChildren[index]
      if (child instanceof HTMLHeadingElement && child.tagName === "H2") break
      exampleNodes.push(child)
    }

    const demoMount = demoBlock.querySelector(".demo-mount")
    if (!(demoMount instanceof HTMLElement)) continue

    exampleTabsId += 1
    const baseId = `docs-example-tabs-${exampleTabsId}`

    const tabs = document.createElement("section")
    tabs.className = "docs-example-tabs"

    const tabList = document.createElement("div")
    tabList.className = "docs-example-tablist"
    tabList.setAttribute("role", "tablist")
    tabList.setAttribute("aria-label", "Example view")

    const previewTab = document.createElement("button")
    previewTab.type = "button"
    previewTab.className = "docs-example-tab"
    previewTab.id = `${baseId}-tab-preview`
    previewTab.setAttribute("role", "tab")
    previewTab.setAttribute("aria-controls", `${baseId}-panel-preview`)
    previewTab.textContent = "Preview"

    const codeTab = document.createElement("button")
    codeTab.type = "button"
    codeTab.className = "docs-example-tab"
    codeTab.id = `${baseId}-tab-code`
    codeTab.setAttribute("role", "tab")
    codeTab.setAttribute("aria-controls", `${baseId}-panel-code`)
    codeTab.textContent = "Code"

    const previewPanel = document.createElement("div")
    previewPanel.className = "docs-example-panel"
    previewPanel.dataset.panel = "preview"
    previewPanel.id = `${baseId}-panel-preview`
    previewPanel.setAttribute("role", "tabpanel")
    previewPanel.setAttribute("aria-labelledby", previewTab.id)
    previewPanel.appendChild(demoMount)

    const codePanel = document.createElement("div")
    codePanel.className = "docs-example-panel"
    codePanel.dataset.panel = "code"
    codePanel.id = `${baseId}-panel-code`
    codePanel.setAttribute("role", "tabpanel")
    codePanel.setAttribute("aria-labelledby", codeTab.id)
    const codeBlock = createCodeBlock(formatPreviewMarkup(demoMount.innerHTML))
    const codeElement = codeBlock.querySelector("code")
    const syncCodeFromPreview = () => {
      if (codeElement instanceof HTMLElement) {
        codeElement.textContent = formatPreviewMarkup(demoMount.innerHTML)
      }
    }

    codePanel.appendChild(codeBlock)

    const tabsInOrder = [previewTab, codeTab]
    const panelByTab = new Map([
      [previewTab, previewPanel],
      [codeTab, codePanel],
    ])

    const activateTab = (nextTab, shouldFocus = false) => {
      for (const tab of tabsInOrder) {
        const active = tab === nextTab
        tab.setAttribute("aria-selected", active ? "true" : "false")
        tab.dataset.active = active ? "true" : "false"
        tab.tabIndex = active ? 0 : -1

        const panel = panelByTab.get(tab)
        if (panel instanceof HTMLElement) {
          panel.hidden = !active
        }

        if (active && tab === codeTab) {
          syncCodeFromPreview()
        }
      }

      if (shouldFocus) nextTab.focus()
    }

    for (const tab of tabsInOrder) {
      tab.addEventListener("click", () => {
        activateTab(tab)
      })
    }

    tabList.addEventListener("keydown", (event) => {
      const target = event.target
      if (!(target instanceof HTMLButtonElement)) return

      const index = tabsInOrder.indexOf(target)
      if (index < 0) return

      let nextIndex = index
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabsInOrder.length
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabsInOrder.length) % tabsInOrder.length
      } else if (event.key === "Home") {
        nextIndex = 0
      } else if (event.key === "End") {
        nextIndex = tabsInOrder.length - 1
      } else {
        return
      }

      event.preventDefault()
      activateTab(tabsInOrder[nextIndex], true)
    })

    tabList.append(previewTab, codeTab)
    tabs.append(tabList, previewPanel, codePanel)
    demoBlock.appendChild(tabs)

    for (const node of exampleNodes) {
      node.remove()
    }
    exampleHeading.remove()
    activateTab(previewTab)

    demoBlock.dataset.exampleTabsMounted = "true"
  }
}

function createCodeBlock(markup) {
  const pre = document.createElement("pre")
  const code = document.createElement("code")
  code.className = "language-html"
  code.textContent = markup
  pre.appendChild(code)
  return pre
}

function formatPreviewMarkup(markup) {
  const lines = String(markup).replace(/\r\n/g, "\n").split("\n")

  while (lines.length > 0 && lines[0].trim() === "") lines.shift()
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop()

  if (lines.length === 0) {
    return "<!-- No preview markup available -->"
  }

  let minIndent = Number.POSITIVE_INFINITY
  for (const line of lines) {
    if (line.trim() === "") continue
    const indent = /^\s*/.exec(line)?.[0].length ?? 0
    minIndent = Math.min(minIndent, indent)
  }

  if (!Number.isFinite(minIndent)) minIndent = 0
  return lines.map((line) => line.slice(minIndent)).join("\n")
}

export function parseDatePickerISODate(value) {
  if (!value) return undefined
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined
  }

  return date
}

export function formatDatePickerISODate(date) {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function monthStartDatePicker(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addDatePickerDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function addDatePickerMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

export function buildDatePickerMonthCells(viewMonth) {
  const first = monthStartDatePicker(viewMonth)
  const startOffset = first.getDay()
  const start = addDatePickerDays(first, -startOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDatePickerDays(start, index)
    return {
      iso: formatDatePickerISODate(date),
      day: date.getDate(),
      inMonth: date.getMonth() === viewMonth.getMonth() && date.getFullYear() === viewMonth.getFullYear(),
    }
  })
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mountAllDemos(document), { once: true })
  } else {
    mountAllDemos(document)
  }
}

function mountButtonDemo(mount) {
  let count = 0
  mount.innerHTML = `
    <button class="docs-button" type="button">Clicked 0 times</button>
  `
  const button = mount.querySelector("button")
  if (!button) return
  button.addEventListener("click", () => {
    count += 1
    button.textContent = `Clicked ${count} ${count === 1 ? "time" : "times"}`
  })
}

function mountAlertDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.5rem;max-width:28rem;">
      <section class="rf-alert" data-tone="info" role="status">
        <div class="rf-alert-body">
          <h3 class="rf-alert-title">Heads up</h3>
          <div>Two-factor authentication is available for this account.</div>
        </div>
        <button class="rf-alert-dismiss rf-focus-ring" type="button" aria-label="Dismiss alert">×</button>
      </section>
    </div>
  `

  const dismiss = mount.querySelector(".rf-alert-dismiss")
  const alert = mount.querySelector(".rf-alert")
  if (!(dismiss instanceof HTMLButtonElement && alert instanceof HTMLElement)) return
  dismiss.addEventListener("click", () => {
    alert.remove()
  })
}

function mountAnchorDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.5rem;max-width:18rem;">
      <nav class="rf-anchor" aria-label="Section navigation">
        <ul class="rf-anchor-list">
          <li class="rf-anchor-item"><a class="rf-anchor-link" data-active="true" data-value="#overview" href="#overview" aria-current="location">Overview</a></li>
          <li class="rf-anchor-item"><a class="rf-anchor-link" data-active="false" data-value="#api" href="#api">API</a></li>
          <li class="rf-anchor-item"><a class="rf-anchor-link" data-active="false" data-value="#faq" href="#faq">FAQ</a></li>
          <li class="rf-anchor-item"><span class="rf-anchor-link" data-active="false" data-disabled="true">Legacy (disabled)</span></li>
        </ul>
      </nav>
      <p id="anchor-state" style="margin:0;font-size:.85rem;color:#475569;">Active: #overview</p>
    </div>
  `

  const links = Array.from(mount.querySelectorAll(".rf-anchor-link[data-value]"))
  const state = mount.querySelector("#anchor-state")
  if (!(state instanceof HTMLElement)) return

  const setActive = (href) => {
    let resolved = href
    const exists = links.some((link) => link instanceof HTMLAnchorElement && link.getAttribute("href") === href)
    if (!exists) {
      resolved = "#overview"
    }

    for (const link of links) {
      if (!(link instanceof HTMLAnchorElement)) continue
      const active = link.getAttribute("href") === resolved
      link.dataset.active = active ? "true" : "false"
      if (active) {
        link.setAttribute("aria-current", "location")
      } else {
        link.removeAttribute("aria-current")
      }
    }

    state.textContent = `Active: ${resolved}`
  }

  for (const link of links) {
    if (!(link instanceof HTMLAnchorElement)) continue
    link.addEventListener("click", (event) => {
      event.preventDefault()
      const href = link.getAttribute("href")
      if (!href) return
      setActive(href)
      history.replaceState(null, "", href)
    })
  }

  window.addEventListener("hashchange", () => {
    const next = window.location.hash || "#overview"
    setActive(next)
  })

  const initial = window.location.hash || "#overview"
  setActive(initial)
}

function mountAnchorControlledDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.5rem;max-width:18rem;">
      <nav class="rf-anchor" aria-label="Controlled section navigation">
        <ul class="rf-anchor-list">
          <li class="rf-anchor-item"><a class="rf-anchor-link" data-value="#overview" href="#overview">Overview</a></li>
          <li class="rf-anchor-item"><a class="rf-anchor-link" data-value="#api" href="#api">API</a></li>
          <li class="rf-anchor-item"><a class="rf-anchor-link" data-value="#faq" href="#faq">FAQ</a></li>
        </ul>
      </nav>
      <p id="anchor-controlled-state" style="margin:0;font-size:.85rem;color:#475569;">onActiveHrefChange: #overview</p>
    </div>
  `

  const links = Array.from(mount.querySelectorAll(".rf-anchor-link[data-value]"))
  const state = mount.querySelector("#anchor-controlled-state")
  if (!(state instanceof HTMLElement)) return

  let activeHref = "#overview"
  const onActiveHrefChange = (href) => {
    activeHref = href
    render()
  }

  const render = () => {
    for (const link of links) {
      if (!(link instanceof HTMLAnchorElement)) continue
      const href = link.getAttribute("href")
      const active = href === activeHref
      link.dataset.active = active ? "true" : "false"
      if (active) {
        link.setAttribute("aria-current", "location")
      } else {
        link.removeAttribute("aria-current")
      }
    }

    state.textContent = `onActiveHrefChange: ${activeHref}`
  }

  const setFromHash = () => {
    const hash = window.location.hash
    if (!hash) return
    const exists = links.some((link) => link instanceof HTMLAnchorElement && link.getAttribute("href") === hash)
    if (!exists) return
    if (hash === activeHref) return
    onActiveHrefChange(hash)
  }

  for (const link of links) {
    if (!(link instanceof HTMLAnchorElement)) continue
    link.addEventListener("click", (event) => {
      event.preventDefault()
      const href = link.getAttribute("href")
      if (!href || href === activeHref) return
      onActiveHrefChange(href)
      history.replaceState(null, "", href)
    })
  }

  window.addEventListener("hashchange", setFromHash)
  render()
  setFromHash()
}

function mountAppHeaderDemo(mount) {
  mount.innerHTML = `
    <header class="rf-app-header" data-density="comfortable">
      <div class="rf-app-header-top">
        <div class="rf-app-header-branding">
          <div class="rf-app-header-brand">RF</div>
          <div class="rf-app-header-text">
            <h1 class="rf-app-header-title">Workspace</h1>
            <p class="rf-app-header-subtitle">Project dashboard</p>
          </div>
        </div>
        <div class="rf-app-header-right">
          <div class="rf-app-header-actions">
            <button class="docs-button" data-variant="outline" type="button">Search</button>
            <button class="docs-button" type="button">New project</button>
          </div>
          <div class="rf-app-header-account">
            <button class="docs-button" data-variant="outline" type="button">LM</button>
          </div>
        </div>
      </div>
      <nav class="rf-app-header-nav" aria-label="Primary">
        <a href="#overview">Overview</a>
        <a href="#deployments">Deployments</a>
        <a href="#settings">Settings</a>
      </nav>
    </header>
  `
}

function mountAppProviderDemo(mount) {
  mount.innerHTML = `
    <section class="rf-app-provider" lang="en-US" dir="ltr" data-color-scheme="light" data-reduced-motion="no-preference" style="display:grid;gap:.6rem;max-width:34rem;">
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;">
        <label style="display:grid;gap:.2rem;font-size:.85rem;">
          Locale
          <input class="docs-input" id="app-provider-locale" value="en-US" />
        </label>
        <label style="display:grid;gap:.2rem;font-size:.85rem;">
          Direction
          <select class="docs-input" id="app-provider-direction"><option value="ltr">ltr</option><option value="rtl">rtl</option></select>
        </label>
      </div>
      <nav style="display:flex;gap:.5rem;flex-wrap:wrap;">
        <a href="/projects" id="app-provider-internal">Internal link</a>
        <a href="https://example.com" id="app-provider-external">External link</a>
      </nav>
      <p id="app-provider-status" style="margin:0;color:#475569;font-size:.85rem;">Navigate: none</p>
    </section>
  `

  const provider = mount.querySelector(".rf-app-provider")
  const locale = mount.querySelector("#app-provider-locale")
  const direction = mount.querySelector("#app-provider-direction")
  const status = mount.querySelector("#app-provider-status")

  if (
    !(
      provider instanceof HTMLElement &&
      locale instanceof HTMLInputElement &&
      direction instanceof HTMLSelectElement &&
      status instanceof HTMLElement
    )
  ) {
    return
  }

  locale.addEventListener("input", () => {
    provider.lang = locale.value.trim() || "en-US"
  })

  direction.addEventListener("change", () => {
    provider.dir = direction.value === "rtl" ? "rtl" : "ltr"
  })

  provider.addEventListener("click", (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const anchor = target.closest("a[href]")
    if (!(anchor instanceof HTMLAnchorElement)) return

    const href = anchor.getAttribute("href")
    if (!href) return
    if (!href.startsWith("/")) return

    event.preventDefault()
    status.textContent = `Navigate: ${href}`
  })
}

function mountAppShellDemo(mount) {
  mount.innerHTML = `
    <section class="rf-app-shell" data-sidebar-state="expanded">
      <header class="rf-app-shell-header" style="display:flex;justify-content:space-between;align-items:center;gap:.5rem;">
        <strong>Workspace</strong>
        <button class="docs-button" data-variant="outline" type="button" id="toggle-app-shell-sidebar">Toggle sidebar</button>
      </header>
      <div class="rf-app-shell-body">
        <aside class="rf-app-shell-sidebar">
          <nav style="display:grid;gap:.35rem;">
            <a href="#overview">Overview</a>
            <a href="#projects">Projects</a>
            <a href="#settings">Settings</a>
          </nav>
        </aside>
        <main class="rf-app-shell-main">
          <h4 style="margin:0 0 .35rem;">Main content</h4>
          <p style="margin:0;color:#475569;">Compose your pages with stable header/sidebar/content regions.</p>
        </main>
      </div>
    </section>
  `

  const shell = mount.querySelector(".rf-app-shell")
  const sidebar = mount.querySelector(".rf-app-shell-sidebar")
  const toggle = mount.querySelector("#toggle-app-shell-sidebar")
  if (!(shell instanceof HTMLElement && sidebar instanceof HTMLElement && toggle instanceof HTMLButtonElement)) return

  const sync = () => {
    sidebar.hidden = shell.dataset.sidebarState === "collapsed"
  }

  toggle.addEventListener("click", () => {
    const collapsed = shell.dataset.sidebarState === "collapsed"
    shell.dataset.sidebarState = collapsed ? "expanded" : "collapsed"
    sync()
  })

  sync()
}

function mountSideNavDemo(mount) {
  mount.innerHTML = `
    <nav class="rf-side-nav" aria-label="Side navigation">
      <section class="rf-side-nav-section">
        <h3 class="rf-side-nav-heading">General</h3>
        <ul class="rf-side-nav-list">
          <li class="rf-side-nav-item" data-active="true"><a class="rf-side-nav-link" href="#overview" aria-current="page">Overview</a></li>
          <li class="rf-side-nav-item" data-active="false"><a class="rf-side-nav-link" href="#projects">Projects</a></li>
          <li class="rf-side-nav-item" data-active="false">
            <a class="rf-side-nav-link" href="#settings">Settings</a>
            <ul class="rf-side-nav-sublist">
              <li class="rf-side-nav-item" data-active="false"><a class="rf-side-nav-link" href="#members">Members</a></li>
              <li class="rf-side-nav-item" data-active="false"><a class="rf-side-nav-link" href="#security">Security</a></li>
            </ul>
          </li>
        </ul>
      </section>
    </nav>
    <p id="side-nav-state" style="margin:.5rem 0 0;font-size:.85rem;color:#475569;">Current route: Overview</p>
  `

  const state = mount.querySelector("#side-nav-state")
  const links = Array.from(mount.querySelectorAll(".rf-side-nav-link"))
  if (!(state instanceof HTMLElement)) return

  const activate = (nextLink) => {
    for (const link of links) {
      if (!(link instanceof HTMLAnchorElement)) continue
      const active = link === nextLink
      const item = link.closest(".rf-side-nav-item")
      if (item instanceof HTMLElement) item.dataset.active = active ? "true" : "false"
      if (active) link.setAttribute("aria-current", "page")
      else link.removeAttribute("aria-current")
    }
    state.textContent = `Current route: ${nextLink.textContent ?? "Unknown"}`
  }

  for (const link of links) {
    if (!(link instanceof HTMLAnchorElement)) continue
    link.addEventListener("click", (event) => {
      event.preventDefault()
      activate(link)
    })
  }
}

function mountTopNavDemo(mount) {
  mount.innerHTML = `
    <nav class="rf-top-nav" aria-label="Top navigation" style="max-width:42rem;">
      <ul class="rf-top-nav-list">
        <li class="rf-top-nav-item" data-active="true"><a class="rf-top-nav-link" href="#overview" aria-current="page">Overview</a></li>
        <li class="rf-top-nav-item" data-active="false"><a class="rf-top-nav-link" href="#deployments">Deployments</a></li>
        <li class="rf-top-nav-item" data-active="false"><a class="rf-top-nav-link" href="#incidents">Incidents</a></li>
        <li class="rf-top-nav-item" data-active="false"><a class="rf-top-nav-link" href="#settings">Settings</a></li>
        <li class="rf-top-nav-item" data-active="false"><span class="rf-top-nav-link" data-disabled="true">Billing</span></li>
      </ul>
    </nav>
    <p id="top-nav-state" style="margin:.55rem 0 0;font-size:.85rem;color:#475569;">Current route: Overview</p>
  `

  const state = mount.querySelector("#top-nav-state")
  const links = Array.from(mount.querySelectorAll(".rf-top-nav-link"))
  if (!(state instanceof HTMLElement)) return

  const activate = (nextLink) => {
    for (const link of links) {
      if (!(link instanceof HTMLAnchorElement)) continue
      const active = link === nextLink
      const item = link.closest(".rf-top-nav-item")
      if (item instanceof HTMLElement) item.dataset.active = active ? "true" : "false"
      if (active) link.setAttribute("aria-current", "page")
      else link.removeAttribute("aria-current")
    }
    state.textContent = `Current route: ${nextLink.textContent ?? "Unknown"}`
  }

  for (const link of links) {
    if (!(link instanceof HTMLAnchorElement)) continue
    link.addEventListener("click", (event) => {
      event.preventDefault()
      activate(link)
    })
  }
}

function mountTreeDemo(mount) {
  mount.innerHTML = `
    <ul class="rf-tree" role="tree" aria-label="Project tree">
      <li class="rf-tree-item" role="treeitem" aria-expanded="true" data-selected="true" data-node-id="projects">
        <div class="rf-tree-row">
          <button class="rf-tree-toggle" type="button" data-toggle="projects" aria-label="Collapse">▾</button>
          <button class="rf-tree-label" type="button" data-select="projects">Projects</button>
        </div>
        <ul class="rf-tree-group" role="group" data-group="projects">
          <li class="rf-tree-item" role="treeitem" data-selected="false" data-node-id="alpha">
            <div class="rf-tree-row">
              <span class="rf-tree-spacer" aria-hidden="true"></span>
              <button class="rf-tree-label" type="button" data-select="alpha">Alpha</button>
            </div>
          </li>
          <li class="rf-tree-item" role="treeitem" data-selected="false" data-node-id="beta">
            <div class="rf-tree-row">
              <span class="rf-tree-spacer" aria-hidden="true"></span>
              <button class="rf-tree-label" type="button" data-select="beta">Beta</button>
            </div>
          </li>
        </ul>
      </li>
      <li class="rf-tree-item" role="treeitem" data-selected="false" data-node-id="settings">
        <div class="rf-tree-row">
          <span class="rf-tree-spacer" aria-hidden="true"></span>
          <button class="rf-tree-label" type="button" data-select="settings">Settings</button>
        </div>
      </li>
    </ul>
    <p id="tree-state" style="margin:.5rem 0 0;font-size:.85rem;color:#475569;">Selected: projects</p>
  `

  const state = mount.querySelector("#tree-state")
  if (!(state instanceof HTMLElement)) return

  const items = Array.from(mount.querySelectorAll(".rf-tree-item"))
  const selectButtons = Array.from(mount.querySelectorAll("[data-select]"))
  const toggleButtons = Array.from(mount.querySelectorAll("[data-toggle]"))

  for (const button of selectButtons) {
    if (!(button instanceof HTMLButtonElement)) continue
    button.addEventListener("click", () => {
      const id = button.dataset.select
      if (!id) return

      for (const item of items) {
        if (!(item instanceof HTMLElement)) continue
        const selected = item.dataset.nodeId === id
        item.dataset.selected = selected ? "true" : "false"
        item.setAttribute("aria-selected", selected ? "true" : "false")
      }

      state.textContent = `Selected: ${id}`
    })
  }

  for (const button of toggleButtons) {
    if (!(button instanceof HTMLButtonElement)) continue
    button.addEventListener("click", () => {
      const id = button.dataset.toggle
      if (!id) return

      const group = mount.querySelector(`[data-group="${id}"]`)
      const item = mount.querySelector(`[data-node-id="${id}"]`)
      if (!(group instanceof HTMLElement && item instanceof HTMLElement)) return

      const expanded = item.getAttribute("aria-expanded") !== "false"
      item.setAttribute("aria-expanded", expanded ? "false" : "true")
      group.hidden = expanded
      group.style.display = expanded ? "none" : "grid"
      button.textContent = expanded ? "▸" : "▾"
      button.setAttribute("aria-label", expanded ? "Expand" : "Collapse")
    })
  }
}

function mountTreeSelectDemo(mount) {
  mount.innerHTML = `
    <section class="rf-tree-select" data-open="false">
      <button class="rf-tree-select-trigger" type="button" aria-haspopup="tree" aria-expanded="false" id="tree-select-trigger">
        <span class="rf-tree-select-trigger-label" id="tree-select-label">Projects</span>
        <span class="rf-tree-select-trigger-icon" aria-hidden="true">▾</span>
      </button>
      <div class="rf-tree-select-panel" role="listbox" id="tree-select-panel" hidden>
        <ul class="rf-tree-select-tree" role="tree">
          <li class="rf-tree-select-item" role="treeitem" data-node-id="projects" data-selected="true" aria-expanded="true">
            <div class="rf-tree-select-row">
              <button type="button" class="rf-tree-select-toggle" data-toggle="projects" aria-label="Collapse">▾</button>
              <button type="button" class="rf-tree-select-option" data-select="projects">Projects</button>
            </div>
            <ul class="rf-tree-select-group" role="group" data-group="projects">
              <li class="rf-tree-select-item" role="treeitem" data-node-id="alpha" data-selected="false">
                <div class="rf-tree-select-row">
                  <span class="rf-tree-select-spacer" aria-hidden="true"></span>
                  <button type="button" class="rf-tree-select-option" data-select="alpha">Alpha</button>
                </div>
              </li>
              <li class="rf-tree-select-item" role="treeitem" data-node-id="beta" data-selected="false">
                <div class="rf-tree-select-row">
                  <span class="rf-tree-select-spacer" aria-hidden="true"></span>
                  <button type="button" class="rf-tree-select-option" data-select="beta">Beta</button>
                </div>
              </li>
            </ul>
          </li>
          <li class="rf-tree-select-item" role="treeitem" data-node-id="settings" data-selected="false">
            <div class="rf-tree-select-row">
              <span class="rf-tree-select-spacer" aria-hidden="true"></span>
              <button type="button" class="rf-tree-select-option" data-select="settings">Settings</button>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <p id="tree-select-state" style="margin:.45rem 0 0;font-size:.85rem;color:#475569;">Selected: projects</p>
  `

  const trigger = mount.querySelector("#tree-select-trigger")
  const label = mount.querySelector("#tree-select-label")
  const panel = mount.querySelector("#tree-select-panel")
  const state = mount.querySelector("#tree-select-state")
  if (
    !(
      trigger instanceof HTMLButtonElement &&
      label instanceof HTMLElement &&
      panel instanceof HTMLElement &&
      state instanceof HTMLElement
    )
  )
    return

  const setOpen = (nextOpen) => {
    panel.hidden = !nextOpen
    trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false")
  }

  trigger.addEventListener("click", () => {
    setOpen(panel.hidden)
  })

  for (const button of mount.querySelectorAll("[data-toggle]")) {
    if (!(button instanceof HTMLButtonElement)) continue
    button.addEventListener("click", () => {
      const id = button.dataset.toggle
      if (!id) return
      const item = mount.querySelector(`[data-node-id="${id}"]`)
      const group = mount.querySelector(`[data-group="${id}"]`)
      if (!(item instanceof HTMLElement && group instanceof HTMLElement)) return
      const expanded = item.getAttribute("aria-expanded") !== "false"
      item.setAttribute("aria-expanded", expanded ? "false" : "true")
      group.hidden = expanded
      button.textContent = expanded ? "▸" : "▾"
    })
  }

  for (const button of mount.querySelectorAll("[data-select]")) {
    if (!(button instanceof HTMLButtonElement)) continue
    button.addEventListener("click", () => {
      const id = button.dataset.select
      if (!id) return

      for (const item of mount.querySelectorAll(".rf-tree-select-item")) {
        if (!(item instanceof HTMLElement)) continue
        item.dataset.selected = item.dataset.nodeId === id ? "true" : "false"
      }

      label.textContent = button.textContent ?? id
      state.textContent = `Selected: ${id}`
      setOpen(false)
    })
  }
}

function mountSplitterDemo(mount) {
  mount.innerHTML = `
    <section class="rf-splitter" data-orientation="horizontal" style="--rf-splitter-size: 50%;">
      <div class="rf-splitter-pane" data-pane="first">
        <strong>Navigation panel</strong>
        <p style="margin:.35rem 0 0;color:#475569;">Use arrow keys on the divider to resize.</p>
      </div>
      <div
        class="rf-splitter-handle"
        id="splitter-handle"
        role="separator"
        tabIndex="0"
        aria-orientation="vertical"
        aria-valuemin="20"
        aria-valuemax="80"
        aria-valuenow="50"
      >
        <span class="rf-splitter-handle-dot" aria-hidden="true"></span>
      </div>
      <div class="rf-splitter-pane" data-pane="second">
        <strong>Content panel</strong>
        <p style="margin:.35rem 0 0;color:#475569;">Resizable pane for data surfaces and detail views.</p>
      </div>
    </section>
    <p id="splitter-state" style="margin:.5rem 0 0;font-size:.85rem;color:#475569;">First pane: 50%</p>
  `

  const splitter = mount.querySelector(".rf-splitter")
  const handle = mount.querySelector("#splitter-handle")
  const state = mount.querySelector("#splitter-state")
  if (!(splitter instanceof HTMLElement && handle instanceof HTMLElement && state instanceof HTMLElement)) return

  const clamp = (value) => Math.max(20, Math.min(80, value))
  const setSize = (next) => {
    const size = clamp(next)
    splitter.style.setProperty("--rf-splitter-size", `${size}%`)
    handle.setAttribute("aria-valuenow", String(Math.round(size)))
    state.textContent = `First pane: ${Math.round(size)}%`
  }

  handle.addEventListener("keydown", (event) => {
    const current = Number(handle.getAttribute("aria-valuenow") || 50)
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      setSize(current - 5)
    }
    if (event.key === "ArrowRight") {
      event.preventDefault()
      setSize(current + 5)
    }
    if (event.key === "Home") {
      event.preventDefault()
      setSize(20)
    }
    if (event.key === "End") {
      event.preventDefault()
      setSize(80)
    }
  })
}

function mountInlineAlertDemo(mount) {
  mount.innerHTML = `
    <div class="rf-inline-alert" data-tone="warning" role="alert" style="max-width:30rem;">
      <div class="rf-inline-alert-body">Your billing address is incomplete.</div>
      <div class="rf-inline-alert-action"><button class="docs-button" data-variant="outline" type="button">Update</button></div>
    </div>
  `
}

function mountResultDemo(mount) {
  mount.innerHTML = `
    <section class="rf-result" data-tone="success" role="status" style="max-width:32rem;">
      <h2 class="rf-result-title">Workspace created</h2>
      <p class="rf-result-description">Your project is ready. Invite teammates or open settings to continue setup.</p>
      <div class="rf-result-actions">
        <button class="docs-button" type="button">Invite team</button>
        <button class="docs-button" type="button" data-variant="outline">Open settings</button>
      </div>
    </section>
  `
}

function mountSegmentedDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.55rem;max-width:28rem;">
      <div class="rf-segmented" role="radiogroup" aria-label="View mode">
        <button class="rf-segmented-option" role="radio" aria-checked="true" data-selected="true" type="button" data-value="overview">Overview</button>
        <button class="rf-segmented-option" role="radio" aria-checked="false" data-selected="false" type="button" data-value="activity">Activity</button>
        <button class="rf-segmented-option" role="radio" aria-checked="false" data-selected="false" type="button" data-value="settings">Settings</button>
      </div>
      <p id="segmented-state" style="margin:0;font-size:.85rem;color:#475569;">Selected: overview</p>
    </div>
  `

  const buttons = Array.from(mount.querySelectorAll(".rf-segmented-option"))
  const state = mount.querySelector("#segmented-state")
  if (!(state instanceof HTMLElement)) return

  const setSelected = (nextValue) => {
    for (const button of buttons) {
      if (!(button instanceof HTMLButtonElement)) continue
      const selected = button.dataset.value === nextValue
      button.dataset.selected = selected ? "true" : "false"
      button.setAttribute("aria-checked", selected ? "true" : "false")
    }
    state.textContent = `Selected: ${nextValue}`
  }

  for (const button of buttons) {
    if (!(button instanceof HTMLButtonElement)) continue
    button.addEventListener("click", () => {
      const value = button.dataset.value
      if (!value) return
      setSelected(value)
    })
  }
}

function mountBadgeDemo(mount) {
  mount.innerHTML = `
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
      <span class="rf-badge" data-tone="neutral">Draft</span>
      <span class="rf-badge" data-tone="success">Live</span>
      <span class="rf-badge" data-tone="warning">Needs review</span>
      <span class="rf-badge" data-tone="danger">Blocked</span>
    </div>
  `
}

function mountBreadcrumbsDemo(mount) {
  mount.innerHTML = `
    <nav aria-label="Breadcrumb" class="rf-breadcrumbs">
      <ol class="rf-breadcrumbs-list">
        <li class="rf-breadcrumbs-item">
          <a class="rf-breadcrumbs-link" href="#home">Home</a>
          <span class="rf-breadcrumbs-separator">/</span>
        </li>
        <li class="rf-breadcrumbs-item">
          <a class="rf-breadcrumbs-link" href="#projects">Projects</a>
          <span class="rf-breadcrumbs-separator">/</span>
        </li>
        <li class="rf-breadcrumbs-item">
          <span class="rf-breadcrumbs-label" aria-current="page">Roadmap</span>
        </li>
      </ol>
    </nav>
    <p id="breadcrumbs-state" style="margin:.45rem 0 0;font-size:.85rem;color:#475569;">Current page: Roadmap</p>
  `

  const links = Array.from(mount.querySelectorAll(".rf-breadcrumbs-link"))
  const state = mount.querySelector("#breadcrumbs-state")
  if (!(state instanceof HTMLElement)) return

  for (const link of links) {
    if (!(link instanceof HTMLAnchorElement)) continue
    link.addEventListener("click", (event) => {
      event.preventDefault()
      state.textContent = `Navigate to: ${link.textContent ?? "Unknown"}`
    })
  }
}

function mountBreadcrumbOverflowDemo(mount) {
  mount.innerHTML = `
    <nav aria-label="Breadcrumb" class="rf-breadcrumbs">
      <ol class="rf-breadcrumbs-list">
        <li class="rf-breadcrumbs-item">
          <a class="rf-breadcrumbs-link" href="#home">Home</a>
          <span class="rf-breadcrumbs-separator">/</span>
        </li>
        <li class="rf-breadcrumbs-item">
          <span class="rf-breadcrumbs-overflow" aria-label="3 hidden breadcrumb items">...</span>
          <span class="rf-breadcrumbs-separator">/</span>
        </li>
        <li class="rf-breadcrumbs-item">
          <a class="rf-breadcrumbs-link" href="#engineering">Engineering</a>
          <span class="rf-breadcrumbs-separator">/</span>
        </li>
        <li class="rf-breadcrumbs-item">
          <a class="rf-breadcrumbs-link" href="#platform">Platform</a>
          <span class="rf-breadcrumbs-separator">/</span>
        </li>
        <li class="rf-breadcrumbs-item">
          <span class="rf-breadcrumbs-label" aria-current="page">Deployments</span>
        </li>
      </ol>
    </nav>
  `
}

function mountChipDemo(mount) {
  mount.innerHTML = `
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
      <span class="rf-tag" data-tone="neutral">Platform</span>
      <span class="rf-tag" data-tone="brand">Critical path</span>
      <span class="rf-tag" data-tone="neutral">Q2</span>
    </div>
  `
}

function mountCardDemo(mount) {
  mount.innerHTML = `
    <section class="rf-card" style="max-width:28rem;">
      <header class="rf-card-header">
        <h3 class="rf-card-title">Billing Summary</h3>
        <p class="rf-card-subtitle">Current cycle</p>
      </header>
      <div class="rf-card-body">
        Team plan · 12 seats · Renewal in 18 days
      </div>
      <footer class="rf-card-footer">
        <button class="docs-button" type="button" data-variant="outline">Manage plan</button>
      </footer>
    </section>
  `
}

function mountComboboxDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.5rem;max-width:22rem;">
      <label for="combobox-demo-input" style="font-size:.875rem;font-weight:600;color:#0f172a;">Person</label>
      <div class="rf-combobox">
        <input id="combobox-demo-input" class="docs-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="combo-demo-list" />
        <ul id="combo-demo-list" role="listbox" class="rf-combobox-list" hidden>
          <li class="rf-combobox-option" role="option" data-value="Ada Lovelace" data-label="Ada Lovelace">Ada Lovelace</li>
          <li class="rf-combobox-option" role="option" data-value="Grace Hopper" data-label="Grace Hopper">Grace Hopper</li>
          <li class="rf-combobox-option" role="option" data-value="Margaret Hamilton" data-label="Margaret Hamilton">Margaret Hamilton</li>
          <li class="rf-combobox-empty" data-empty hidden>No matches</li>
        </ul>
      </div>
    </div>
  `

  const input = mount.querySelector("input")
  const list = mount.querySelector("[role='listbox']")
  if (!(input instanceof HTMLInputElement && list instanceof HTMLElement)) return

  const options = Array.from(list.querySelectorAll("[role='option']")).filter((option) => option instanceof HTMLElement)
  const emptyState = list.querySelector("[data-empty]")
  let highlighted = -1

  const visibleOptions = () => options.filter((option) => !option.hidden)

  const setOpen = (next) => {
    list.hidden = !next
    input.setAttribute("aria-expanded", String(next))
    if (!next) {
      highlighted = -1
      for (const option of options) {
        option.setAttribute("data-highlighted", "false")
      }
    }
  }

  const setHighlighted = (index) => {
    highlighted = index
    const visible = visibleOptions()
    for (let i = 0; i < visible.length; i += 1) {
      const option = visible[i]
      option.setAttribute("data-highlighted", i === index ? "true" : "false")
    }
  }

  const pickHighlighted = () => {
    const visible = visibleOptions()
    if (highlighted < 0 || highlighted >= visible.length) return
    const option = visible[highlighted]
    input.value = option.dataset.value ?? ""
    setOpen(false)
  }

  const applyFilter = (query) => {
    const normalized = query.trim().toLowerCase()
    let visibleCount = 0
    for (const option of options) {
      const label = (option.dataset.label ?? option.textContent ?? "").toLowerCase()
      const match = normalized === "" || label.includes(normalized)
      option.hidden = !match
      option.setAttribute("data-highlighted", "false")
      if (match) visibleCount += 1
    }
    if (emptyState instanceof HTMLElement) {
      emptyState.hidden = visibleCount > 0
    }
    highlighted = visibleCount > 0 ? 0 : -1
    if (highlighted === 0) setHighlighted(0)
  }

  input.addEventListener("focus", () => setOpen(true))
  input.addEventListener("input", () => {
    applyFilter(input.value)
    setOpen(true)
  })
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false)
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (list.hidden) setOpen(true)
      const visible = visibleOptions()
      if (visible.length === 0) return
      const next = highlighted < 0 ? 0 : (highlighted + 1) % visible.length
      setHighlighted(next)
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (list.hidden) setOpen(true)
      const visible = visibleOptions()
      if (visible.length === 0) return
      const next = highlighted < 0 ? visible.length - 1 : (highlighted - 1 + visible.length) % visible.length
      setHighlighted(next)
    }
    if (event.key === "Enter") {
      event.preventDefault()
      pickHighlighted()
    }
  })

  input.addEventListener("blur", () => {
    setTimeout(() => {
      const active = document.activeElement
      if (active instanceof Node && list.contains(active)) return
      setOpen(false)
    }, 0)
  })

  for (const option of options) {
    option.tabIndex = -1
    option.addEventListener("click", () => {
      input.value = option.dataset.value ?? ""
      setOpen(false)
    })
    option.addEventListener("mouseenter", () => {
      const index = visibleOptions().indexOf(option)
      if (index >= 0) setHighlighted(index)
    })
  }

  applyFilter("")
}

function mountAutocompleteDemo(mount) {
  mount.innerHTML = `
    <div style="max-width:22rem;display:grid;gap:.5rem;">
      <label for="autocomplete-demo-input" style="font-size:.875rem;font-weight:600;color:#0f172a;">Person</label>
      <div class="rf-combobox">
        <input id="autocomplete-demo-input" class="docs-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="autocomplete-demo-list" />
        <ul id="autocomplete-demo-list" role="listbox" class="rf-combobox-list" hidden>
          <li class="rf-combobox-option" role="option" data-value="Ada Lovelace" data-label="Ada Lovelace">Ada Lovelace</li>
          <li class="rf-combobox-option" role="option" data-value="Grace Hopper" data-label="Grace Hopper">Grace Hopper</li>
          <li class="rf-combobox-option" role="option" data-value="Margaret Hamilton" data-label="Margaret Hamilton">Margaret Hamilton</li>
          <li class="rf-combobox-empty" data-empty hidden>No matches</li>
        </ul>
      </div>
      <p style="margin:0;font-size:.85rem;color:#475569;">Committed value: <strong data-commit>None</strong></p>
    </div>
  `

  const input = mount.querySelector("input")
  const list = mount.querySelector("[role='listbox']")
  const commitValue = mount.querySelector("[data-commit]")
  if (!(input instanceof HTMLInputElement && list instanceof HTMLElement && commitValue instanceof HTMLElement)) {
    return
  }

  const options = Array.from(list.querySelectorAll("[role='option']")).filter((option) => option instanceof HTMLElement)
  const emptyState = list.querySelector("[data-empty]")
  let highlighted = -1

  const visibleOptions = () => options.filter((option) => !option.hidden)

  const setOpen = (next) => {
    list.hidden = !next
    input.setAttribute("aria-expanded", String(next))
    if (!next) {
      highlighted = -1
      for (const option of options) {
        option.setAttribute("data-highlighted", "false")
      }
    }
  }

  const setHighlighted = (index) => {
    highlighted = index
    const visible = visibleOptions()
    for (let i = 0; i < visible.length; i += 1) {
      const option = visible[i]
      option.setAttribute("data-highlighted", i === index ? "true" : "false")
    }
  }

  const commit = (value) => {
    input.value = value
    commitValue.textContent = value || "None"
    setOpen(false)
  }

  const applyFilter = (query) => {
    const normalized = query.trim().toLowerCase()
    let visibleCount = 0
    for (const option of options) {
      const label = (option.dataset.label ?? option.textContent ?? "").toLowerCase()
      const match = normalized === "" || label.includes(normalized)
      option.hidden = !match
      option.setAttribute("data-highlighted", "false")
      if (match) visibleCount += 1
    }
    if (emptyState instanceof HTMLElement) {
      emptyState.hidden = visibleCount > 0
    }
    highlighted = visibleCount > 0 ? 0 : -1
    if (highlighted === 0) setHighlighted(0)
  }

  input.addEventListener("focus", () => setOpen(true))
  input.addEventListener("input", () => {
    applyFilter(input.value)
    setOpen(true)
  })
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false)
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (list.hidden) setOpen(true)
      const visible = visibleOptions()
      if (visible.length === 0) return
      const next = highlighted < 0 ? 0 : (highlighted + 1) % visible.length
      setHighlighted(next)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (list.hidden) setOpen(true)
      const visible = visibleOptions()
      if (visible.length === 0) return
      const next = highlighted < 0 ? visible.length - 1 : (highlighted - 1 + visible.length) % visible.length
      setHighlighted(next)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      const visible = visibleOptions()
      const option = highlighted >= 0 ? visible[highlighted] : undefined
      commit(option?.dataset.value ?? input.value)
      return
    }

    if (event.key === "Tab") {
      const visible = visibleOptions()
      const option = highlighted >= 0 ? visible[highlighted] : undefined
      if (option) commit(option.dataset.value ?? input.value)
    }
  })

  for (const option of options) {
    option.addEventListener("mouseenter", () => {
      const index = visibleOptions().indexOf(option)
      if (index >= 0) setHighlighted(index)
    })
    option.addEventListener("click", () => {
      commit(option.dataset.value ?? option.textContent ?? "")
    })
  }

  applyFilter("")
}

function mountCommandPaletteDemo(mount) {
  mount.innerHTML = `
    <button class="docs-button" type="button" data-variant="outline">Open command palette</button>
    <div class="rf-command-overlay" hidden>
      <section class="rf-command" role="dialog" aria-modal="true" aria-label="Command palette">
        <header class="rf-command-header"><h2 class="rf-command-title">Command palette</h2></header>
        <input class="rf-input-base rf-focus-ring" type="search" placeholder="Search commands" />
        <ul class="rf-command-list" role="listbox">
          <li class="rf-command-item" role="option">Create issue</li>
          <li class="rf-command-item" role="option">Open deployments</li>
          <li class="rf-command-item" role="option">Invite teammate</li>
          <li class="rf-command-empty" hidden>No commands found</li>
        </ul>
      </section>
    </div>
  `

  const open = mount.querySelector("button")
  const overlay = mount.querySelector(".rf-command-overlay")
  const input = mount.querySelector("input")
  const list = mount.querySelector(".rf-command-list")
  if (
    !(
      open instanceof HTMLButtonElement &&
      overlay instanceof HTMLElement &&
      input instanceof HTMLInputElement &&
      list instanceof HTMLUListElement
    )
  ) {
    return
  }

  const items = Array.from(list.querySelectorAll(".rf-command-item"))
  const empty = list.querySelector(".rf-command-empty")
  let highlighted = -1

  const visibleItems = () => items.filter((item) => !item.hidden)

  const setHighlighted = (index) => {
    highlighted = index
    const visible = visibleItems()
    for (const [i, item] of visible.entries()) {
      const isHighlighted = i === index
      item.dataset.highlighted = isHighlighted ? "true" : "false"
      item.setAttribute("aria-selected", isHighlighted ? "true" : "false")
    }
  }

  const applyFilter = (value) => {
    const normalized = value.trim().toLowerCase()
    let visibleCount = 0

    for (const item of items) {
      const label = (item.textContent ?? "").toLowerCase()
      const matches = normalized.length === 0 || label.includes(normalized)
      item.hidden = !matches
      if (matches) visibleCount += 1
    }

    if (empty instanceof HTMLElement) {
      empty.hidden = visibleCount > 0
    }

    setHighlighted(visibleCount > 0 ? 0 : -1)
  }

  const moveHighlighted = (step) => {
    const visible = visibleItems()
    if (visible.length === 0) return

    let next = highlighted
    if (next < 0) {
      next = step > 0 ? -1 : 0
    }

    next = (next + step + visible.length) % visible.length
    setHighlighted(next)
  }

  const setOpen = (next) => {
    overlay.hidden = !next
    if (next) {
      input.value = ""
      applyFilter("")
      input.focus()
    } else open.focus()
  }

  open.addEventListener("click", () => setOpen(true))
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) setOpen(false)
  })

  input.addEventListener("input", () => {
    applyFilter(input.value)
  })

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      moveHighlighted(1)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      moveHighlighted(-1)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      const visible = visibleItems()
      const active = highlighted >= 0 ? visible[highlighted] : undefined
      if (active) setOpen(false)
    }
  })

  for (const item of items) {
    item.dataset.highlighted = "false"
    item.setAttribute("aria-selected", "false")

    item.addEventListener("mouseenter", () => {
      const index = visibleItems().indexOf(item)
      if (index >= 0) setHighlighted(index)
    })

    item.addEventListener("click", () => {
      setOpen(false)
    })
  }

  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false)
  })

  applyFilter("")
}

function mountPageHeaderDemo(mount) {
  mount.innerHTML = `
    <header class="rf-page-header">
      <div>
        <h1 class="rf-page-header-title">Project Overview</h1>
        <p class="rf-page-header-subtitle">Track delivery health and team velocity.</p>
      </div>
      <div class="rf-page-header-actions">
        <button class="docs-button" type="button" data-variant="outline">Export</button>
      </div>
    </header>
  `
}

function mountEmptyStateDemo(mount) {
  mount.innerHTML = `
    <section class="rf-empty-state" role="status">
      <h2 class="rf-empty-state-title">No deployment history yet</h2>
      <p class="rf-empty-state-description">Run your first deployment to see build logs and release status here.</p>
      <div class="rf-empty-state-action">
        <button class="docs-button" type="button">Create deployment</button>
      </div>
    </section>
  `
}

function mountFileUploadDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.35rem;max-width:28rem;">
      <label for="file-upload-demo">Upload assets</label>
      <input id="file-upload-demo" class="rf-file-upload rf-focus-ring" type="file" name="assets" accept="image/*,.pdf" multiple />
      <p id="file-upload-state" style="margin:0;font-size:.875rem;color:#475569;">No files selected</p>
    </div>
  `

  const input = mount.querySelector("#file-upload-demo")
  const state = mount.querySelector("#file-upload-state")
  if (!(input instanceof HTMLInputElement && state instanceof HTMLElement)) return

  const sync = () => {
    const files = input.files
    if (!files || files.length === 0) {
      state.textContent = "No files selected"
      return
    }

    const names = Array.from(files)
      .slice(0, 3)
      .map((file) => file.name)
      .join(", ")
    const suffix = files.length > 3 ? ` +${files.length - 3} more` : ""
    state.textContent = `${files.length} selected: ${names}${suffix}`
  }

  input.addEventListener("change", sync)
}

function mountFilterBarDemo(mount) {
  mount.innerHTML = `
    <section class="rf-filter-bar" aria-label="Filters">
      <h2 class="rf-filter-bar-title">Filter results</h2>
      <div class="rf-filter-bar-fields">
        <input class="docs-input" type="search" placeholder="Search" />
        <select class="docs-input"><option>All statuses</option><option>Open</option><option>Closed</option></select>
        <select class="docs-input"><option>Any owner</option><option>Alex</option><option>Jules</option></select>
      </div>
      <div class="rf-filter-bar-actions">
        <button class="docs-button" type="button" data-variant="outline">Clear</button>
        <button class="docs-button" type="button">Apply</button>
      </div>
    </section>
  `
}

function mountFilterPanelDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.55rem;max-width:34rem;">
      <button class="docs-button" type="button" data-variant="outline" id="filter-panel-open">Open filters</button>
      <p id="filter-panel-state" style="margin:0;font-size:.85rem;color:#475569;">No filters applied</p>
      <div class="docs-overlay docs-drawer-backdrop" id="filter-panel-overlay" hidden>
        <section class="docs-drawer-panel" role="dialog" aria-modal="true" aria-label="Filters">
          <header class="docs-drawer-header"><h3>Filters</h3></header>
          <div class="docs-drawer-body">
            <section class="rf-filter-panel" aria-label="Filter controls">
              <p class="rf-filter-panel-description">Narrow table results by query and status.</p>
              <div class="rf-filter-panel-fields">
                <input class="docs-input" id="filter-panel-query" type="search" placeholder="Search releases" />
                <select class="docs-input" id="filter-panel-status"><option value="all">All statuses</option><option value="running">Running</option><option value="failed">Failed</option></select>
              </div>
              <div class="rf-filter-panel-actions">
                <button class="docs-button" type="button" data-variant="outline" id="filter-panel-clear">Clear</button>
                <button class="docs-button" type="button" id="filter-panel-apply">Apply filters</button>
              </div>
            </section>
          </div>
          <footer class="docs-drawer-footer">
            <button class="docs-button" type="button" data-variant="outline" id="filter-panel-close">Close</button>
          </footer>
        </section>
      </div>
    </div>
  `

  const open = mount.querySelector("#filter-panel-open")
  const overlay = mount.querySelector("#filter-panel-overlay")
  const close = mount.querySelector("#filter-panel-close")
  const clear = mount.querySelector("#filter-panel-clear")
  const apply = mount.querySelector("#filter-panel-apply")
  const query = mount.querySelector("#filter-panel-query")
  const status = mount.querySelector("#filter-panel-status")
  const state = mount.querySelector("#filter-panel-state")

  if (
    !(
      open instanceof HTMLButtonElement &&
      overlay instanceof HTMLElement &&
      close instanceof HTMLButtonElement &&
      clear instanceof HTMLButtonElement &&
      apply instanceof HTMLButtonElement &&
      query instanceof HTMLInputElement &&
      status instanceof HTMLSelectElement &&
      state instanceof HTMLElement
    )
  ) {
    return
  }

  const setOpen = (next) => {
    overlay.hidden = !next
  }

  open.addEventListener("click", () => setOpen(true))
  close.addEventListener("click", () => setOpen(false))
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) setOpen(false)
  })
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false)
  })

  clear.addEventListener("click", () => {
    query.value = ""
    status.value = "all"
    state.textContent = "Filters cleared"
  })

  apply.addEventListener("click", () => {
    const queryValue = query.value.trim() || "none"
    state.textContent = `Applied: ${queryValue} / ${status.value}`
    setOpen(false)
  })
}

function mountDataListDemo(mount) {
  mount.innerHTML = `
    <ul class="rf-data-list" role="list">
      <li class="rf-data-list-item">
        <div>
          <h3 class="rf-data-list-title">Incident triage</h3>
          <p class="rf-data-list-description">Review unresolved alerts and assign owners.</p>
        </div>
        <div class="rf-data-list-right">
          <p class="rf-data-list-meta">Updated 5m ago</p>
          <div class="rf-data-list-actions"><button class="docs-button" type="button" data-variant="outline">Open</button></div>
        </div>
      </li>
      <li class="rf-data-list-item">
        <div>
          <h3 class="rf-data-list-title">Release checklist</h3>
          <p class="rf-data-list-description">Validate smoke tests and rollout safeguards.</p>
        </div>
        <div class="rf-data-list-right">
          <p class="rf-data-list-meta">Updated 22m ago</p>
          <div class="rf-data-list-actions"><button class="docs-button" type="button" data-variant="outline">Open</button></div>
        </div>
      </li>
    </ul>
  `
}

function mountDescriptionsDemo(mount) {
  mount.innerHTML = `
    <section class="rf-descriptions" data-size="comfortable" data-layout="horizontal" data-bordered="true" style="--rf-descriptions-columns: 3;">
      <header class="rf-descriptions-header">
        <h3 class="rf-descriptions-title">Deployment details</h3>
        <div class="rf-descriptions-extra">Updated 2m ago</div>
      </header>
      <dl class="rf-descriptions-list">
        <div class="rf-descriptions-item" style="grid-column: span 1;"><dt class="rf-descriptions-label">Environment</dt><dd class="rf-descriptions-content">Production</dd></div>
        <div class="rf-descriptions-item" style="grid-column: span 1;"><dt class="rf-descriptions-label">Status</dt><dd class="rf-descriptions-content">Running</dd></div>
        <div class="rf-descriptions-item" style="grid-column: span 1;"><dt class="rf-descriptions-label">Owner</dt><dd class="rf-descriptions-content">Release Bot</dd></div>
        <div class="rf-descriptions-item" style="grid-column: span 2;"><dt class="rf-descriptions-label">Commit</dt><dd class="rf-descriptions-content">a2f3d91 / Improve background jobs</dd></div>
        <div class="rf-descriptions-item" style="grid-column: span 1;"><dt class="rf-descriptions-label">Duration</dt><dd class="rf-descriptions-content">4m 12s</dd></div>
      </dl>
    </section>
    <div style="display:flex;gap:.5rem;margin-top:.55rem;">
      <button class="docs-button" type="button" data-variant="outline" id="descriptions-layout">Toggle layout</button>
      <span id="descriptions-state" style="font-size:.85rem;color:#475569;align-self:center;">Layout: horizontal</span>
    </div>
  `

  const root = mount.querySelector(".rf-descriptions")
  const toggle = mount.querySelector("#descriptions-layout")
  const state = mount.querySelector("#descriptions-state")
  if (!(root instanceof HTMLElement && toggle instanceof HTMLButtonElement && state instanceof HTMLElement)) return

  toggle.addEventListener("click", () => {
    const current = root.dataset.layout === "vertical" ? "vertical" : "horizontal"
    const next = current === "horizontal" ? "vertical" : "horizontal"
    root.dataset.layout = next
    state.textContent = `Layout: ${next}`
  })
}

function mountDataGridLiteDemo(mount) {
  mount.innerHTML = `
    <div class="rf-data-grid-wrap" role="region" aria-label="Data grid">
      <table class="rf-data-grid">
        <caption>Deployments</caption>
        <thead>
          <tr>
            <th class="rf-data-grid-select-col"><input id="grid-select-all" type="checkbox" aria-label="Select all rows" /></th>
            <th><button type="button" class="rf-data-grid-sort" data-sort-key="name"><span>Name</span><span class="rf-data-grid-sort-indicator">↕</span></button></th>
            <th><button type="button" class="rf-data-grid-sort" data-sort-key="status"><span>Status</span><span class="rf-data-grid-sort-indicator">↕</span></button></th>
            <th data-align="right"><button type="button" class="rf-data-grid-sort" data-sort-key="duration"><span>Duration</span><span class="rf-data-grid-sort-indicator">↕</span></button></th>
          </tr>
        </thead>
        <tbody>
          <tr data-key="deploy-1"><td class="rf-data-grid-select-col"><input type="checkbox" aria-label="Select row deploy-1" /></td><td data-col="name">Deploy 341</td><td data-col="status">Success</td><td data-col="duration" data-align="right" data-sort-value="91">91s</td></tr>
          <tr data-key="deploy-2"><td class="rf-data-grid-select-col"><input type="checkbox" aria-label="Select row deploy-2" /></td><td data-col="name">Deploy 342</td><td data-col="status">Running</td><td data-col="duration" data-align="right" data-sort-value="132">132s</td></tr>
          <tr data-key="deploy-3"><td class="rf-data-grid-select-col"><input type="checkbox" aria-label="Select row deploy-3" /></td><td data-col="name">Deploy 343</td><td data-col="status">Failed</td><td data-col="duration" data-align="right" data-sort-value="64">64s</td></tr>
        </tbody>
      </table>
    </div>
  `

  const table = mount.querySelector("table")
  const tbody = mount.querySelector("tbody")
  const headers = Array.from(mount.querySelectorAll(".rf-data-grid-sort"))
  const selectAll = mount.querySelector("#grid-select-all")
  if (!(table instanceof HTMLTableElement && tbody instanceof HTMLElement && selectAll instanceof HTMLInputElement))
    return

  let sort = { key: null, direction: null }

  const getRows = () => Array.from(tbody.querySelectorAll("tr"))

  const updateSelectionState = () => {
    const rows = getRows()
    const checks = rows
      .map((row) => row.querySelector("input[type='checkbox']"))
      .filter((el) => el instanceof HTMLInputElement)
    const allSelected = checks.length > 0 && checks.every((check) => check.checked)
    selectAll.checked = allSelected

    for (const row of rows) {
      const check = row.querySelector("input[type='checkbox']")
      if (check instanceof HTMLInputElement) {
        row.dataset.selected = check.checked ? "true" : "false"
      }
    }
  }

  selectAll.addEventListener("change", () => {
    const rows = getRows()
    for (const row of rows) {
      const check = row.querySelector("input[type='checkbox']")
      if (check instanceof HTMLInputElement) {
        check.checked = selectAll.checked
      }
    }
    updateSelectionState()
  })

  for (const row of getRows()) {
    const check = row.querySelector("input[type='checkbox']")
    if (check instanceof HTMLInputElement) {
      check.addEventListener("change", updateSelectionState)
    }
  }

  const getSortValue = (row, key) => {
    const cell = row.querySelector(`[data-col="${key}"]`)
    if (!cell) return ""
    const raw = cell.getAttribute("data-sort-value")
    if (raw !== null && raw !== "") return Number(raw)
    return (cell.textContent ?? "").trim().toLowerCase()
  }

  const updateIndicators = () => {
    for (const header of headers) {
      if (!(header instanceof HTMLButtonElement)) continue
      const indicator = header.querySelector(".rf-data-grid-sort-indicator")
      const key = header.dataset.sortKey
      if (!(indicator instanceof HTMLElement) || !key) continue
      if (sort.key !== key) {
        indicator.textContent = "↕"
      } else {
        indicator.textContent = sort.direction === "asc" ? "↑" : "↓"
      }
    }
  }

  for (const header of headers) {
    if (!(header instanceof HTMLButtonElement)) continue
    header.addEventListener("click", () => {
      const key = header.dataset.sortKey
      if (!key) return

      if (sort.key !== key) {
        sort = { key, direction: "asc" }
      } else if (sort.direction === "asc") {
        sort = { key, direction: "desc" }
      } else {
        sort = { key: null, direction: null }
      }

      const rows = getRows()
      if (!sort.key || !sort.direction) {
        rows.sort((a, b) => (a.dataset.key ?? "").localeCompare(b.dataset.key ?? ""))
      } else {
        const direction = sort.direction === "asc" ? 1 : -1
        rows.sort((a, b) => {
          const aValue = getSortValue(a, sort.key)
          const bValue = getSortValue(b, sort.key)
          if (aValue === bValue) return 0
          return aValue > bValue ? direction : -direction
        })
      }

      for (const row of rows) tbody.appendChild(row)
      updateIndicators()
      updateSelectionState()
    })
  }

  updateIndicators()
  updateSelectionState()
}

function mountDataTableDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.625rem;max-width:52rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:.5rem;flex-wrap:wrap;">
        <p id="data-table-filter-summary" style="margin:0;font-size:.85rem;color:#475569;">Filters: none</p>
        <button id="data-table-open-filters" type="button" class="docs-button" data-variant="outline">Open filters</button>
      </div>
      <section class="rf-data-table-wrap" role="region" aria-label="Data table">
        <table class="rf-data-table">
          <caption>Releases</caption>
          <thead>
            <tr>
              <th class="rf-data-table-select-col"><input id="table-select-all" type="checkbox" aria-label="Select visible rows" /></th>
              <th><button type="button" class="rf-data-table-sort" data-sort-key="name"><span>Name</span><span class="rf-data-table-sort-indicator">↕</span></button></th>
              <th><button type="button" class="rf-data-table-sort" data-sort-key="status"><span>Status</span><span class="rf-data-table-sort-indicator">↕</span></button></th>
              <th data-align="right"><button type="button" class="rf-data-table-sort" data-sort-key="duration"><span>Duration</span><span class="rf-data-table-sort-indicator">↕</span></button></th>
            </tr>
          </thead>
          <tbody id="data-table-body"></tbody>
        </table>
        <footer class="rf-data-table-footer">
          <span id="data-table-status" class="rf-data-table-pagination-status">Page 1 of 1 | 0 results</span>
          <div class="rf-data-table-pagination-actions">
            <button id="data-table-prev" type="button" class="docs-button" data-variant="outline">Previous</button>
            <button id="data-table-next" type="button" class="docs-button" data-variant="outline">Next</button>
          </div>
        </footer>
      </section>
      <div class="docs-overlay docs-drawer-backdrop" id="data-table-filter-overlay" hidden>
        <section class="docs-drawer-panel" role="dialog" aria-modal="true" aria-label="Filters">
          <header class="docs-drawer-header"><h3>Filters</h3></header>
          <div class="docs-drawer-body">
            <section class="rf-filter-panel" aria-label="Filter controls">
              <p class="rf-filter-panel-description">Use query and status filters to narrow visible rows.</p>
              <div class="rf-filter-panel-fields">
                <input class="docs-input" id="data-table-filter-query" type="search" placeholder="Search release name" />
                <select class="docs-input" id="data-table-filter-status">
                  <option value="all">All statuses</option>
                  <option value="success">Success</option>
                  <option value="running">Running</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div class="rf-filter-panel-actions">
                <button id="data-table-filter-clear" type="button" class="docs-button" data-variant="outline">Clear</button>
                <button id="data-table-filter-apply" type="button" class="docs-button">Apply filters</button>
              </div>
            </section>
          </div>
          <footer class="docs-drawer-footer">
            <button id="data-table-filter-close" type="button" class="docs-button" data-variant="outline">Close</button>
          </footer>
        </section>
      </div>
    </div>
  `

  const body = mount.querySelector("#data-table-body")
  const status = mount.querySelector("#data-table-status")
  const prev = mount.querySelector("#data-table-prev")
  const next = mount.querySelector("#data-table-next")
  const selectAll = mount.querySelector("#table-select-all")
  const filterSummary = mount.querySelector("#data-table-filter-summary")
  const openFilters = mount.querySelector("#data-table-open-filters")
  const filterOverlay = mount.querySelector("#data-table-filter-overlay")
  const filterClose = mount.querySelector("#data-table-filter-close")
  const filterApply = mount.querySelector("#data-table-filter-apply")
  const filterClear = mount.querySelector("#data-table-filter-clear")
  const filterQuery = mount.querySelector("#data-table-filter-query")
  const filterStatus = mount.querySelector("#data-table-filter-status")
  const sortButtons = Array.from(mount.querySelectorAll(".rf-data-table-sort"))
  if (
    !(
      body instanceof HTMLElement &&
      status instanceof HTMLElement &&
      prev instanceof HTMLButtonElement &&
      next instanceof HTMLButtonElement &&
      selectAll instanceof HTMLInputElement &&
      filterSummary instanceof HTMLElement &&
      openFilters instanceof HTMLButtonElement &&
      filterOverlay instanceof HTMLElement &&
      filterClose instanceof HTMLButtonElement &&
      filterApply instanceof HTMLButtonElement &&
      filterClear instanceof HTMLButtonElement &&
      filterQuery instanceof HTMLInputElement &&
      filterStatus instanceof HTMLSelectElement
    )
  ) {
    return
  }

  const pageSize = 2
  let page = 1
  let sort = { key: null, direction: null }
  const allRows = [
    { key: "release-1", name: "Release 1.0", status: "Success", duration: 91 },
    { key: "release-2", name: "Release 1.1", status: "Failed", duration: 132 },
    { key: "release-3", name: "Release 1.2", status: "Running", duration: 64 },
    { key: "release-4", name: "Release 1.3", status: "Success", duration: 82 },
  ]
  let rows = [...allRows]
  const selected = new Set()
  let activeFilters = { query: "", status: "all" }

  const setFilterOverlayOpen = (nextOpen) => {
    filterOverlay.hidden = !nextOpen
  }

  const resolveCellText = (row, columnKey) => {
    const value = row[columnKey]
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value)
    }
    return ""
  }

  const createContainsFilter = (columnKeys, query) => {
    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery === "" || columnKeys.length === 0) return undefined
    return (row) =>
      columnKeys.some((columnKey) => resolveCellText(row, columnKey).toLowerCase().includes(normalizedQuery))
  }

  const createEqualsFilter = (columnKey, value, allValue) => {
    const normalizedValue = String(value).toLowerCase()
    if (normalizedValue === String(allValue).toLowerCase()) return undefined
    return (row) => resolveCellText(row, columnKey).toLowerCase() === normalizedValue
  }

  const composeRowFilter = (...filters) => {
    const active = filters.filter((filter) => typeof filter === "function")
    if (active.length === 0) return undefined
    if (active.length === 1) return active[0]
    return (row) => active.every((filter) => filter(row))
  }

  const applyFilterState = (queryValue, statusValue) => {
    const query = queryValue.trim()
    activeFilters = { query, status: statusValue }

    const rowFilter = composeRowFilter(
      createContainsFilter(["name"], query),
      createEqualsFilter("status", statusValue, "all"),
    )

    rows = rowFilter ? allRows.filter(rowFilter) : allRows

    const querySummary = activeFilters.query === "" ? "any name" : activeFilters.query.toLowerCase()
    const statusSummary = activeFilters.status === "all" ? "any status" : activeFilters.status
    filterSummary.textContent = `Filters: ${querySummary} | ${statusSummary}`
  }

  const totalPages = () => Math.max(1, Math.ceil(rows.length / pageSize))

  const rowMarkup = (row) => `
    <tr data-key="${row.key}" data-selected="${selected.has(row.key) ? "true" : "false"}">
      <td class="rf-data-table-select-col"><input type="checkbox" aria-label="Select row ${row.key}" data-row-check="${row.key}" ${selected.has(row.key) ? "checked" : ""} /></td>
      <td data-col="name">${row.name}</td>
      <td data-col="status">${row.status}</td>
      <td data-col="duration" data-align="right">${row.duration}s</td>
    </tr>
  `

  const render = () => {
    const currentTotalPages = totalPages()
    page = Math.min(Math.max(1, page), currentTotalPages)
    const pageRows = rows.slice((page - 1) * pageSize, page * pageSize)
    if (pageRows.length === 0) {
      body.innerHTML = `<tr><td class="rf-data-table-empty" colspan="4">No rows</td></tr>`
    } else {
      body.innerHTML = pageRows.map(rowMarkup).join("")
    }

    status.textContent = `Page ${page} of ${currentTotalPages} | ${rows.length} result${rows.length === 1 ? "" : "s"}`
    prev.disabled = page <= 1
    next.disabled = page >= currentTotalPages

    const checks = Array.from(body.querySelectorAll("input[data-row-check]")).filter(
      (el) => el instanceof HTMLInputElement,
    )
    selectAll.checked = checks.length > 0 && checks.every((check) => check.checked)

    for (const check of checks) {
      check.addEventListener("change", () => {
        const key = check.getAttribute("data-row-check")
        if (!key) return
        if (check.checked) selected.add(key)
        else selected.delete(key)
        const row = check.closest("tr")
        if (row instanceof HTMLElement) row.dataset.selected = check.checked ? "true" : "false"
        selectAll.checked = checks.length > 0 && checks.every((currentCheck) => currentCheck.checked)
      })
    }
  }

  selectAll.addEventListener("change", () => {
    for (const check of body.querySelectorAll("input[data-row-check]")) {
      if (!(check instanceof HTMLInputElement)) continue
      const key = check.getAttribute("data-row-check")
      if (!key) continue
      check.checked = selectAll.checked
      if (selectAll.checked) selected.add(key)
      else selected.delete(key)
      const row = check.closest("tr")
      if (row instanceof HTMLElement) row.dataset.selected = check.checked ? "true" : "false"
    }
  })

  openFilters.addEventListener("click", () => {
    filterQuery.value = activeFilters.query
    filterStatus.value = activeFilters.status
    setFilterOverlayOpen(true)
  })

  filterClose.addEventListener("click", () => {
    setFilterOverlayOpen(false)
  })

  filterOverlay.addEventListener("click", (event) => {
    if (event.target === filterOverlay) setFilterOverlayOpen(false)
  })

  filterOverlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setFilterOverlayOpen(false)
  })

  filterApply.addEventListener("click", () => {
    applyFilterState(filterQuery.value, filterStatus.value)
    page = 1
    setFilterOverlayOpen(false)
    render()
  })

  filterClear.addEventListener("click", () => {
    filterQuery.value = ""
    filterStatus.value = "all"
    applyFilterState("", "all")
    page = 1
    render()
  })

  prev.addEventListener("click", () => {
    page = Math.max(1, page - 1)
    render()
  })

  next.addEventListener("click", () => {
    page = Math.min(totalPages(), page + 1)
    render()
  })

  for (const button of sortButtons) {
    if (!(button instanceof HTMLButtonElement)) continue
    button.addEventListener("click", () => {
      const key = button.dataset.sortKey
      if (!key) return

      if (sort.key !== key) sort = { key, direction: "asc" }
      else if (sort.direction === "asc") sort = { key, direction: "desc" }
      else sort = { key: null, direction: null }

      if (!sort.key || !sort.direction) {
        rows = [...rows].sort((a, b) => a.key.localeCompare(b.key))
      } else {
        const direction = sort.direction === "asc" ? 1 : -1
        rows = [...rows].sort((a, b) => {
          const aValue = a[sort.key]
          const bValue = b[sort.key]
          if (aValue === bValue) return 0
          return aValue > bValue ? direction : -direction
        })
      }

      for (const sortButton of sortButtons) {
        if (!(sortButton instanceof HTMLButtonElement)) continue
        const indicator = sortButton.querySelector(".rf-data-table-sort-indicator")
        const sortKey = sortButton.dataset.sortKey
        if (!(indicator instanceof HTMLElement) || !sortKey) continue
        indicator.textContent = sort.key !== sortKey ? "↕" : sort.direction === "asc" ? "↑" : "↓"
      }

      page = 1
      render()
    })
  }

  applyFilterState("", "all")
  render()
}

function mountDatePickerDemo(mount) {
  let selectedISO = "2026-03-25"
  let viewMonth = monthStartDatePicker(parseDatePickerISODate(selectedISO) ?? new Date())

  mount.innerHTML = `
    <div class="rf-date-picker" style="max-width:20rem;">
      <label for="date-picker-demo" style="display:block;margin:0 0 .35rem;">Launch date</label>
      <div class="rf-date-picker-field">
        <input id="date-picker-demo" class="docs-input" type="text" value="2026-03-25" aria-haspopup="dialog" aria-expanded="false" />
        <button type="button" class="rf-date-picker-toggle rf-focus-ring" aria-label="Open calendar">📅</button>
      </div>
      <section class="rf-date-picker-panel" role="dialog" aria-label="Choose date" hidden>
        <header class="rf-date-picker-header">
          <button type="button" class="rf-date-picker-nav rf-focus-ring" data-nav="prev" aria-label="Previous month">‹</button>
          <h3 class="rf-date-picker-title" id="date-picker-month">March 2026</h3>
          <button type="button" class="rf-date-picker-nav rf-focus-ring" data-nav="next" aria-label="Next month">›</button>
        </header>
        <table class="rf-date-picker-grid">
          <thead><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead>
          <tbody id="date-picker-grid-body"></tbody>
        </table>
      </section>
      <p id="date-picker-state" style="margin:.35rem 0 0;font-size:.875rem;color:#475569;">Selected: 2026-03-25</p>
    </div>
  `

  const input = mount.querySelector("#date-picker-demo")
  const toggle = mount.querySelector(".rf-date-picker-toggle")
  const panel = mount.querySelector(".rf-date-picker-panel")
  const nav = Array.from(mount.querySelectorAll(".rf-date-picker-nav"))
  const gridBody = mount.querySelector("#date-picker-grid-body")
  const month = mount.querySelector("#date-picker-month")
  const state = mount.querySelector("#date-picker-state")
  if (
    !(
      input instanceof HTMLInputElement &&
      toggle instanceof HTMLButtonElement &&
      panel instanceof HTMLElement &&
      gridBody instanceof HTMLElement &&
      month instanceof HTMLElement &&
      state instanceof HTMLElement
    )
  ) {
    return
  }

  const setOpen = (next) => {
    panel.hidden = !next
    input.setAttribute("aria-expanded", String(next))
  }

  const setSelected = (value) => {
    selectedISO = value
    input.value = value
    state.textContent = `Selected: ${value}`
    renderCalendar()
  }

  const renderCalendar = () => {
    month.textContent = viewMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    const cells = buildDatePickerMonthCells(viewMonth)

    let html = ""
    for (let week = 0; week < 6; week += 1) {
      html += "<tr>"
      for (let day = 0; day < 7; day += 1) {
        const cell = cells[week * 7 + day]
        html += `<td><button type="button" class="rf-date-picker-day" data-date="${cell.iso}" data-in-month="${cell.inMonth ? "true" : "false"}" data-selected="${selectedISO === cell.iso ? "true" : "false"}">${cell.day}</button></td>`
      }
      html += "</tr>"
    }
    gridBody.innerHTML = html
  }

  toggle.addEventListener("click", () => {
    setOpen(panel.hidden)
  })

  input.addEventListener("click", () => {
    if (panel.hidden) setOpen(true)
  })

  input.addEventListener("input", () => {
    const value = input.value.trim()
    selectedISO = value || ""
    state.textContent = value ? `Selected: ${value}` : "No date selected"

    const parsed = parseDatePickerISODate(value)
    if (parsed) {
      viewMonth = monthStartDatePicker(parsed)
      renderCalendar()
    }
  })

  gridBody.addEventListener("click", (event) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const day = target.closest("button[data-date]")
    if (!(day instanceof HTMLButtonElement)) return
    const value = day.dataset.date
    if (!value) return
    setSelected(value)
    setOpen(false)
  })

  for (const button of nav) {
    if (!(button instanceof HTMLButtonElement)) continue
    button.addEventListener("click", () => {
      viewMonth = monthStartDatePicker(addDatePickerMonths(viewMonth, button.dataset.nav === "prev" ? -1 : 1))
      renderCalendar()
    })
  }

  document.addEventListener("pointerdown", (event) => {
    const target = event.target
    if (!(target instanceof Node)) return
    if (mount.contains(target)) return
    if (!panel.hidden) setOpen(false)
  })

  renderCalendar()
}

function mountDateTimePickerDemo(mount) {
  mount.innerHTML = `
    <div class="rf-date-time-picker" style="max-width:24rem;">
      <label style="display:block;margin:0 0 .35rem;">Release timestamp</label>
      <div class="rf-date-time-picker-fields">
        <input id="datetime-date-demo" class="docs-input" type="date" value="2026-03-25" />
        <input id="datetime-time-demo" class="docs-input rf-time-picker" type="time" value="09:30" step="900" />
      </div>
      <p id="datetime-state" style="margin:.35rem 0 0;font-size:.875rem;color:#475569;"></p>
    </div>
  `

  const dateInput = mount.querySelector("#datetime-date-demo")
  const timeInput = mount.querySelector("#datetime-time-demo")
  const state = mount.querySelector("#datetime-state")
  if (!(dateInput instanceof HTMLInputElement && timeInput instanceof HTMLInputElement && state instanceof HTMLElement))
    return

  const sync = () => {
    const date = dateInput.value
    const time = timeInput.value
    state.textContent = date && time ? `Combined: ${date}T${time}` : "Pick both date and time"
  }

  dateInput.addEventListener("input", sync)
  timeInput.addEventListener("input", sync)
  sync()
}

function mountDateRangePickerDemo(mount) {
  let range = { start: "2026-03-12", end: "2026-03-16" }
  let viewMonth = monthStartDatePicker(parseDatePickerISODate(range.start) ?? new Date())

  mount.innerHTML = `
    <div class="rf-date-picker rf-date-range-picker" style="max-width:24rem;">
      <label for="date-range-picker-demo" style="display:block;margin:0 0 .35rem;">Maintenance window</label>
      <div class="rf-date-picker-field">
        <input id="date-range-picker-demo" class="docs-input" type="text" aria-haspopup="dialog" aria-expanded="false" />
        <button type="button" class="rf-date-picker-toggle rf-focus-ring" aria-label="Open calendar">📅</button>
      </div>
      <section class="rf-date-picker-panel" role="dialog" aria-label="Choose date range" hidden>
        <header class="rf-date-picker-header">
          <button type="button" class="rf-date-picker-nav rf-focus-ring" data-nav="prev" aria-label="Previous month">‹</button>
          <h3 class="rf-date-picker-title" id="date-range-picker-month"></h3>
          <button type="button" class="rf-date-picker-nav rf-focus-ring" data-nav="next" aria-label="Next month">›</button>
        </header>
        <table class="rf-date-picker-grid">
          <thead><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead>
          <tbody id="date-range-picker-grid-body"></tbody>
        </table>
      </section>
      <p id="date-range-picker-state" style="margin:.35rem 0 0;font-size:.875rem;color:#475569;"></p>
    </div>
  `

  const input = mount.querySelector("#date-range-picker-demo")
  const toggle = mount.querySelector(".rf-date-picker-toggle")
  const panel = mount.querySelector(".rf-date-picker-panel")
  const nav = Array.from(mount.querySelectorAll(".rf-date-picker-nav"))
  const gridBody = mount.querySelector("#date-range-picker-grid-body")
  const month = mount.querySelector("#date-range-picker-month")
  const state = mount.querySelector("#date-range-picker-state")

  if (
    !(
      input instanceof HTMLInputElement &&
      toggle instanceof HTMLButtonElement &&
      panel instanceof HTMLElement &&
      gridBody instanceof HTMLElement &&
      month instanceof HTMLElement &&
      state instanceof HTMLElement
    )
  ) {
    return
  }

  const formatRange = () => {
    if (!range.start && !range.end) return ""
    if (range.start && !range.end) return `${range.start} -`
    return `${range.start} - ${range.end}`
  }

  const inRange = (iso) => {
    if (!range.start || !range.end) return false
    return iso >= range.start && iso <= range.end
  }

  const setOpen = (next) => {
    panel.hidden = !next
    input.setAttribute("aria-expanded", String(next))
  }

  const render = () => {
    month.textContent = viewMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    input.value = formatRange()
    state.textContent = input.value ? `Selected range: ${input.value}` : "No range selected"

    const cells = buildDatePickerMonthCells(viewMonth)
    let html = ""
    for (let week = 0; week < 6; week += 1) {
      html += "<tr>"
      for (let day = 0; day < 7; day += 1) {
        const cell = cells[week * 7 + day]
        const selected = cell.iso === range.start || cell.iso === range.end
        html += `<td><button type="button" class="rf-date-picker-day" data-date="${cell.iso}" data-in-month="${cell.inMonth ? "true" : "false"}" data-selected="${selected ? "true" : "false"}" data-in-range="${inRange(cell.iso) ? "true" : "false"}">${cell.day}</button></td>`
      }
      html += "</tr>"
    }
    gridBody.innerHTML = html
  }

  const selectDate = (iso) => {
    if (!range.start || (range.start && range.end)) {
      range = { start: iso }
      render()
      return
    }

    if (iso < range.start) {
      range = { start: iso, end: range.start }
    } else {
      range = { start: range.start, end: iso }
    }
    render()
    setOpen(false)
  }

  toggle.addEventListener("click", () => setOpen(panel.hidden))
  input.addEventListener("click", () => {
    if (panel.hidden) setOpen(true)
  })

  gridBody.addEventListener("click", (event) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const day = target.closest("button[data-date]")
    if (!(day instanceof HTMLButtonElement)) return
    const value = day.dataset.date
    if (!value) return
    selectDate(value)
  })

  for (const button of nav) {
    if (!(button instanceof HTMLButtonElement)) continue
    button.addEventListener("click", () => {
      viewMonth = monthStartDatePicker(addDatePickerMonths(viewMonth, button.dataset.nav === "prev" ? -1 : 1))
      render()
    })
  }

  render()
}

function mountTableDemo(mount) {
  mount.innerHTML = `
    <div class="rf-table-wrap" role="region" aria-label="Data table">
      <table class="rf-table">
        <caption>Service health</caption>
        <thead>
          <tr>
            <th scope="col">Service</th>
            <th scope="col">Status</th>
            <th scope="col" data-align="right">Latency</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>API</td><td>Healthy</td><td data-align="right">121ms</td></tr>
          <tr><td>Worker</td><td>Degraded</td><td data-align="right">410ms</td></tr>
          <tr><td>Webhook</td><td>Healthy</td><td data-align="right">98ms</td></tr>
        </tbody>
      </table>
    </div>
  `
}

function mountTagDemo(mount) {
  mount.innerHTML = `
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
      <span class="rf-tag" data-tone="neutral">Design</span>
      <span class="rf-tag" data-tone="brand">Engineering</span>
      <span class="rf-tag" data-tone="neutral">Operations</span>
    </div>
  `
}

function mountEmptyResultsDemo(mount) {
  mount.innerHTML = `
    <section class="rf-empty-results" role="status" aria-live="polite">
      <h2 class="rf-empty-results-title">No matching results</h2>
      <p class="rf-empty-results-description">Try removing one or more filters to broaden your search.</p>
      <div class="rf-empty-results-action"><button class="docs-button" type="button" data-variant="outline">Reset filters</button></div>
    </section>
  `
}

function mountPopoverDemo(mount) {
  mount.innerHTML = `
    <div class="rf-popover">
      <button class="docs-button" type="button" data-variant="outline" aria-expanded="false">Open details</button>
      <section class="rf-popover-panel" role="dialog" aria-label="Popover" hidden>
        <p style="margin:0;">Deploy scheduled for 14:00 UTC.</p>
      </section>
    </div>
  `

  const button = mount.querySelector("button")
  const panel = mount.querySelector(".rf-popover-panel")
  if (!(button instanceof HTMLButtonElement && panel instanceof HTMLElement)) return

  button.addEventListener("click", () => {
    const next = panel.hidden
    panel.hidden = !next
    button.setAttribute("aria-expanded", String(next))
  })
}

function mountTooltipDemo(mount) {
  mount.innerHTML = `
    <span class="rf-tooltip-wrap">
      <button class="docs-button" type="button" data-variant="outline" aria-describedby="tooltip-demo">Hover me</button>
      <span id="tooltip-demo" class="rf-tooltip" role="tooltip" hidden>Additional context for this action.</span>
    </span>
  `

  const trigger = mount.querySelector("button")
  const tooltip = mount.querySelector(".rf-tooltip")
  if (!(trigger instanceof HTMLButtonElement && tooltip instanceof HTMLElement)) return

  const show = () => {
    tooltip.hidden = false
  }
  const hide = () => {
    tooltip.hidden = true
  }

  trigger.addEventListener("mouseenter", show)
  trigger.addEventListener("mouseleave", hide)
  trigger.addEventListener("focus", show)
  trigger.addEventListener("blur", hide)
}

function mountDropdownDemo(mount) {
  mount.innerHTML = `
    <div class="rf-dropdown docs-menu">
      <button class="docs-button" data-variant="outline" type="button" aria-haspopup="menu" aria-expanded="false">Bulk actions</button>
      <ul class="docs-menu-list" role="menu" hidden>
        <li role="none"><button class="docs-menu-item" type="button" role="menuitem">Archive selected</button></li>
        <li role="none"><button class="docs-menu-item" type="button" role="menuitem">Mark reviewed</button></li>
      </ul>
    </div>
  `

  const trigger = mount.querySelector("button")
  const menu = mount.querySelector("[role='menu']")
  if (!(trigger instanceof HTMLButtonElement && menu instanceof HTMLElement)) return

  const menuItems = Array.from(menu.querySelectorAll("[role='menuitem']")).filter(
    (item) => item instanceof HTMLButtonElement,
  )

  const setOpen = (next, restoreFocus = false) => {
    menu.hidden = !next
    trigger.setAttribute("aria-expanded", String(next))

    if (!next && restoreFocus) {
      trigger.focus()
    }
  }

  trigger.addEventListener("click", () => {
    setOpen(menu.hidden)
  })

  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return

    event.preventDefault()
    if (menu.hidden) {
      setOpen(true)
    }

    const targetIndex = event.key === "ArrowDown" ? 0 : menuItems.length - 1
    const target = menuItems[targetIndex]
    if (target instanceof HTMLButtonElement) {
      target.focus()
    }
  })

  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return
    event.preventDefault()
    setOpen(false, true)
  })

  for (const item of menuItems) {
    item.addEventListener("click", () => {
      setOpen(false, true)
    })
  }

  document.addEventListener("pointerdown", (event) => {
    if (menu.hidden) return

    const target = event.target
    if (!(target instanceof Node)) return
    if (mount.contains(target)) return

    setOpen(false)
  })
}

function mountFieldDemo(mount) {
  mount.innerHTML = `
    <form novalidate style="display:grid;gap:.5rem;max-width:24rem;">
      <label for="demo-email">Email</label>
      <input id="demo-email" class="docs-input" type="email" placeholder="you@example.com" />
      <p class="docs-error" hidden></p>
      <button class="docs-button" type="submit">Submit</button>
    </form>
  `
  const form = mount.querySelector("form")
  const input = mount.querySelector("input")
  const error = mount.querySelector(".docs-error")
  if (!(form && input && error instanceof HTMLElement)) return

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const value = input.value.trim()
    const valid = /.+@.+\..+/.test(value)
    if (!valid) {
      error.hidden = false
      error.textContent = "Enter a valid email address."
      input.setAttribute("aria-invalid", "true")
      return
    }

    error.hidden = false
    error.textContent = `Submitted: ${value}`
    input.removeAttribute("aria-invalid")
  })
}

function mountFieldStructureDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.35rem;max-width:24rem;">
      <label for="field-demo-name">Name</label>
      <input id="field-demo-name" class="docs-input" type="text" aria-describedby="field-demo-description field-demo-error" aria-invalid="true" value="" />
      <p id="field-demo-description" style="margin:0;font-size:.875rem;">This demonstrates description wiring.</p>
      <p id="field-demo-error" class="docs-error" style="margin:0;">Name is required.</p>
    </div>
  `
}

function mountFormLayoutDemo(mount) {
  mount.innerHTML = `
    <form style="display:grid;gap:.75rem;max-width:34rem;">
      <h3 style="margin:0;">Profile settings</h3>
      <p style="margin:0;color:#475569;">Update your public profile information.</p>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem;">
        <label style="display:grid;gap:.3rem;">First name<input class="docs-input" type="text" value="Ada" /></label>
        <label style="display:grid;gap:.3rem;">Last name<input class="docs-input" type="text" value="Lovelace" /></label>
      </div>
      <div style="display:flex;gap:.5rem;justify-content:flex-end;">
        <button class="docs-button" type="button" data-variant="outline">Cancel</button>
        <button class="docs-button" type="submit">Save changes</button>
      </div>
    </form>
  `
}

function mountFormFieldsetDemo(mount) {
  mount.innerHTML = `
    <fieldset style="margin:0;border:1px solid #cbd5e1;border-radius:12px;padding:.75rem;display:grid;gap:.6rem;max-width:34rem;">
      <legend style="padding:0 .35rem;font-weight:600;">Notification preferences</legend>
      <p style="margin:0;color:#475569;font-size:.9rem;">Choose where account updates are sent.</p>
      <label style="display:flex;gap:.5rem;align-items:center;"><input type="checkbox" checked /> Email alerts</label>
      <label style="display:flex;gap:.5rem;align-items:center;"><input type="checkbox" /> SMS alerts</label>
    </fieldset>
  `
}

function mountFormMessageDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.45rem;max-width:28rem;">
      <p style="margin:0;font-size:.875rem;color:#475569;">Password must include at least 12 characters.</p>
      <p style="margin:0;font-size:.875rem;color:#0369a1;" role="status" aria-live="polite">Password strength improved.</p>
      <p style="margin:0;font-size:.875rem;color:#c2410c;" role="status" aria-live="polite">Password will expire in 3 days.</p>
      <p style="margin:0;font-size:.875rem;color:#dc2626;" role="alert" aria-live="assertive">Password is required.</p>
    </div>
  `
}

function mountCheckboxDemo(mount) {
  mount.innerHTML = `
    <form style="display:grid;gap:.5rem;">
      <label style="display:flex;gap:.5rem;align-items:center;">
        <input id="checkbox-newsletter" type="checkbox" name="newsletter" value="on" />
        Subscribe to newsletter
      </label>
      <p style="margin:0;font-size:.875rem;" id="checkbox-state">Submitted value when checked: on</p>
    </form>
  `
  const checkbox = mount.querySelector("#checkbox-newsletter")
  const state = mount.querySelector("#checkbox-state")
  if (!(checkbox instanceof HTMLInputElement && state instanceof HTMLElement)) return

  checkbox.addEventListener("change", () => {
    state.textContent = checkbox.checked ? `Submitted value when checked: ${checkbox.value}` : "Currently unchecked"
  })
}

function mountRadioDemo(mount) {
  mount.innerHTML = `
    <fieldset style="display:grid;gap:.35rem;max-width:24rem;">
      <legend>Delivery speed</legend>
      <label><input type="radio" name="shipping" value="standard" checked /> Standard</label>
      <label><input type="radio" name="shipping" value="express" /> Express</label>
      <label><input type="radio" name="shipping" value="overnight" /> Overnight</label>
      <p id="radio-state" style="margin:.25rem 0 0;font-size:.875rem;">Selected: standard</p>
    </fieldset>
  `
  const inputs = Array.from(mount.querySelectorAll("input[type='radio']"))
  const state = mount.querySelector("#radio-state")
  if (!(state instanceof HTMLElement)) return

  for (const input of inputs) {
    if (!(input instanceof HTMLInputElement)) continue
    input.addEventListener("change", () => {
      if (!input.checked) return
      state.textContent = `Selected: ${input.value}`
    })
  }
}

function mountCascaderDemo(mount) {
  mount.innerHTML = `
    <section class="rf-cascader" data-open="false">
      <button id="cascader-trigger" class="rf-cascader-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
        <span id="cascader-label" class="rf-cascader-trigger-label">Engineering / Platform / API</span>
        <span class="rf-cascader-trigger-icon" aria-hidden="true">▾</span>
      </button>
      <div id="cascader-panel" class="rf-cascader-panel" role="listbox" hidden>
        <div class="rf-cascader-columns">
          <ul class="rf-cascader-column">
            <li><button class="rf-cascader-option" data-level="0" data-value="engineering" data-active="true"><span class="rf-cascader-option-label">Engineering</span><span class="rf-cascader-option-icon">›</span></button></li>
            <li><button class="rf-cascader-option" data-level="0" data-value="design"><span class="rf-cascader-option-label">Design</span></button></li>
          </ul>
          <ul class="rf-cascader-column" id="cascader-col-1">
            <li><button class="rf-cascader-option" data-level="1" data-parent="engineering" data-value="platform" data-active="true"><span class="rf-cascader-option-label">Platform</span><span class="rf-cascader-option-icon">›</span></button></li>
            <li><button class="rf-cascader-option" data-level="1" data-parent="engineering" data-value="infra"><span class="rf-cascader-option-label">Infra</span></button></li>
          </ul>
          <ul class="rf-cascader-column" id="cascader-col-2">
            <li><button class="rf-cascader-option" data-level="2" data-parent="platform" data-value="api" data-selected="true"><span class="rf-cascader-option-label">API</span></button></li>
            <li><button class="rf-cascader-option" data-level="2" data-parent="platform" data-value="jobs"><span class="rf-cascader-option-label">Jobs</span></button></li>
          </ul>
        </div>
      </div>
    </section>
    <p id="cascader-state" style="margin:.45rem 0 0;font-size:.85rem;color:#475569;">Selected: engineering / platform / api</p>
  `

  const trigger = mount.querySelector("#cascader-trigger")
  const label = mount.querySelector("#cascader-label")
  const panel = mount.querySelector("#cascader-panel")
  const state = mount.querySelector("#cascader-state")
  const col1 = mount.querySelector("#cascader-col-1")
  const col2 = mount.querySelector("#cascader-col-2")
  if (
    !(
      trigger instanceof HTMLButtonElement &&
      label instanceof HTMLElement &&
      panel instanceof HTMLElement &&
      state instanceof HTMLElement &&
      col1 instanceof HTMLElement &&
      col2 instanceof HTMLElement
    )
  ) {
    return
  }

  const setOpen = (nextOpen) => {
    panel.hidden = !nextOpen
    trigger.setAttribute("aria-expanded", nextOpen ? "true" : "false")
  }

  trigger.addEventListener("click", () => setOpen(panel.hidden))

  const selectButtons = () => Array.from(mount.querySelectorAll(".rf-cascader-option"))
  const levelButtons = (level) =>
    selectButtons().filter(
      (el) =>
        el instanceof HTMLButtonElement &&
        Number(el.dataset.level || "0") === level &&
        !(el.closest(".rf-cascader-column") instanceof HTMLElement && el.closest(".rf-cascader-column").hidden),
    )
  const activeAtLevel = (level) =>
    levelButtons(level).find((el) => el instanceof HTMLButtonElement && el.dataset.active === "true")
  const setColumnVisibility = () => {
    const level0 = mount.querySelector("button[data-level='0'][data-active='true']")
    const level1 = mount.querySelector("button[data-level='1'][data-active='true']")

    const level0Value = level0 instanceof HTMLButtonElement ? level0.dataset.value : undefined
    const level1Value = level1 instanceof HTMLButtonElement ? level1.dataset.value : undefined

    const showLevel1 = level0Value === "engineering"
    const showLevel2 = showLevel1 && level1Value === "platform"

    col1.hidden = !showLevel1
    col2.hidden = !showLevel2
  }

  const clearActiveFromLevel = (fromLevel) => {
    for (const other of selectButtons()) {
      if (!(other instanceof HTMLButtonElement)) continue
      const otherLevel = Number(other.dataset.level || "0")
      if (otherLevel >= fromLevel) {
        other.dataset.active = "false"
      }
    }
  }

  const setActive = (level, button) => {
    for (const other of selectButtons()) {
      if (!(other instanceof HTMLButtonElement)) continue
      const otherLevel = Number(other.dataset.level || "0")
      if (otherLevel === level) {
        other.dataset.active = other === button ? "true" : "false"
      }
    }
  }

  const syncDefaultsAfterActivate = (level, value) => {
    if (level === 0) {
      clearActiveFromLevel(1)
      if (value === "engineering") {
        const platform = mount.querySelector("button[data-level='1'][data-value='platform']")
        if (platform instanceof HTMLButtonElement) platform.dataset.active = "true"
      }
    }

    if (level === 1) {
      clearActiveFromLevel(2)
      if (value === "platform") {
        const api = mount.querySelector("button[data-level='2'][data-value='api']")
        if (api instanceof HTMLButtonElement) api.dataset.active = "true"
      }
    }

    setColumnVisibility()
  }

  const commitSelection = (button, value) => {
    const active = selectButtons()
      .filter((el) => el instanceof HTMLButtonElement && el.dataset.active === "true")
      .map((el) => (el instanceof HTMLButtonElement ? el.dataset.value : undefined))
      .filter(Boolean)

    const path = active.join(" / ")
    label.textContent = path || value
    state.textContent = `Selected: ${path || value}`

    for (const other of selectButtons()) {
      if (!(other instanceof HTMLButtonElement)) continue
      other.dataset.selected = other === button ? "true" : "false"
    }

    setOpen(false)
    trigger.focus()
  }

  const moveInLevel = (level, startButton, direction) => {
    const buttons = levelButtons(level)
    if (buttons.length === 0) return
    const start = Math.max(0, buttons.indexOf(startButton))
    const next = (start + direction + buttons.length) % buttons.length
    const candidate = buttons[next]
    if (candidate instanceof HTMLButtonElement) candidate.focus()
  }

  const focusLevel = (level) => {
    const active = activeAtLevel(level)
    if (active instanceof HTMLButtonElement) {
      active.focus()
      return
    }

    const first = levelButtons(level)[0]
    if (first instanceof HTMLButtonElement) first.focus()
  }

  const activateButton = (button, shouldCommit = true) => {
    const level = Number(button.dataset.level || "0")
    const value = button.dataset.value
    if (!value) return

    setActive(level, button)
    syncDefaultsAfterActivate(level, value)

    const isLeaf = !button.querySelector(".rf-cascader-option-icon")
    if (shouldCommit && (level === 2 || isLeaf || (level === 0 && value === "design"))) {
      commitSelection(button, value)
    }
  }

  for (const button of selectButtons()) {
    if (!(button instanceof HTMLButtonElement)) continue

    button.addEventListener("click", () => {
      activateButton(button)
    })

    button.addEventListener("keydown", (event) => {
      const level = Number(button.dataset.level || "0")
      if (event.key === "ArrowDown") {
        event.preventDefault()
        moveInLevel(level, button, 1)
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        moveInLevel(level, button, -1)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        activateButton(button, false)
        focusLevel(level + 1)
      } else if (event.key === "ArrowLeft") {
        if (level === 0) return
        event.preventDefault()
        focusLevel(level - 1)
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        activateButton(button)
      } else if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        trigger.focus()
      }
    })
  }

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault()
      if (panel.hidden) {
        setOpen(true)
        const level = col2.hidden ? (col1.hidden ? 0 : 1) : 2
        focusLevel(level)
      }
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
    }
  })

  document.addEventListener("pointerdown", (event) => {
    if (panel.hidden) return
    const target = event.target
    if (!(target instanceof Node)) return
    if (mount.contains(target)) return
    setOpen(false)
  })

  mount.addEventListener("focusout", (event) => {
    const next = event.relatedTarget
    if (next instanceof Node && mount.contains(next)) return

    setTimeout(() => {
      if (panel.hidden) return
      const active = document.activeElement
      if (active instanceof Node && mount.contains(active)) return
      setOpen(false)
    }, 0)
  })

  setColumnVisibility()
}

function mountSelectDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.35rem;max-width:20rem;">
      <label for="select-demo">Team</label>
      <select id="select-demo" class="docs-input">
        <option value="design">Design</option>
        <option value="engineering">Engineering</option>
        <option value="operations">Operations</option>
      </select>
      <p id="select-state" style="margin:.25rem 0 0;font-size:.875rem;">Selected: design</p>
    </div>
  `
  const select = mount.querySelector("#select-demo")
  const state = mount.querySelector("#select-state")
  if (!(select instanceof HTMLSelectElement && state instanceof HTMLElement)) return

  select.addEventListener("change", () => {
    state.textContent = `Selected: ${select.value}`
  })
}

function mountSliderDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.35rem;max-width:22rem;">
      <label for="slider-demo">Volume</label>
      <input id="slider-demo" class="rf-slider" type="range" min="0" max="100" step="5" value="35" />
      <p id="slider-state" style="margin:.25rem 0 0;font-size:.875rem;">Current value: 35</p>
    </div>
  `

  const input = mount.querySelector("#slider-demo")
  const state = mount.querySelector("#slider-state")
  if (!(input instanceof HTMLInputElement && state instanceof HTMLElement)) return

  const sync = () => {
    state.textContent = `Current value: ${input.value}`
  }

  input.addEventListener("input", sync)
  sync()
}

function mountRangeSliderDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.4rem;max-width:24rem;">
      <label>Budget range</label>
      <div class="rf-range-slider" style="--rf-range-start: 25%; --rf-range-end: 75%;">
        <div class="rf-range-slider-track" aria-hidden="true"></div>
        <input class="rf-range-slider-input" id="range-slider-start" type="range" min="0" max="100" step="5" value="25" aria-label="Minimum budget" />
        <input class="rf-range-slider-input" id="range-slider-end" type="range" min="0" max="100" step="5" value="75" aria-label="Maximum budget" />
      </div>
      <p id="range-slider-state" style="margin:0;font-size:.85rem;color:#475569;">Selected: 25 to 75</p>
    </div>
  `

  const wrapper = mount.querySelector(".rf-range-slider")
  const startInput = mount.querySelector("#range-slider-start")
  const endInput = mount.querySelector("#range-slider-end")
  const state = mount.querySelector("#range-slider-state")
  if (
    !(
      wrapper instanceof HTMLElement &&
      startInput instanceof HTMLInputElement &&
      endInput instanceof HTMLInputElement &&
      state instanceof HTMLElement
    )
  ) {
    return
  }

  const sync = () => {
    let start = Number(startInput.value)
    let end = Number(endInput.value)
    if (start > end) {
      if (document.activeElement === startInput) end = start
      else start = end
    }

    startInput.value = String(start)
    endInput.value = String(end)

    wrapper.style.setProperty("--rf-range-start", `${start}%`)
    wrapper.style.setProperty("--rf-range-end", `${end}%`)
    state.textContent = `Selected: ${start} to ${end}`
  }

  startInput.addEventListener("input", sync)
  endInput.addEventListener("input", sync)
  sync()
}

function mountProgressDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.45rem;max-width:22rem;">
      <label for="progress-demo-slider">Upload progress</label>
      <input id="progress-demo-slider" class="rf-slider" type="range" min="0" max="100" step="5" value="35" />
      <div class="rf-progress-wrap">
        <div class="rf-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="35">
          <div class="rf-progress-bar" style="width:35%"></div>
        </div>
        <div id="progress-demo-value" class="rf-progress-value">35%</div>
      </div>
    </div>
  `

  const slider = mount.querySelector("#progress-demo-slider")
  const progress = mount.querySelector("[role='progressbar']")
  const bar = mount.querySelector(".rf-progress-bar")
  const value = mount.querySelector("#progress-demo-value")
  if (!(slider instanceof HTMLInputElement && progress instanceof HTMLElement && bar instanceof HTMLElement && value)) {
    return
  }

  const sync = () => {
    const next = Number(slider.value)
    progress.setAttribute("aria-valuenow", String(next))
    bar.style.width = `${next}%`
    value.textContent = `${next}%`
  }

  slider.addEventListener("input", sync)
  sync()
}

function mountSkeletonDemo(mount) {
  mount.innerHTML = `
    <div class="rf-skeleton" data-animated="true" aria-hidden="true" style="max-width:20rem;">
      <span class="rf-skeleton-line"></span>
      <span class="rf-skeleton-line"></span>
      <span class="rf-skeleton-line" style="width:74%"></span>
    </div>
  `
}

function mountSpinnerDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.6rem;">
      <span class="rf-spinner" data-size="sm" role="status" aria-live="polite"><span class="rf-spinner-dot" aria-hidden="true"></span><span class="rf-spinner-label">Loading tiny task</span></span>
      <span class="rf-spinner" data-size="md" role="status" aria-live="polite"><span class="rf-spinner-dot" aria-hidden="true"></span><span class="rf-spinner-label">Loading defaults</span></span>
      <span class="rf-spinner" data-size="lg" role="status" aria-live="polite"><span class="rf-spinner-dot" aria-hidden="true"></span><span class="rf-spinner-label">Loading large sync</span></span>
    </div>
  `
}

function mountStepsDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.6rem;max-width:28rem;">
      <nav aria-label="Progress" class="rf-steps">
        <ol class="rf-steps-list">
          <li class="rf-steps-item" data-status="current">
            <span class="rf-steps-marker" aria-hidden="true">1</span>
            <span class="rf-steps-content">
              <span class="rf-steps-label" aria-current="step">Account</span>
              <span class="rf-steps-description">Create your organization profile.</span>
            </span>
          </li>
          <li class="rf-steps-item" data-status="upcoming">
            <span class="rf-steps-marker" aria-hidden="true">2</span>
            <span class="rf-steps-content">
              <span class="rf-steps-label">Team</span>
              <span class="rf-steps-description">Invite collaborators and set roles.</span>
            </span>
          </li>
          <li class="rf-steps-item" data-status="upcoming">
            <span class="rf-steps-marker" aria-hidden="true">3</span>
            <span class="rf-steps-content">
              <span class="rf-steps-label">Confirm</span>
              <span class="rf-steps-description">Review and launch your workspace.</span>
            </span>
          </li>
        </ol>
      </nav>
      <div style="display:flex;gap:.5rem;">
        <button class="docs-button" type="button" data-dir="prev" data-variant="outline">Previous</button>
        <button class="docs-button" type="button" data-dir="next">Next</button>
      </div>
    </div>
  `

  const items = Array.from(mount.querySelectorAll(".rf-steps-item"))
  const prev = mount.querySelector("button[data-dir='prev']")
  const next = mount.querySelector("button[data-dir='next']")
  if (!(prev instanceof HTMLButtonElement && next instanceof HTMLButtonElement)) return

  let current = 0

  const sync = () => {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i]
      if (!(item instanceof HTMLElement)) continue
      const label = item.querySelector(".rf-steps-label")
      if (!(label instanceof HTMLElement)) continue

      const status = i < current ? "complete" : i === current ? "current" : "upcoming"
      item.dataset.status = status
      if (status === "current") label.setAttribute("aria-current", "step")
      else label.removeAttribute("aria-current")
    }

    prev.disabled = current <= 0
    next.disabled = current >= items.length - 1
  }

  prev.addEventListener("click", () => {
    current = Math.max(0, current - 1)
    sync()
  })

  next.addEventListener("click", () => {
    current = Math.min(items.length - 1, current + 1)
    sync()
  })

  sync()
}

function mountNumberInputDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.35rem;max-width:18rem;">
      <label for="number-input-demo">Seats</label>
      <input id="number-input-demo" class="docs-input" type="number" min="1" max="25" step="1" value="4" />
      <p id="number-input-state" style="margin:.25rem 0 0;font-size:.875rem;">Current value: 4</p>
    </div>
  `

  const input = mount.querySelector("#number-input-demo")
  const state = mount.querySelector("#number-input-state")
  if (!(input instanceof HTMLInputElement && state instanceof HTMLElement)) return

  const sync = () => {
    state.textContent = `Current value: ${input.value || "(empty)"}`
  }

  input.addEventListener("input", sync)
  sync()
}

function mountPaginationDemo(mount) {
  mount.innerHTML = `
    <nav class="rf-pagination" aria-label="Pagination demo">
      <button type="button" class="docs-button" data-variant="outline" data-page="prev">Previous</button>
      <ol class="rf-pagination-list">
        <li><button type="button" class="rf-pagination-page rf-focus-ring" data-page="1" data-current="false">1</button></li>
        <li><button type="button" class="rf-pagination-page rf-focus-ring" data-page="2" data-current="true" aria-current="page">2</button></li>
        <li><button type="button" class="rf-pagination-page rf-focus-ring" data-page="3" data-current="false">3</button></li>
      </ol>
      <button type="button" class="docs-button" data-variant="outline" data-page="next">Next</button>
    </nav>
    <p id="pagination-state" style="margin:.4rem 0 0;font-size:.875rem;">Current page: 2</p>
  `

  const allButtons = Array.from(mount.querySelectorAll("button[data-page]"))
  const state = mount.querySelector("#pagination-state")
  if (!(state instanceof HTMLElement)) return

  let page = 2
  const total = 3

  const sync = () => {
    for (const button of allButtons) {
      if (!(button instanceof HTMLButtonElement)) continue
      const value = button.dataset.page
      if (!value || value === "prev" || value === "next") {
        if (value === "prev") button.disabled = page <= 1
        if (value === "next") button.disabled = page >= total
        continue
      }

      const numeric = Number(value)
      const current = numeric === page
      button.dataset.current = current ? "true" : "false"
      if (current) button.setAttribute("aria-current", "page")
      else button.removeAttribute("aria-current")
    }

    state.textContent = `Current page: ${page}`
  }

  for (const button of allButtons) {
    if (!(button instanceof HTMLButtonElement)) continue
    button.addEventListener("click", () => {
      const value = button.dataset.page
      if (!value) return
      if (value === "prev") page = Math.max(1, page - 1)
      else if (value === "next") page = Math.min(total, page + 1)
      else page = Number(value)
      sync()
    })
  }

  sync()
}

function mountSwitchDemo(mount) {
  mount.innerHTML = `
    <label class="rf-switch">
      <input class="rf-switch-input" id="switch-demo" type="checkbox" role="switch" value="on" />
      <span class="rf-switch-control" aria-hidden="true"><span class="rf-switch-thumb"></span></span>
      <span class="rf-switch-label">Enable release notifications</span>
    </label>
    <p id="switch-state" style="margin:.4rem 0 0;font-size:.875rem;">Currently off</p>
  `

  const input = mount.querySelector("#switch-demo")
  const state = mount.querySelector("#switch-state")
  if (!(input instanceof HTMLInputElement && state instanceof HTMLElement)) return

  const sync = () => {
    state.textContent = input.checked ? `Currently on (submitted value: ${input.value})` : "Currently off"
  }

  input.addEventListener("change", sync)
  sync()
}

function mountTransferDemo(mount) {
  mount.innerHTML = `
    <section class="rf-transfer">
      <div class="rf-transfer-panel" data-side="left">
        <header class="rf-transfer-panel-header"><strong>Available</strong><span id="transfer-left-count">3</span></header>
        <ul class="rf-transfer-list" id="transfer-left-list">
          <li class="rf-transfer-item" data-key="alerts"><label class="rf-transfer-item-label"><input class="rf-transfer-item-check" type="checkbox" /><span class="rf-transfer-item-text"><span class="rf-transfer-item-title">Alerts</span><span class="rf-transfer-item-description">Incident notifications</span></span></label></li>
          <li class="rf-transfer-item" data-key="billing"><label class="rf-transfer-item-label"><input class="rf-transfer-item-check" type="checkbox" /><span class="rf-transfer-item-text"><span class="rf-transfer-item-title">Billing</span><span class="rf-transfer-item-description">Invoices and usage</span></span></label></li>
          <li class="rf-transfer-item" data-key="security"><label class="rf-transfer-item-label"><input class="rf-transfer-item-check" type="checkbox" /><span class="rf-transfer-item-text"><span class="rf-transfer-item-title">Security</span><span class="rf-transfer-item-description">Access events</span></span></label></li>
        </ul>
      </div>
      <div class="rf-transfer-ops" aria-label="Transfer actions">
        <button class="docs-button" type="button" id="transfer-right" data-variant="outline">&gt;</button>
        <button class="docs-button" type="button" id="transfer-left" data-variant="outline">&lt;</button>
      </div>
      <div class="rf-transfer-panel" data-side="right">
        <header class="rf-transfer-panel-header"><strong>Selected</strong><span id="transfer-right-count">0</span></header>
        <ul class="rf-transfer-list" id="transfer-right-list"></ul>
      </div>
    </section>
  `

  const leftList = mount.querySelector("#transfer-left-list")
  const rightList = mount.querySelector("#transfer-right-list")
  const moveRight = mount.querySelector("#transfer-right")
  const moveLeft = mount.querySelector("#transfer-left")
  const leftCount = mount.querySelector("#transfer-left-count")
  const rightCount = mount.querySelector("#transfer-right-count")

  if (
    !(
      leftList instanceof HTMLElement &&
      rightList instanceof HTMLElement &&
      moveRight instanceof HTMLButtonElement &&
      moveLeft instanceof HTMLButtonElement &&
      leftCount instanceof HTMLElement &&
      rightCount instanceof HTMLElement
    )
  ) {
    return
  }

  const selectedItems = (container) =>
    Array.from(container.querySelectorAll(".rf-transfer-item")).filter((item) => {
      if (!(item instanceof HTMLElement)) return false
      const check = item.querySelector("input[type='checkbox']")
      return check instanceof HTMLInputElement && check.checked
    })

  const updateCounts = () => {
    leftCount.textContent = String(leftList.querySelectorAll(".rf-transfer-item").length)
    rightCount.textContent = String(rightList.querySelectorAll(".rf-transfer-item").length)
  }

  const resetChecks = (container) => {
    for (const input of container.querySelectorAll("input[type='checkbox']")) {
      if (!(input instanceof HTMLInputElement)) continue
      input.checked = false
    }
  }

  moveRight.addEventListener("click", () => {
    const items = selectedItems(leftList)
    for (const item of items) {
      rightList.append(item)
    }
    resetChecks(rightList)
    updateCounts()
  })

  moveLeft.addEventListener("click", () => {
    const items = selectedItems(rightList)
    for (const item of items) {
      leftList.append(item)
    }
    resetChecks(leftList)
    updateCounts()
  })

  updateCounts()
}

function mountTextareaDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.35rem;max-width:24rem;">
      <label for="textarea-demo">Release notes</label>
      <textarea id="textarea-demo" class="rf-input-base rf-textarea-base rf-focus-ring" rows="4" maxlength="120" placeholder="Add release summary"></textarea>
      <p id="textarea-count" style="margin:0;font-size:.825rem;color:#475569;">0 / 120 characters</p>
    </div>
  `

  const textarea = mount.querySelector("#textarea-demo")
  const counter = mount.querySelector("#textarea-count")
  if (!(textarea instanceof HTMLTextAreaElement && counter instanceof HTMLElement)) return

  const sync = () => {
    counter.textContent = `${textarea.value.length} / 120 characters`
  }

  textarea.addEventListener("input", sync)
  sync()
}

function mountTimePickerDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.35rem;max-width:18rem;">
      <label for="time-picker-demo">Deployment time</label>
      <input id="time-picker-demo" class="rf-input-base rf-focus-ring rf-time-picker" type="time" min="08:00" max="20:00" step="900" value="09:30" />
      <p id="time-picker-state" style="margin:0;font-size:.875rem;color:#475569;">Selected: 09:30</p>
    </div>
  `

  const input = mount.querySelector("#time-picker-demo")
  const state = mount.querySelector("#time-picker-state")
  if (!(input instanceof HTMLInputElement && state instanceof HTMLElement)) return

  const sync = () => {
    state.textContent = input.value ? `Selected: ${input.value}` : "No time selected"
  }

  input.addEventListener("input", sync)
  sync()
}

function mountTimelineDemo(mount) {
  mount.innerHTML = `
    <section class="rf-timeline-wrap">
      <ol class="rf-timeline" role="list">
        <li class="rf-timeline-item" data-tone="success">
          <span class="rf-timeline-marker" aria-hidden="true"></span>
          <div class="rf-timeline-content">
            <p class="rf-timeline-title">Build completed</p>
            <p class="rf-timeline-description">All checks passed for release candidate.</p>
            <p class="rf-timeline-time">10:24</p>
          </div>
        </li>
        <li class="rf-timeline-item" data-tone="warning">
          <span class="rf-timeline-marker" aria-hidden="true"></span>
          <div class="rf-timeline-content">
            <p class="rf-timeline-title">Pending approval</p>
            <p class="rf-timeline-description">Awaiting production rollout approval.</p>
            <p class="rf-timeline-time">10:31</p>
          </div>
        </li>
        <li class="rf-timeline-item" data-tone="neutral" data-pending="true">
          <span class="rf-timeline-marker" aria-hidden="true"></span>
          <div class="rf-timeline-content">
            <p class="rf-timeline-title">Waiting for deployment window</p>
          </div>
        </li>
      </ol>
    </section>
  `
}

function mountTabsDemo(mount) {
  mount.innerHTML = `
    <section>
      <div role="tablist" aria-label="Demo tabs" style="display:flex;gap:.5rem;flex-wrap:wrap;">
        <button class="docs-button" type="button" role="tab" aria-selected="true" aria-controls="panel-overview" id="tab-overview">Overview</button>
        <button class="docs-button" type="button" role="tab" aria-selected="false" aria-controls="panel-specs" id="tab-specs" data-variant="outline">Specs</button>
        <button class="docs-button" type="button" role="tab" aria-selected="false" aria-controls="panel-notes" id="tab-notes" data-variant="outline">Notes</button>
        <button class="docs-button" type="button" role="tab" aria-selected="false" aria-controls="panel-alerts" id="tab-alerts" data-variant="outline">Alerts</button>
        <details id="tabs-overflow" style="position:relative;">
          <summary class="docs-button" data-variant="outline" style="list-style:none;">More (2)</summary>
          <div style="position:absolute;top:calc(100% + .35rem);right:0;display:grid;gap:.2rem;background:#fff;border:1px solid #cbd5e1;border-radius:.5rem;padding:.3rem;min-width:9rem;z-index:2;">
            <button class="docs-button" type="button" role="tab" aria-selected="false" aria-controls="panel-settings" id="tab-settings" data-variant="outline">Settings</button>
            <button class="docs-button" type="button" role="tab" aria-selected="false" aria-controls="panel-history" id="tab-history" data-variant="outline">History</button>
          </div>
        </details>
      </div>
      <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" style="margin-top:.75rem;">Overview content</div>
      <div id="panel-specs" role="tabpanel" aria-labelledby="tab-specs" hidden style="margin-top:.75rem;">Specs content</div>
      <div id="panel-notes" role="tabpanel" aria-labelledby="tab-notes" hidden style="margin-top:.75rem;">Notes content</div>
      <div id="panel-alerts" role="tabpanel" aria-labelledby="tab-alerts" hidden style="margin-top:.75rem;">Alerts content</div>
      <div id="panel-settings" role="tabpanel" aria-labelledby="tab-settings" hidden style="margin-top:.75rem;">Settings content</div>
      <div id="panel-history" role="tabpanel" aria-labelledby="tab-history" hidden style="margin-top:.75rem;">History content</div>
    </section>
  `

  const tabs = Array.from(mount.querySelectorAll("[role='tab']"))
  const panels = Array.from(mount.querySelectorAll("[role='tabpanel']"))
  const overflow = mount.querySelector("#tabs-overflow")

  const activate = (tabId) => {
    for (const tab of tabs) {
      if (!(tab instanceof HTMLButtonElement)) continue
      const active = tab.id === tabId
      tab.setAttribute("aria-selected", String(active))
      tab.dataset.variant = active ? "solid" : "outline"
    }

    for (const panel of panels) {
      if (!(panel instanceof HTMLElement)) continue
      panel.hidden = panel.getAttribute("aria-labelledby") !== tabId
    }
  }

  for (const tab of tabs) {
    if (!(tab instanceof HTMLButtonElement)) continue
    tab.addEventListener("click", () => {
      activate(tab.id)
      if (overflow instanceof HTMLDetailsElement) overflow.open = false
    })
  }
}

function mountDialogDemo(mount) {
  mount.innerHTML = `
    <button class="docs-button" type="button" id="open-dialog">Open dialog</button>
    <div class="docs-overlay" hidden>
      <section class="docs-panel" role="dialog" aria-modal="true" aria-labelledby="docs-dialog-title" tabindex="-1">
        <h3 id="docs-dialog-title" style="margin:0;">Dialog title</h3>
        <p style="margin:0;">This mirrors the controlled open + onClose contract.</p>
        <div style="display:flex;gap:.5rem;justify-content:flex-end;">
          <button class="docs-button docs-button" data-variant="outline" type="button" id="cancel-dialog">Cancel</button>
          <button class="docs-button" type="button" id="confirm-dialog">Confirm</button>
        </div>
      </section>
    </div>
  `

  const open = mount.querySelector("#open-dialog")
  const overlay = mount.querySelector(".docs-overlay")
  const panel = mount.querySelector(".docs-panel")
  const cancel = mount.querySelector("#cancel-dialog")
  const confirm = mount.querySelector("#confirm-dialog")
  if (!(open && overlay instanceof HTMLElement && panel instanceof HTMLElement && cancel && confirm)) return

  let previouslyFocused = null

  const close = () => {
    overlay.hidden = true
    document.body.style.overflow = ""
    if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
  }

  open.addEventListener("click", () => {
    previouslyFocused = document.activeElement
    overlay.hidden = false
    document.body.style.overflow = "hidden"
    panel.focus()
  })

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close()
  })

  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close()
  })

  cancel.addEventListener("click", close)
  confirm.addEventListener("click", close)
}

function mountDrawerDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.5rem;justify-items:start;">
      <button class="docs-button" type="button" id="open-drawer">Open drawer</button>
      <p style="margin:0;font-size:.85rem;color:#475569;">Last close reason: <strong id="drawer-reason">none</strong></p>
      <div class="docs-overlay docs-drawer-backdrop" id="drawer-overlay" hidden>
        <section id="drawer-panel" class="docs-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="docs-drawer-title" tabindex="-1">
          <header class="docs-drawer-header">
            <h3 id="docs-drawer-title">Filter options</h3>
          </header>
          <div class="docs-drawer-body">
            <label style="display:flex;gap:.45rem;align-items:center;"><input type="checkbox" checked /> Open issues only</label>
            <label style="display:flex;gap:.45rem;align-items:center;"><input type="checkbox" /> Include archived</label>
            <label style="display:flex;gap:.45rem;align-items:center;"><input type="checkbox" checked /> Assigned to me</label>
          </div>
          <div class="docs-drawer-footer">
            <button class="docs-button" data-variant="outline" type="button" id="reset-drawer">Reset</button>
            <button class="docs-button" data-variant="outline" type="button" id="close-drawer">Close</button>
            <button class="docs-button" type="button" id="apply-drawer">Apply</button>
          </div>
        </section>
      </div>
    </div>
  `

  const open = mount.querySelector("#open-drawer")
  const overlay = mount.querySelector("#drawer-overlay")
  const panel = mount.querySelector("#drawer-panel")
  const closeButton = mount.querySelector("#close-drawer")
  const resetButton = mount.querySelector("#reset-drawer")
  const applyButton = mount.querySelector("#apply-drawer")
  const reason = mount.querySelector("#drawer-reason")
  if (
    !(
      open &&
      overlay instanceof HTMLElement &&
      panel instanceof HTMLElement &&
      closeButton &&
      resetButton &&
      applyButton &&
      reason
    )
  ) {
    return
  }

  let previousFocus = null

  const close = (nextReason) => {
    overlay.hidden = true
    document.body.style.overflow = ""
    reason.textContent = nextReason
    if (previousFocus instanceof HTMLElement) previousFocus.focus()
  }

  open.addEventListener("click", () => {
    previousFocus = document.activeElement
    overlay.hidden = false
    document.body.style.overflow = "hidden"
    panel.focus()
  })

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close("backdrop")
  })

  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close("escape")
  })

  closeButton.addEventListener("click", () => close("close-button"))
  resetButton.addEventListener("click", () => {
    for (const input of mount.querySelectorAll("#drawer-panel input[type='checkbox']")) {
      if (input instanceof HTMLInputElement) input.checked = false
    }
  })
  applyButton.addEventListener("click", () => close("close-button"))
}

function mountConfirmDialogDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.5rem;justify-items:start;">
      <button class="docs-button" type="button" id="open-confirm-dialog">Delete record</button>
      <p style="margin:0;font-size:.85rem;color:#475569;">Last action: <strong id="confirm-dialog-result">none</strong></p>
      <div class="docs-overlay" hidden>
        <section class="docs-panel" role="dialog" aria-modal="true" aria-labelledby="docs-confirm-title" tabindex="-1">
          <h3 id="docs-confirm-title" style="margin:0;">Delete this record?</h3>
          <p style="margin:0;">This action cannot be undone.</p>
          <div style="display:flex;gap:.5rem;justify-content:flex-end;">
            <button class="docs-button" data-variant="outline" type="button" id="cancel-confirm-dialog">Cancel</button>
            <button class="docs-button" data-tone="danger" type="button" id="confirm-confirm-dialog">Delete</button>
          </div>
        </section>
      </div>
    </div>
  `

  const open = mount.querySelector("#open-confirm-dialog")
  const overlay = mount.querySelector(".docs-overlay")
  const panel = mount.querySelector(".docs-panel")
  const cancel = mount.querySelector("#cancel-confirm-dialog")
  const confirm = mount.querySelector("#confirm-confirm-dialog")
  const result = mount.querySelector("#confirm-dialog-result")

  if (!(open && overlay instanceof HTMLElement && panel instanceof HTMLElement && cancel && confirm && result)) {
    return
  }

  let previouslyFocused = null

  const close = (reason) => {
    overlay.hidden = true
    document.body.style.overflow = ""
    result.textContent = reason
    if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
  }

  open.addEventListener("click", () => {
    previouslyFocused = document.activeElement
    overlay.hidden = false
    document.body.style.overflow = "hidden"
    panel.focus()
  })

  panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close("escape")
  })

  cancel.addEventListener("click", () => close("cancel"))
  confirm.addEventListener("click", () => close("confirm"))
}

function mountMenuDemo(mount) {
  mount.innerHTML = `
    <div class="docs-menu">
      <button class="docs-button" data-variant="outline" type="button" aria-haspopup="menu" aria-expanded="false">Actions</button>
      <ul class="docs-menu-list" role="menu" hidden>
        <li role="none"><button class="docs-menu-item" type="button" role="menuitem">Edit</button></li>
        <li role="none"><button class="docs-menu-item" type="button" role="menuitem">Archive</button></li>
      </ul>
    </div>
  `
  const trigger = mount.querySelector("[aria-haspopup='menu']")
  const menu = mount.querySelector("[role='menu']")
  if (!(trigger instanceof HTMLButtonElement && menu instanceof HTMLElement)) return

  const menuItems = Array.from(menu.querySelectorAll("[role='menuitem']")).filter(
    (item) => item instanceof HTMLButtonElement,
  )

  const setOpen = (next, restoreFocus = false) => {
    menu.hidden = !next
    trigger.setAttribute("aria-expanded", String(next))
    if (!next && restoreFocus) {
      trigger.focus()
    }
  }

  const toggle = () => {
    const next = menu.hidden
    setOpen(next)
    if (next) {
      const first = menuItems[0]
      if (first instanceof HTMLElement) {
        first.focus()
      }
    }
  }

  trigger.addEventListener("click", toggle)
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false, true)
    }
  })

  for (const item of menuItems) {
    item.addEventListener("click", () => {
      setOpen(false, true)
    })
  }

  document.addEventListener("pointerdown", (event) => {
    if (menu.hidden) return

    const target = event.target
    if (!(target instanceof Node)) return
    if (mount.contains(target)) return

    setOpen(false)
  })
}

function mountToastDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.75rem;position:relative;">
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
        <button class="docs-button" type="button" data-tone="neutral">Show neutral</button>
        <button class="docs-button" type="button" data-tone="success">Show success</button>
        <button class="docs-button" type="button" data-tone="danger">Show danger</button>
      </div>
      <ul class="docs-toast-stack" aria-live="polite"></ul>
    </div>
  `

  const list = mount.querySelector(".docs-toast-stack")
  const buttons = Array.from(mount.querySelectorAll("button[data-tone]"))
  if (!(list instanceof HTMLElement)) return

  let id = 0
  const timers = new Map()

  const addToast = (tone) => {
    id += 1
    const key = `toast-${id}`
    const item = document.createElement("li")
    item.className = "docs-toast"
    item.dataset.tone = tone
    item.tabIndex = 0
    item.setAttribute("aria-live", tone === "danger" ? "assertive" : "polite")
    item.innerHTML = `
      <div class="docs-toast-head">
        <span class="docs-toast-tone">${tone}</span>
        <button type="button" class="docs-toast-close" aria-label="Dismiss notification">×</button>
      </div>
      <p class="docs-toast-message">${tone} toast #${id}</p>
      <p class="docs-toast-meta">Auto-dismisses in 3.5s</p>
      <div class="docs-toast-progress"><span></span></div>
    `
    list.appendChild(item)

    const closeButton = item.querySelector(".docs-toast-close")
    const progress = item.querySelector(".docs-toast-progress > span")

    const clear = () => {
      item.classList.add("is-leaving")
      setTimeout(() => {
        item.remove()
      }, 140)
      const timer = timers.get(key)
      if (timer) clearTimeout(timer)
      timers.delete(key)
    }

    if (progress instanceof HTMLElement) {
      progress.style.animation = "docs-toast-progress 3500ms linear forwards"
    }

    const timer = setTimeout(clear, 3500)
    timers.set(key, timer)

    if (closeButton instanceof HTMLButtonElement) {
      closeButton.addEventListener("click", clear)
    }

    item.addEventListener("mouseenter", () => {
      const active = timers.get(key)
      if (active) clearTimeout(active)
      if (progress instanceof HTMLElement) {
        progress.style.animationPlayState = "paused"
      }
    })
    item.addEventListener("mouseleave", () => {
      if (!item.isConnected) return
      const next = setTimeout(clear, 1200)
      timers.set(key, next)
      if (progress instanceof HTMLElement) {
        progress.style.animation = "docs-toast-progress 1200ms linear forwards"
      }
    })
  }

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const tone = button.dataset.tone ?? "neutral"
      addToast(tone)
    })
  }
}

function mountCalendarDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.5rem;max-width:18rem;">
      <input class="rf-calendar rf-input-base rf-focus-ring" type="date" id="calendar-date" />
      <p id="calendar-state" style="margin:0;font-size:.85rem;color:#475569;">Selected: none</p>
    </div>
  `

  const input = mount.querySelector("#calendar-date")
  const state = mount.querySelector("#calendar-state")
  if (!(input instanceof HTMLInputElement && state instanceof HTMLElement)) return

  input.addEventListener("input", () => {
    state.textContent = `Selected: ${input.value || "none"}`
  })
}

function mountStatisticDemo(mount) {
  mount.innerHTML = `
    <div class="rf-grid" data-columns="3" style="--rf-grid-gap:.6rem;max-width:42rem;">
      <section class="rf-statistic" data-trend="up">
        <p class="rf-statistic-label">Monthly active users</p>
        <p class="rf-statistic-value">18,240</p>
        <p class="rf-statistic-caption"><span class="rf-statistic-trend">↑</span> +12.4% vs last month</p>
      </section>
      <section class="rf-statistic" data-trend="neutral">
        <p class="rf-statistic-label">Open incidents</p>
        <p class="rf-statistic-value">7</p>
        <p class="rf-statistic-caption"><span class="rf-statistic-trend">•</span> No change today</p>
      </section>
      <section class="rf-statistic" data-trend="down">
        <p class="rf-statistic-label">Failed deploys</p>
        <p class="rf-statistic-value">2</p>
        <p class="rf-statistic-caption"><span class="rf-statistic-trend">↓</span> -33% this week</p>
      </section>
    </div>
  `
}

function mountImageDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.5rem;max-width:28rem;">
      <figure class="rf-image" data-fit="cover">
        <img
          class="rf-image-element"
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=80"
          alt="Workspace desk with laptop and notebook"
          loading="lazy"
        />
      </figure>
      <p style="margin:0;font-size:.85rem;color:#475569;">Image: lazy-loaded cover fit.</p>
    </div>
  `
}

function mountGridDemo(mount) {
  mount.innerHTML = `
    <div class="rf-grid" data-columns="4" style="--rf-grid-gap:.6rem;max-width:40rem;">
      <div class="rf-card rf-grid-item" data-span="2"><div class="rf-card-body">Span 2</div></div>
      <div class="rf-card rf-grid-item" data-span="1"><div class="rf-card-body">Span 1</div></div>
      <div class="rf-card rf-grid-item" data-span="1"><div class="rf-card-body">Span 1</div></div>
      <div class="rf-card rf-grid-item" data-span="4"><div class="rf-card-body">Full row span 4</div></div>
    </div>
  `
}

function mountLayoutDemo(mount) {
  mount.innerHTML = `
    <section class="rf-layout" data-direction="column" data-has-sider="true" style="display:grid;gap:.6rem;max-width:48rem;">
      <header class="rf-layout-header" style="display:flex;justify-content:space-between;align-items:center;">
        <strong>Workspace</strong>
        <button class="docs-button" data-variant="outline" type="button" id="layout-toggle-sider">Toggle sider</button>
      </header>
      <div style="display:grid;grid-template-columns:16rem 1fr;gap:.6rem;">
        <aside class="rf-layout-sider" id="layout-sider" style="--rf-layout-sider-width:16rem;">
          <nav style="display:grid;gap:.3rem;"><a href="#">Overview</a><a href="#">Deployments</a><a href="#">Settings</a></nav>
        </aside>
        <main class="rf-layout-content">Main content region</main>
      </div>
      <footer class="rf-layout-footer">Footer utilities</footer>
    </section>
  `

  const toggle = mount.querySelector("#layout-toggle-sider")
  const sider = mount.querySelector("#layout-sider")
  if (!(toggle instanceof HTMLButtonElement && sider instanceof HTMLElement)) return

  toggle.addEventListener("click", () => {
    sider.hidden = !sider.hidden
  })
}

function mountEmptyDemo(mount) {
  mount.innerHTML = `
    <section class="rf-empty" data-size="comfortable" role="status" style="max-width:28rem;">
      <div class="rf-empty-icon">∅</div>
      <h2 class="rf-empty-title">No projects yet</h2>
      <p class="rf-empty-description">Create your first project to start tracking releases and incidents.</p>
      <div class="rf-empty-action"><button class="docs-button" type="button">Create project</button></div>
    </section>
  `
}

function mountLinkDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.5rem;max-width:28rem;">
      <nav class="rf-flex" data-align="center" style="--rf-flex-gap:.75rem;">
        <a href="/projects" id="docs-link-internal">Internal projects</a>
        <a href="https://example.com" id="docs-link-external" target="_blank" rel="noopener noreferrer">External docs</a>
      </nav>
      <p id="link-state" style="margin:0;font-size:.85rem;color:#475569;">Navigate: none</p>
    </div>
  `

  const internal = mount.querySelector("#docs-link-internal")
  const external = mount.querySelector("#docs-link-external")
  const state = mount.querySelector("#link-state")
  if (!(internal instanceof HTMLAnchorElement && external instanceof HTMLAnchorElement && state instanceof HTMLElement))
    return

  internal.addEventListener("click", (event) => {
    event.preventDefault()
    state.textContent = "Navigate: /projects"
  })

  external.addEventListener("click", () => {
    state.textContent = "Navigate: external in new tab"
  })
}

function mountFormDemo(mount) {
  mount.innerHTML = `
    <form style="display:grid;gap:.6rem;max-width:24rem;" novalidate>
      <label style="display:grid;gap:.25rem;">Name<input class="docs-input" name="name" type="text" required /></label>
      <label style="display:grid;gap:.25rem;">Email<input class="docs-input" name="email" type="email" required /></label>
      <div class="rf-space" data-size="sm" data-wrap="true">
        <button class="docs-button" type="submit">Save</button>
        <button class="docs-button" type="button" data-variant="outline" id="form-reset">Reset</button>
      </div>
      <p id="form-state" style="margin:0;font-size:.85rem;color:#475569;">Submission: none</p>
    </form>
  `

  const form = mount.querySelector("form")
  const reset = mount.querySelector("#form-reset")
  const state = mount.querySelector("#form-state")
  if (!(form instanceof HTMLFormElement && reset instanceof HTMLButtonElement && state instanceof HTMLElement)) return

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const name = String(data.get("name") ?? "")
    const email = String(data.get("email") ?? "")
    state.textContent = `Submission: ${name || "(missing name)"} / ${email || "(missing email)"}`
  })

  reset.addEventListener("click", () => {
    form.reset()
    state.textContent = "Submission: reset"
  })
}

function mountFlexDemo(mount) {
  mount.innerHTML = `
    <div class="rf-flex" data-justify="between" data-align="center" data-wrap="wrap" style="--rf-flex-gap:.6rem;max-width:30rem;">
      <strong>Deployments</strong>
      <div class="rf-flex" data-align="center" style="--rf-flex-gap:.5rem;">
        <button class="docs-button" data-variant="outline" type="button">Filter</button>
        <button class="docs-button" type="button">New deploy</button>
      </div>
    </div>
  `
}

function mountSpaceDemo(mount) {
  mount.innerHTML = `
    <div class="rf-space" data-size="md" data-wrap="true" style="max-width:28rem;">
      <button class="docs-button" type="button">Approve</button>
      <button class="docs-button" data-variant="outline" type="button">Request changes</button>
      <button class="docs-button" data-variant="outline" type="button">Comment</button>
    </div>
  `
}

function mountTypographyDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.45rem;max-width:34rem;">
      <h2 class="rf-typography-heading" style="margin:0;">Release readiness</h2>
      <p class="rf-typography-text" style="margin:0;">All checks passed. One deployment is waiting on manual approval.</p>
      <p class="rf-typography-text" data-truncate="true" style="margin:0;max-width:18rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Very long release note title that demonstrates truncation in compact card contexts</p>
      <code class="rf-typography-code">pnpm --filter @lukasmurdock/remix-ui-components test</code>
    </div>
  `
}

function mountAvatarDemo(mount) {
  mount.innerHTML = `
    <div class="rf-space" data-size="md" data-align="center">
      <span class="rf-avatar" data-size="sm" data-shape="circle"><span class="rf-avatar-fallback">LM</span></span>
      <span class="rf-avatar" data-size="md" data-shape="circle" data-status="online"><span class="rf-avatar-fallback">AD</span></span>
      <span class="rf-avatar" data-size="lg" data-shape="square" data-status="busy"><span class="rf-avatar-fallback">RB</span></span>
    </div>
  `
}

function mountCollapseDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.55rem;max-width:36rem;">
      <details class="rf-collapse" open>
        <summary class="rf-collapse-trigger">Release notes</summary>
        <div class="rf-collapse-content">The latest release includes routing updates, docs demo coverage checks, and layout primitives.</div>
      </details>
      <details class="rf-collapse">
        <summary class="rf-collapse-trigger">Deployment checklist</summary>
        <div class="rf-collapse-content">Run tests, typecheck, build docs, and verify demo coverage before merge.</div>
      </details>
    </div>
  `
}

function mountConfigProviderDemo(mount) {
  mount.innerHTML = `
    <section class="rf-app-provider" lang="en-US" dir="ltr" data-color-scheme="light" data-reduced-motion="no-preference" style="display:grid;gap:.5rem;max-width:34rem;">
      <div class="rf-flex" data-justify="between" data-align="center">
        <strong>ConfigProvider shell</strong>
        <span class="rf-badge" data-tone="info">light / ltr</span>
      </div>
      <a href="/dashboard" id="config-nav-link">Navigate to dashboard</a>
      <p id="config-nav-state" style="margin:0;font-size:.85rem;color:#475569;">Navigation: none</p>
    </section>
  `

  const link = mount.querySelector("#config-nav-link")
  const state = mount.querySelector("#config-nav-state")
  if (!(link instanceof HTMLAnchorElement && state instanceof HTMLElement)) return

  link.addEventListener("click", (event) => {
    event.preventDefault()
    state.textContent = "Navigation: /dashboard"
  })
}

function mountDividerDemo(mount) {
  mount.innerHTML = `
    <div style="display:grid;gap:.65rem;max-width:30rem;">
      <div class="rf-space" data-size="sm" data-align="center" data-wrap="true">
        <span>Overview</span>
        <div class="rf-divider" data-orientation="vertical" data-inset="false" role="separator" aria-orientation="vertical"></div>
        <span>Deployments</span>
        <div class="rf-divider" data-orientation="vertical" data-inset="false" role="separator" aria-orientation="vertical"></div>
        <span>Settings</span>
      </div>
      <div class="rf-divider" data-orientation="horizontal" data-inset="false"></div>
      <p style="margin:0;color:#475569;font-size:.85rem;">Horizontal and vertical separators for content grouping.</p>
    </div>
  `
}
