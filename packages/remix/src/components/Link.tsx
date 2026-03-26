import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type LinkNavigatePayload = {
  href: string
  external: boolean
}

export type LinkNavigateMode = "internal" | "all"

export type LinkProps = {
  href: string
  children: ComponentChildren
  target?: string
  rel?: string
  download?: boolean
  "aria-current"?: "page" | "step" | "location" | "date" | "time" | "true" | "false"
  onNavigate?: (payload: LinkNavigatePayload) => void
  navigateMode?: LinkNavigateMode
}

export function isExternalLinkHref(href: string): boolean {
  const trimmed = href.trim()
  return !(trimmed.startsWith("/") || trimmed.startsWith("#"))
}

export function resolveLinkRel(params: {
  target?: string
  rel?: string
  href: string
}): string | undefined {
  const rel = params.rel?.trim()
  const opensNewTab = params.target?.toLowerCase() === "_blank"
  if (!opensNewTab) return rel || undefined

  const tokens = new Set((rel || "").split(/\s+/).filter(Boolean))
  tokens.add("noopener")
  tokens.add("noreferrer")
  return Array.from(tokens).join(" ")
}

export function shouldHandleLinkNavigation(
  event: MouseEvent,
  anchor: HTMLAnchorElement,
  navigateMode: LinkNavigateMode,
): boolean {
  if (event.defaultPrevented) return false
  if (event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  if (anchor.target && anchor.target.toLowerCase() !== "_self") return false
  if (anchor.hasAttribute("download")) return false

  const href = anchor.getAttribute("href")
  if (!href || href.trim() === "" || href.startsWith("#")) return false
  if (navigateMode === "internal" && isExternalLinkHref(href)) return false
  return true
}

export function resolveLinkNavigateMode(mode?: LinkNavigateMode): LinkNavigateMode {
  return mode ?? "internal"
}

export function Link(_handle: Handle) {
  return (props: LinkProps) => {
    const navigateMode = resolveLinkNavigateMode(props.navigateMode)
    const rel = resolveLinkRel({
      href: props.href,
      ...(props.rel ? { rel: props.rel } : {}),
      ...(props.target ? { target: props.target } : {}),
    })

    return (
      <a
        href={props.href}
        target={props.target}
        rel={rel}
        download={props.download}
        aria-current={props["aria-current"]}
        mix={[
          on("click", (event) => {
            if (!props.onNavigate) return
            const currentTarget = event.currentTarget
            if (!(currentTarget instanceof HTMLAnchorElement)) return
            if (!shouldHandleLinkNavigation(event, currentTarget, navigateMode)) return

            const href = currentTarget.getAttribute("href")
            if (!href) return

            event.preventDefault()
            props.onNavigate({ href, external: isExternalLinkHref(href) })
          }),
        ]}
      >
        {props.children}
      </a>
    )
  }
}
