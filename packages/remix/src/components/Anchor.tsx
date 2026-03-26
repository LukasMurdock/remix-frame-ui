import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type AnchorItem = {
  id: string
  label: ComponentChildren
  href: string
  disabled?: boolean
}

export type AnchorProps = {
  items: AnchorItem[]
  ariaLabel?: string
  activeHref?: string
  defaultActiveHref?: string
  onActiveHrefChange?: (href: string) => void
}

export function resolveAnchorActiveHref(items: AnchorItem[], preferred?: string): string | undefined {
  if (preferred) {
    const match = items.find((item) => item.href === preferred && !item.disabled)
    if (match) return match.href
  }

  const firstEnabled = items.find((item) => !item.disabled)
  return firstEnabled?.href
}

export function isAnchorItemActive(itemHref: string, activeHref?: string): boolean {
  return Boolean(activeHref && itemHref === activeHref)
}

export function resolveAnchorInitialHref(
  items: AnchorItem[],
  defaultActiveHref?: string,
  locationHash?: string,
): string | undefined {
  if (locationHash) {
    const fromHash = items.find((item) => item.href === locationHash && !item.disabled)?.href
    if (fromHash) return fromHash
  }

  return resolveAnchorActiveHref(items, defaultActiveHref)
}

export function resolveAnchorHashTarget(
  items: AnchorItem[],
  currentHref: string | undefined,
  locationHash?: string,
): string | undefined {
  if (!locationHash) return undefined

  const fromHash = items.find((item) => item.href === locationHash && !item.disabled)?.href
  if (!fromHash) return undefined
  if (fromHash === currentHref) return undefined

  return fromHash
}

export function syncAnchorActiveHrefFromHash(
  items: AnchorItem[],
  currentHref: string | undefined,
  locationHash: string | undefined,
  onNext: (href: string) => void,
): string | undefined {
  const target = resolveAnchorHashTarget(items, currentHref, locationHash)
  if (!target) return undefined
  onNext(target)
  return target
}

export function Anchor(handle: Handle) {
  let localActiveHref: string | undefined

  return (props: AnchorProps) => {
    if (props.activeHref === undefined && localActiveHref === undefined) {
      const locationHash = typeof window !== "undefined" ? window.location.hash : undefined
      localActiveHref = resolveAnchorInitialHref(props.items, props.defaultActiveHref, locationHash)
    }

    const activeHref = resolveAnchorActiveHref(props.items, props.activeHref ?? localActiveHref)

    const setActiveHref = (href: string) => {
      const resolved = resolveAnchorActiveHref(props.items, href)
      if (!resolved) return

      const current = resolveAnchorActiveHref(props.items, props.activeHref ?? localActiveHref)
      if (resolved === current) return

      if (props.activeHref === undefined) {
        localActiveHref = resolved
      }

      props.onActiveHrefChange?.(resolved)
      handle.update()
    }

    return (
      <nav
        className="rf-anchor"
        aria-label={props.ariaLabel ?? "Anchor"}
        mix={[
          ref((_node, signal) => {
            if (typeof window === "undefined") return

            const onHashChange = () => {
              const current = resolveAnchorActiveHref(props.items, props.activeHref ?? localActiveHref)
              syncAnchorActiveHrefFromHash(props.items, current, window.location.hash, setActiveHref)
            }

            window.addEventListener("hashchange", onHashChange, { signal })
            onHashChange()
          }),
        ]}
      >
        <ul className="rf-anchor-list">
          {props.items.map((item) => {
            const active = isAnchorItemActive(item.href, activeHref)

            if (item.disabled) {
              return (
                <li key={item.id} className="rf-anchor-item">
                  <span className="rf-anchor-link" data-active="false" data-disabled="true">
                    {item.label}
                  </span>
                </li>
              )
            }

            return (
              <li key={item.id} className="rf-anchor-item">
                <a
                  className="rf-anchor-link rf-focus-ring"
                  data-active={active ? "true" : "false"}
                  href={item.href}
                  aria-current={active ? "location" : undefined}
                  mix={[on("click", () => setActiveHref(item.href))]}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
}
