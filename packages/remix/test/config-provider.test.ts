import { describe, expect, it } from "vitest"
import {
  resolveConfigProviderColorScheme,
  resolveConfigProviderDirection,
  resolveConfigProviderLocale,
  resolveConfigProviderReducedMotion,
} from "../src/components/ConfigProvider"
import { shouldHandleLinkNavigation } from "../src/components/Link"

describe("config provider helpers", () => {
  it("resolves default environment options", () => {
    expect(resolveConfigProviderLocale()).toBe("en-US")
    expect(resolveConfigProviderDirection()).toBe("ltr")
    expect(resolveConfigProviderColorScheme()).toBe("light")
    expect(resolveConfigProviderReducedMotion()).toBe("no-preference")
  })

  it("handles internal link clicks by default", () => {
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

    const externalAnchor = {
      target: "",
      hasAttribute: () => false,
      getAttribute: (name: string) => (name === "href" ? "https://example.com" : null),
    } as unknown as HTMLAnchorElement

    expect(shouldHandleLinkNavigation(event, externalAnchor, "internal")).toBe(false)
    expect(shouldHandleLinkNavigation(event, externalAnchor, "all")).toBe(true)
  })
})
