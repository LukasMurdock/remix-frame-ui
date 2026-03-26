// @vitest-environment jsdom

import { describe, expect, it } from "vitest"

type AnchorItem = {
  id: string
  label: string
  href: string
  disabled?: boolean
}

describe("anchor component integration", () => {
  async function loadComponentModules() {
    if (!("adoptedStyleSheets" in document)) {
      Object.defineProperty(document, "adoptedStyleSheets", {
        value: [],
        writable: true,
      })
    }

    if (typeof CSSStyleSheet === "undefined") {
      ;(globalThis as any).CSSStyleSheet = class CSSStyleSheet {
        replaceSync() {}
      }
    }

    const { createRoot } = await import("remix/component")
    const { Anchor } = await import("../src/components/Anchor")
    return { createRoot, Anchor }
  }

  it("syncs controlled active href from hashchange via callback", async () => {
    const items: AnchorItem[] = [
      { id: "overview", label: "Overview", href: "#overview" },
      { id: "api", label: "API", href: "#api" },
      { id: "faq", label: "FAQ", href: "#faq", disabled: true },
    ]

    const { createRoot, Anchor } = await loadComponentModules()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    const initialHash = window.location.hash
    let activeHref = "#overview"
    const onActiveHrefChangeCalls: string[] = []

    const renderControlled = () => {
      root.render(
        <Anchor
          items={items}
          activeHref={activeHref}
          onActiveHrefChange={(href) => {
            onActiveHrefChangeCalls.push(href)
            activeHref = href
          }}
        />,
      )
      root.flush()
    }

    try {
      window.location.hash = ""
      renderControlled()

      const overview = container.querySelector<HTMLAnchorElement>("a[href='#overview']")
      expect(overview?.getAttribute("aria-current")).toBe("location")

      window.location.hash = "#api"
      window.dispatchEvent(new HashChangeEvent("hashchange"))
      root.flush()

      expect(onActiveHrefChangeCalls).toEqual(["#api"])

      renderControlled()

      const api = container.querySelector<HTMLAnchorElement>("a[href='#api']")
      expect(api?.getAttribute("aria-current")).toBe("location")

      window.location.hash = "#missing"
      window.dispatchEvent(new HashChangeEvent("hashchange"))
      root.flush()

      expect(onActiveHrefChangeCalls).toEqual(["#api"])
    } finally {
      window.location.hash = initialHash
      root.dispose()
      container.remove()
    }
  })

  it("updates controlled active href after click callback and external rerender", async () => {
    const items: AnchorItem[] = [
      { id: "overview", label: "Overview", href: "#overview" },
      { id: "api", label: "API", href: "#api" },
    ]

    const { createRoot, Anchor } = await loadComponentModules()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    let activeHref = "#overview"
    const onActiveHrefChangeCalls: string[] = []

    const renderControlled = () => {
      root.render(
        <Anchor
          items={items}
          activeHref={activeHref}
          onActiveHrefChange={(href) => {
            onActiveHrefChangeCalls.push(href)
            activeHref = href
          }}
        />,
      )
      root.flush()
    }

    try {
      renderControlled()

      const api = container.querySelector<HTMLAnchorElement>("a[href='#api']")
      api?.click()
      root.flush()

      expect(onActiveHrefChangeCalls).toEqual(["#api"])

      renderControlled()
      expect(api?.getAttribute("aria-current")).toBe("location")
    } finally {
      root.dispose()
      container.remove()
    }
  })

  it("applies initial location hash in controlled mode on mount", async () => {
    const items: AnchorItem[] = [
      { id: "overview", label: "Overview", href: "#overview" },
      { id: "api", label: "API", href: "#api" },
    ]

    const { createRoot, Anchor } = await loadComponentModules()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    const initialHash = window.location.hash
    let activeHref = "#overview"
    const onActiveHrefChangeCalls: string[] = []

    const renderControlled = () => {
      root.render(
        <Anchor
          items={items}
          activeHref={activeHref}
          onActiveHrefChange={(href) => {
            onActiveHrefChangeCalls.push(href)
            activeHref = href
          }}
        />,
      )
      root.flush()
    }

    try {
      window.location.hash = "#api"
      renderControlled()

      expect(onActiveHrefChangeCalls).toEqual(["#api"])

      renderControlled()
      const api = container.querySelector<HTMLAnchorElement>("a[href='#api']")
      expect(api?.getAttribute("aria-current")).toBe("location")
    } finally {
      window.location.hash = initialHash
      root.dispose()
      container.remove()
    }
  })

  it("ignores disabled hash target on mount in controlled mode", async () => {
    const items: AnchorItem[] = [
      { id: "overview", label: "Overview", href: "#overview" },
      { id: "api", label: "API", href: "#api" },
      { id: "faq", label: "FAQ", href: "#faq", disabled: true },
    ]

    const { createRoot, Anchor } = await loadComponentModules()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    const initialHash = window.location.hash
    let activeHref = "#overview"
    const onActiveHrefChangeCalls: string[] = []

    const renderControlled = () => {
      root.render(
        <Anchor
          items={items}
          activeHref={activeHref}
          onActiveHrefChange={(href) => {
            onActiveHrefChangeCalls.push(href)
            activeHref = href
          }}
        />,
      )
      root.flush()
    }

    try {
      window.location.hash = "#faq"
      renderControlled()

      expect(onActiveHrefChangeCalls).toEqual([])

      const overview = container.querySelector<HTMLAnchorElement>("a[href='#overview']")
      expect(overview?.getAttribute("aria-current")).toBe("location")
    } finally {
      window.location.hash = initialHash
      root.dispose()
      container.remove()
    }
  })
})
