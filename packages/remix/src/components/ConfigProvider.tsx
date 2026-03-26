import { on, type Handle } from "remix/component"
import { isExternalLinkHref, resolveLinkNavigateMode, shouldHandleLinkNavigation, type LinkNavigateMode } from "./Link"
import type { ComponentChildren } from "../types"

export type ConfigProviderDirection = "ltr" | "rtl"
export type ConfigProviderColorScheme = "light" | "dark" | "auto"
export type ConfigProviderReducedMotion = "no-preference" | "reduce"

export type ConfigProviderNavigatePayload = {
  href: string
  external: boolean
}

export type ConfigProviderRouter = {
  navigate: (href: string) => void
}

export type ConfigProviderProps = {
  children: ComponentChildren
  locale?: string
  direction?: ConfigProviderDirection
  colorScheme?: ConfigProviderColorScheme
  reducedMotion?: ConfigProviderReducedMotion
  navigateMode?: LinkNavigateMode
  router?: ConfigProviderRouter
  onNavigate?: (payload: ConfigProviderNavigatePayload) => void
}

export function resolveConfigProviderLocale(locale?: string): string {
  return locale ?? "en-US"
}

export function resolveConfigProviderDirection(direction?: ConfigProviderDirection): ConfigProviderDirection {
  return direction ?? "ltr"
}

export function resolveConfigProviderColorScheme(colorScheme?: ConfigProviderColorScheme): ConfigProviderColorScheme {
  return colorScheme ?? "light"
}

export function resolveConfigProviderReducedMotion(reducedMotion?: ConfigProviderReducedMotion): ConfigProviderReducedMotion {
  return reducedMotion ?? "no-preference"
}

export function ConfigProvider(_handle: Handle) {
  return (props: ConfigProviderProps) => {
    const locale = resolveConfigProviderLocale(props.locale)
    const direction = resolveConfigProviderDirection(props.direction)
    const colorScheme = resolveConfigProviderColorScheme(props.colorScheme)
    const reducedMotion = resolveConfigProviderReducedMotion(props.reducedMotion)
    const navigateMode = resolveLinkNavigateMode(props.navigateMode)

    return (
      <div
        className="rf-app-provider"
        lang={locale}
        dir={direction}
        data-color-scheme={colorScheme}
        data-reduced-motion={reducedMotion}
        mix={[
          on("click", (event) => {
            if (!props.router && !props.onNavigate) return

            const target = event.target
            if (!(target instanceof Element)) return

            const anchor = target.closest("a[href]")
            if (!(anchor instanceof HTMLAnchorElement)) return
            if (!shouldHandleLinkNavigation(event, anchor, navigateMode)) return

            const href = anchor.getAttribute("href")
            if (!href) return

            event.preventDefault()
            props.router?.navigate(href)
            props.onNavigate?.({ href, external: isExternalLinkHref(href) })
          }),
        ]}
      >
        {props.children}
      </div>
    )
  }
}
