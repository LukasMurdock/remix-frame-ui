import { describe, expect, it } from "vitest"
import {
  isExternalLinkHref,
  resolveLinkNavigateMode,
  resolveLinkRel,
  shouldHandleLinkNavigation,
} from "../src/components/Link"

describe("link helpers", () => {
  it("detects external hrefs", () => {
    expect(isExternalLinkHref("https://example.com")).toBe(true)
    expect(isExternalLinkHref("mailto:test@example.com")).toBe(true)
    expect(isExternalLinkHref("/projects/1")).toBe(false)
    expect(isExternalLinkHref("#faq")).toBe(false)
  })

  it("adds noopener and noreferrer for new tabs", () => {
    expect(resolveLinkRel({ href: "https://example.com", target: "_blank" })).toBe("noopener noreferrer")
    expect(resolveLinkRel({ href: "https://example.com", target: "_blank", rel: "nofollow" })).toBe(
      "nofollow noopener noreferrer",
    )
  })

  it("defaults navigate mode to internal", () => {
    expect(resolveLinkNavigateMode()).toBe("internal")
    expect(resolveLinkNavigateMode("all")).toBe("all")
  })

  it("handles regular internal clicks", () => {
    const anchor = {
      target: "",
      hasAttribute: () => false,
      getAttribute: (name: string) => (name === "href" ? "/projects" : null),
    } as unknown as HTMLAnchorElement

    const event = {
      defaultPrevented: false,
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    } as MouseEvent

    expect(shouldHandleLinkNavigation(event, anchor, "internal")).toBe(true)

    const metaClick = {
      defaultPrevented: false,
      button: 0,
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    } as MouseEvent
    expect(shouldHandleLinkNavigation(metaClick, anchor, "internal")).toBe(false)
  })

  it("skips external links in internal mode", () => {
    const anchor = {
      target: "",
      hasAttribute: () => false,
      getAttribute: (name: string) => (name === "href" ? "https://example.com" : null),
    } as unknown as HTMLAnchorElement

    const event = {
      defaultPrevented: false,
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    } as MouseEvent

    expect(shouldHandleLinkNavigation(event, anchor, "internal")).toBe(false)
    expect(shouldHandleLinkNavigation(event, anchor, "all")).toBe(true)
  })
})
