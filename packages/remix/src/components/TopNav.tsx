import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TopNavItem = {
  id: string
  label: ComponentChildren
  href?: string
  disabled?: boolean
}

export type TopNavProps = {
  items: TopNavItem[]
  activeId?: string
  /** @default false */
  compact?: boolean
  /** @default "Top navigation" */
  ariaLabel?: string
}

export function normalizeTopNavCompact(compact?: boolean): boolean {
  return compact ?? false
}

export function resolveTopNavActiveId(items: TopNavItem[], activeId?: string): string | undefined {
  if (activeId) return activeId

  for (const item of items) {
    if (!item.disabled) return item.id
  }

  return undefined
}

export function TopNav(_handle: Handle) {
  return (props: TopNavProps) => {
    const compact = normalizeTopNavCompact(props.compact)
    const activeId = resolveTopNavActiveId(props.items, props.activeId)

    return (
      <nav
        className="rf-top-nav"
        data-compact={compact ? "true" : "false"}
        aria-label={props.ariaLabel ?? "Top navigation"}
      >
        <ul className="rf-top-nav-list">
          {props.items.map((item) => {
            const active = item.id === activeId
            return (
              <li key={item.id} className="rf-top-nav-item" data-active={active ? "true" : "false"}>
                {item.href && !item.disabled ? (
                  <a className="rf-top-nav-link" href={item.href} aria-current={active ? "page" : undefined}>
                    {item.label}
                  </a>
                ) : (
                  <span
                    className="rf-top-nav-link"
                    data-disabled={item.disabled ? "true" : "false"}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
}
