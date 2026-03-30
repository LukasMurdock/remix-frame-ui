// @vitest-environment jsdom

import { describe, expect, it } from "vitest"

async function loadRuntime() {
  if (!("adoptedStyleSheets" in document)) {
    Object.defineProperty(document, "adoptedStyleSheets", {
      value: [],
      writable: true,
    })
  }

  if (typeof CSSStyleSheet === "undefined") {
    ;(globalThis as { CSSStyleSheet?: unknown }).CSSStyleSheet = class CSSStyleSheet {
      replaceSync() {}
    }
  }

  const { createRoot } = await import("remix/component")
  const { Select } = await import("../src/components/Select")
  const { Checkbox } = await import("../src/components/Checkbox")
  const { Switch } = await import("../src/components/Switch")
  const { Combobox } = await import("../src/components/Combobox")
  const { Autocomplete } = await import("../src/components/Autocomplete")
  const { DatePicker } = await import("../src/components/DatePicker")
  const { DateRangePicker } = await import("../src/components/DateRangePicker")
  const { FormErrorSummary } = await import("../src/components/Form")
  return { createRoot, Select, Checkbox, Switch, Combobox, Autocomplete, DatePicker, DateRangePicker, FormErrorSummary }
}

describe("form controls integration", () => {
  it("passes aria validation props through select, checkbox, and switch", async () => {
    const { createRoot, Select, Checkbox, Switch } = await loadRuntime()
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    try {
      root.render(
        <div>
          <Select
            id="pet"
            options={[{ value: "dog", label: "Dog" }]}
            aria-describedby="pet-error"
            aria-invalid="true"
          />
          <Checkbox id="tos" aria-describedby="tos-error" aria-invalid="true">
            Accept terms
          </Checkbox>
          <Switch id="updates" aria-describedby="updates-error" aria-invalid="true">
            Email updates
          </Switch>
        </div>,
      )
      root.flush()

      const select = container.querySelector<HTMLSelectElement>("#pet")
      const checkbox = container.querySelector<HTMLInputElement>("#tos")
      const toggle = container.querySelector<HTMLInputElement>("#updates")

      expect(select?.getAttribute("aria-describedby")).toBe("pet-error")
      expect(select?.getAttribute("aria-invalid")).toBe("true")
      expect(checkbox?.getAttribute("aria-describedby")).toBe("tos-error")
      expect(checkbox?.getAttribute("aria-invalid")).toBe("true")
      expect(toggle?.getAttribute("aria-describedby")).toBe("updates-error")
      expect(toggle?.getAttribute("aria-invalid")).toBe("true")
    } finally {
      root.dispose()
      container.remove()
    }
  })

  it("prevents form submit when combobox commits selection with Enter", async () => {
    const { createRoot, Combobox } = await loadRuntime()
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    try {
      root.render(
        <form>
          <Combobox
            id="assignee"
            name="assignee"
            required
            aria-describedby="assignee-help"
            aria-invalid="true"
            label="Assignee"
            options={[
              { id: "1", label: "Ada Lovelace", value: "ada" },
              { id: "2", label: "Grace Hopper", value: "grace" },
            ]}
          />
        </form>,
      )
      root.flush()

      const input = container.querySelector<HTMLInputElement>("#assignee")
      expect(input).toBeTruthy()

      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }))
      root.flush()

      const enter = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true })
      const dispatchResult = input?.dispatchEvent(enter)
      root.flush()

      expect(dispatchResult).toBe(false)
      expect(input?.value).toBe("ada")
      expect(input?.getAttribute("name")).toBe("assignee")
      expect(input?.required).toBe(true)
      expect(input?.getAttribute("aria-describedby")).toBe("assignee-help")
      expect(input?.getAttribute("aria-invalid")).toBe("true")
    } finally {
      root.dispose()
      container.remove()
    }
  })

  it("opens and closes date picker controls with keyboard", async () => {
    const { createRoot, DatePicker, DateRangePicker } = await loadRuntime()
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    try {
      root.render(
        <div>
          <DatePicker id="dob" />
          <DateRangePicker id="report-range" />
        </div>,
      )
      root.flush()

      const dateInput = container.querySelector<HTMLInputElement>("#dob")
      dateInput?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }))
      root.flush()
      expect(dateInput?.getAttribute("aria-expanded")).toBe("true")
      dateInput?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }))
      root.flush()
      expect(dateInput?.getAttribute("aria-expanded")).toBe("false")

      const rangeInput = container.querySelector<HTMLInputElement>("#report-range")
      rangeInput?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }))
      root.flush()
      expect(rangeInput?.getAttribute("aria-expanded")).toBe("true")
      rangeInput?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }))
      root.flush()
      expect(rangeInput?.getAttribute("aria-expanded")).toBe("false")
    } finally {
      root.dispose()
      container.remove()
    }
  })

  it("supports linked error summary items", async () => {
    const { createRoot, FormErrorSummary } = await loadRuntime()
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    try {
      root.render(
        <FormErrorSummary
          id="signup-errors"
          errors={[{ message: "Email is required", fieldId: "email" }, "Choose a plan"]}
        />,
      )
      root.flush()

      const alertRegion = container.querySelector(".rf-form-error-summary")
      const link = container.querySelector<HTMLAnchorElement>(".rf-form-error-summary-link")

      expect(alertRegion?.getAttribute("role")).toBe("alert")
      expect(link?.getAttribute("href")).toBe("#email")
      expect(alertRegion?.textContent).toContain("Choose a plan")
    } finally {
      root.dispose()
      container.remove()
    }
  })

  it("commits autocomplete option with keyboard Enter", async () => {
    const { createRoot, Autocomplete } = await loadRuntime()
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)
    const commits: string[] = []

    try {
      root.render(
        <Autocomplete
          id="city"
          label="City"
          options={[
            { id: "1", label: "London", value: "london" },
            { id: "2", label: "Lisbon", value: "lisbon" },
          ]}
          onCommit={(commit) => {
            commits.push(commit.value)
          }}
        />,
      )
      root.flush()

      const input = container.querySelector<HTMLInputElement>("#city")
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }))
      root.flush()
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }))
      root.flush()

      expect(commits).toEqual(["london"])
      expect(input?.value).toBe("london")
    } finally {
      root.dispose()
      container.remove()
    }
  })

  it("wires date range trigger validation attributes", async () => {
    const { createRoot, DateRangePicker } = await loadRuntime()
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    try {
      root.render(
        <form>
          <DateRangePicker
            id="billing-range"
            required
            aria-describedby="billing-range-help"
            aria-invalid="true"
            defaultValue={{ start: "2026-03-10" }}
            startName="startDate"
            endName="endDate"
          />
        </form>,
      )
      root.flush()

      const input = container.querySelector<HTMLInputElement>("#billing-range")
      expect(input?.required).toBe(true)
      expect(input?.getAttribute("aria-describedby")).toBe("billing-range-help")
      expect(input?.getAttribute("aria-invalid")).toBe("true")

      const form = container.querySelector("form")
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true })
      const dispatchResult = form?.dispatchEvent(submitEvent)
      expect(dispatchResult).toBe(false)
    } finally {
      root.dispose()
      container.remove()
    }
  })
})
