import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type AppProviderDirection = "ltr" | "rtl"
export type AppProviderColorScheme = "light" | "dark" | "auto"
export type AppProviderReducedMotion = "no-preference" | "reduce"

export type AppProviderNavigatePayload = {
  href: string
  external: boolean
}

export type AppProviderProps = {
  children: ComponentChildren
  /** @default "en-US" */
  locale?: string
  /** @default "ltr" */
  direction?: AppProviderDirection
  /** @default "light" */
  colorScheme?: AppProviderColorScheme
  /** @default "no-preference" */
  reducedMotion?: AppProviderReducedMotion
  onNavigate?: (payload: AppProviderNavigatePayload) => void
}

export function resolveAppProviderLocale(locale?: string): string {
  return locale ?? "en-US"
}

export function resolveAppProviderDirection(direction?: AppProviderDirection): AppProviderDirection {
  return direction ?? "ltr"
}

export function resolveAppProviderColorScheme(colorScheme?: AppProviderColorScheme): AppProviderColorScheme {
  return colorScheme ?? "light"
}

export function resolveAppProviderReducedMotion(reducedMotion?: AppProviderReducedMotion): AppProviderReducedMotion {
  return reducedMotion ?? "no-preference"
}

export function isExternalAppProviderHref(href: string): boolean {
  return !href.trim().startsWith("/")
}

export function shouldHandleAppProviderNavigation(event: MouseEvent, anchor: HTMLAnchorElement): boolean {
  if (event.defaultPrevented) return false
  if (event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  if (anchor.target && anchor.target.toLowerCase() !== "_self") return false
  if (anchor.hasAttribute("download")) return false

  const href = anchor.getAttribute("href")
  if (!href || href.trim() === "" || href.startsWith("#")) return false
  if (!href.trim().startsWith("/")) return false
  return true
}

export function AppProvider(_handle: Handle) {
  return (props: AppProviderProps) => {
    const locale = resolveAppProviderLocale(props.locale)
    const direction = resolveAppProviderDirection(props.direction)
    const colorScheme = resolveAppProviderColorScheme(props.colorScheme)
    const reducedMotion = resolveAppProviderReducedMotion(props.reducedMotion)

    return (
      <div
        className="rf-app-provider"
        lang={locale}
        dir={direction}
        data-color-scheme={colorScheme}
        data-reduced-motion={reducedMotion}
        mix={[
          on("click", (event) => {
            if (!props.onNavigate) return
            const target = event.target
            const elementTarget =
              target instanceof Element ? target : target instanceof Node ? target.parentElement : null
            if (!(elementTarget instanceof Element)) return

            const anchor = elementTarget.closest("a[href]")
            if (!(anchor instanceof HTMLAnchorElement)) return
            if (!shouldHandleAppProviderNavigation(event, anchor)) return

            const href = anchor.getAttribute("href")
            if (!href) return
            event.preventDefault()
            props.onNavigate({ href, external: isExternalAppProviderHref(href) })
          }),
        ]}
      >
        {props.children}
      </div>
    )
  }
}
