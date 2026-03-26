import { describe, expect, it } from "vitest"
import {
  isExternalAppProviderHref,
  resolveAppProviderColorScheme,
  resolveAppProviderDirection,
  resolveAppProviderLocale,
  resolveAppProviderReducedMotion,
  shouldHandleAppProviderNavigation,
} from "../src/components/AppProvider"

describe("app provider helpers", () => {
  it("resolves default environment options", () => {
    expect(resolveAppProviderLocale()).toBe("en-US")
    expect(resolveAppProviderDirection()).toBe("ltr")
    expect(resolveAppProviderColorScheme()).toBe("light")
    expect(resolveAppProviderReducedMotion()).toBe("no-preference")
  })

  it("detects external hrefs", () => {
    expect(isExternalAppProviderHref("https://example.com")).toBe(true)
    expect(isExternalAppProviderHref("mailto:test@example.com")).toBe(true)
    expect(isExternalAppProviderHref("/projects/1")).toBe(false)
  })

  it("handles only regular internal anchor clicks", () => {
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

    expect(shouldHandleAppProviderNavigation(event, anchor)).toBe(true)

    const hashAnchor = {
      target: "",
      hasAttribute: () => false,
      getAttribute: (name: string) => (name === "href" ? "#section" : null),
    } as unknown as HTMLAnchorElement

    expect(shouldHandleAppProviderNavigation(event, hashAnchor)).toBe(false)

    const metaClick = {
      defaultPrevented: false,
      button: 0,
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    } as MouseEvent

    expect(shouldHandleAppProviderNavigation(metaClick, anchor)).toBe(false)

    const externalAnchor = {
      target: "",
      hasAttribute: () => false,
      getAttribute: (name: string) => (name === "href" ? "mailto:test@example.com" : null),
    } as unknown as HTMLAnchorElement

    expect(shouldHandleAppProviderNavigation(event, externalAnchor)).toBe(false)
  })
})
