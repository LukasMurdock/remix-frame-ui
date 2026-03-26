const registry = {
  "alert-basic": mountAlertDemo,
  "app-header-basic": mountAppHeaderDemo,
  "app-shell-basic": mountAppShellDemo,
  "autocomplete-basic": mountAutocompleteDemo,
  "badge-basic": mountBadgeDemo,
  "breadcrumbs-overflow-basic": mountBreadcrumbOverflowDemo,
  "breadcrumbs-basic": mountBreadcrumbsDemo,
  "button-basic": mountButtonDemo,
  "card-basic": mountCardDemo,
  "chip-basic": mountChipDemo,
  "combobox-basic": mountComboboxDemo,
  "confirm-dialog-basic": mountConfirmDialogDemo,
  "command-palette-basic": mountCommandPaletteDemo,
  "data-grid-lite-basic": mountDataGridLiteDemo,
  "data-list-basic": mountDataListDemo,
  "data-table-basic": mountDataTableDemo,
  "date-picker-basic": mountDatePickerDemo,
  "date-time-picker-basic": mountDateTimePickerDemo,
  "date-range-picker-basic": mountDateRangePickerDemo,
  "dropdown-basic": mountDropdownDemo,
  "empty-state-basic": mountEmptyStateDemo,
  "empty-results-basic": mountEmptyResultsDemo,
  "file-upload-basic": mountFileUploadDemo,
  "field-basic": mountFieldStructureDemo,
  "form-fieldset-basic": mountFormFieldsetDemo,
  "form-layout-basic": mountFormLayoutDemo,
  "form-message-basic": mountFormMessageDemo,
  "field-input": mountFieldDemo,
  "checkbox-basic": mountCheckboxDemo,
  "filter-bar-basic": mountFilterBarDemo,
  "inline-alert-basic": mountInlineAlertDemo,
  "radio-group": mountRadioDemo,
  "range-slider-basic": mountRangeSliderDemo,
  "result-basic": mountResultDemo,
  "page-header-basic": mountPageHeaderDemo,
  "popover-basic": mountPopoverDemo,
  "progress-basic": mountProgressDemo,
  "select-basic": mountSelectDemo,
  "side-nav-basic": mountSideNavDemo,
  "skeleton-basic": mountSkeletonDemo,
  "slider-basic": mountSliderDemo,
  "spinner-basic": mountSpinnerDemo,
  "steps-basic": mountStepsDemo,
  "switch-basic": mountSwitchDemo,
  "table-basic": mountTableDemo,
  "tag-basic": mountTagDemo,
  "tabs-basic": mountTabsDemo,
  "textarea-basic": mountTextareaDemo,
  "time-picker-basic": mountTimePickerDemo,
  "drawer-basic": mountDrawerDemo,
  "dialog-controlled": mountDialogDemo,
  "menu-actions": mountMenuDemo,
  "number-input-basic": mountNumberInputDemo,
  "pagination-basic": mountPaginationDemo,
  "toast-queue": mountToastDemo,
  "tooltip-basic": mountTooltipDemo,
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
    <div class="rf-combobox">
      <input class="docs-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="combo-demo-list" placeholder="Search people" />
      <ul id="combo-demo-list" role="listbox" class="rf-combobox-list" hidden>
        <li class="rf-combobox-option" role="option" data-value="Ada Lovelace" data-label="Ada Lovelace">Ada Lovelace</li>
        <li class="rf-combobox-option" role="option" data-value="Grace Hopper" data-label="Grace Hopper">Grace Hopper</li>
        <li class="rf-combobox-option" role="option" data-value="Margaret Hamilton" data-label="Margaret Hamilton">Margaret Hamilton</li>
        <li class="rf-combobox-empty" data-empty hidden>No matches</li>
      </ul>
    </div>
  `

  const input = mount.querySelector("input")
  const list = mount.querySelector("[role='listbox']")
  if (!(input instanceof HTMLInputElement && list instanceof HTMLElement)) return

  const options = Array.from(list.querySelectorAll("[role='option']")).filter(
    (option) => option instanceof HTMLElement,
  )
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
    <div class="rf-combobox" style="display:grid;gap:.5rem;max-width:22rem;">
      <input class="docs-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="autocomplete-demo-list" placeholder="Type or choose a person" />
      <ul id="autocomplete-demo-list" role="listbox" class="rf-combobox-list" hidden>
        <li class="rf-combobox-option" role="option" data-value="Ada Lovelace" data-label="Ada Lovelace">Ada Lovelace</li>
        <li class="rf-combobox-option" role="option" data-value="Grace Hopper" data-label="Grace Hopper">Grace Hopper</li>
        <li class="rf-combobox-option" role="option" data-value="Margaret Hamilton" data-label="Margaret Hamilton">Margaret Hamilton</li>
        <li class="rf-combobox-empty" data-empty hidden>No matches</li>
      </ul>
      <p style="margin:0;font-size:.85rem;color:#475569;">Committed value: <strong data-commit>None</strong></p>
    </div>
  `

  const input = mount.querySelector("input")
  const list = mount.querySelector("[role='listbox']")
  const commitValue = mount.querySelector("[data-commit]")
  if (!(input instanceof HTMLInputElement && list instanceof HTMLElement && commitValue instanceof HTMLElement)) {
    return
  }

  const options = Array.from(list.querySelectorAll("[role='option']")).filter(
    (option) => option instanceof HTMLElement,
  )
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
        </ul>
      </section>
    </div>
  `

  const open = mount.querySelector("button")
  const overlay = mount.querySelector(".rf-command-overlay")
  const input = mount.querySelector("input")
  if (!(open instanceof HTMLButtonElement && overlay instanceof HTMLElement && input instanceof HTMLInputElement)) return

  const setOpen = (next) => {
    overlay.hidden = !next
    if (next) input.focus()
    else open.focus()
  }

  open.addEventListener("click", () => setOpen(true))
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) setOpen(false)
  })
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false)
  })
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
  if (!(table instanceof HTMLTableElement && tbody instanceof HTMLElement && selectAll instanceof HTMLInputElement)) return

  let sort = { key: null, direction: null }

  const getRows = () => Array.from(tbody.querySelectorAll("tr"))

  const updateSelectionState = () => {
    const rows = getRows()
    const checks = rows.map((row) => row.querySelector("input[type='checkbox']")).filter((el) => el instanceof HTMLInputElement)
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
        <span id="data-table-status" class="rf-data-table-pagination-status">Page 1 of 2</span>
        <div class="rf-data-table-pagination-actions">
          <button id="data-table-prev" type="button" class="docs-button" data-variant="outline">Previous</button>
          <button id="data-table-next" type="button" class="docs-button" data-variant="outline">Next</button>
        </div>
      </footer>
    </section>
  `

  const body = mount.querySelector("#data-table-body")
  const status = mount.querySelector("#data-table-status")
  const prev = mount.querySelector("#data-table-prev")
  const next = mount.querySelector("#data-table-next")
  const selectAll = mount.querySelector("#table-select-all")
  const sortButtons = Array.from(mount.querySelectorAll(".rf-data-table-sort"))
  if (!(body instanceof HTMLElement && status instanceof HTMLElement && prev instanceof HTMLButtonElement && next instanceof HTMLButtonElement && selectAll instanceof HTMLInputElement)) return

  const pageSize = 2
  let page = 1
  let sort = { key: null, direction: null }
  let rows = [
    { key: "release-1", name: "Release 1.0", status: "Success", duration: 91 },
    { key: "release-2", name: "Release 1.1", status: "Failed", duration: 132 },
    { key: "release-3", name: "Release 1.2", status: "Running", duration: 64 },
    { key: "release-4", name: "Release 1.3", status: "Success", duration: 82 },
  ]
  const selected = new Set()

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
    body.innerHTML = pageRows.map(rowMarkup).join("")

    status.textContent = `Page ${page} of ${currentTotalPages}`
    prev.disabled = page <= 1
    next.disabled = page >= currentTotalPages

    const checks = Array.from(body.querySelectorAll("input[data-row-check]")).filter((el) => el instanceof HTMLInputElement)
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
    !(input instanceof HTMLInputElement &&
      toggle instanceof HTMLButtonElement &&
      panel instanceof HTMLElement &&
      gridBody instanceof HTMLElement &&
      month instanceof HTMLElement &&
      state instanceof HTMLElement)
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
    month.textContent = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
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
  if (!(dateInput instanceof HTMLInputElement && timeInput instanceof HTMLInputElement && state instanceof HTMLElement)) return

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
    !(input instanceof HTMLInputElement &&
      toggle instanceof HTMLButtonElement &&
      panel instanceof HTMLElement &&
      gridBody instanceof HTMLElement &&
      month instanceof HTMLElement &&
      state instanceof HTMLElement)
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
    month.textContent = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
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

  trigger.addEventListener("click", () => {
    const next = menu.hidden
    menu.hidden = !next
    trigger.setAttribute("aria-expanded", String(next))
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
    state.textContent = checkbox.checked
      ? `Submitted value when checked: ${checkbox.value}`
      : "Currently unchecked"
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
  if (!(wrapper instanceof HTMLElement && startInput instanceof HTMLInputElement && endInput instanceof HTMLInputElement && state instanceof HTMLElement)) {
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

function mountTabsDemo(mount) {
  mount.innerHTML = `
    <section>
      <div role="tablist" aria-label="Demo tabs" style="display:flex;gap:.5rem;flex-wrap:wrap;">
        <button class="docs-button" type="button" role="tab" aria-selected="true" aria-controls="panel-overview" id="tab-overview">Overview</button>
        <button class="docs-button" type="button" role="tab" aria-selected="false" aria-controls="panel-specs" id="tab-specs" data-variant="outline">Specs</button>
        <button class="docs-button" type="button" role="tab" aria-selected="false" aria-controls="panel-notes" id="tab-notes" data-variant="outline">Notes</button>
      </div>
      <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" style="margin-top:.75rem;">Overview content</div>
      <div id="panel-specs" role="tabpanel" aria-labelledby="tab-specs" hidden style="margin-top:.75rem;">Specs content</div>
      <div id="panel-notes" role="tabpanel" aria-labelledby="tab-notes" hidden style="margin-top:.75rem;">Notes content</div>
    </section>
  `

  const tabs = Array.from(mount.querySelectorAll("[role='tab']"))
  const panels = Array.from(mount.querySelectorAll("[role='tabpanel']"))

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
    tab.addEventListener("click", () => activate(tab.id))
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
    !(open && overlay instanceof HTMLElement && panel instanceof HTMLElement && closeButton && resetButton && applyButton && reason)
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

  const toggle = () => {
    const next = menu.hidden
    menu.hidden = !next
    trigger.setAttribute("aria-expanded", String(next))
    if (next) {
      const first = menu.querySelector("[role='menuitem']")
      if (first instanceof HTMLElement) first.focus()
    } else {
      trigger.focus()
    }
  }

  trigger.addEventListener("click", toggle)
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.hidden = true
      trigger.setAttribute("aria-expanded", "false")
      trigger.focus()
    }
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
