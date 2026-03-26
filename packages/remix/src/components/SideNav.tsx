import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type SideNavItem = {
  id: string
  label: ComponentChildren
  href?: string
  disabled?: boolean
  children?: SideNavItem[]
}

export type SideNavSection = {
  id?: string
  label?: ComponentChildren
  items: SideNavItem[]
}

export type SideNavProps = {
  sections: SideNavSection[]
  activeId?: string
  compact?: boolean
  ariaLabel?: string
}

export function normalizeSideNavCompact(compact?: boolean): boolean {
  return compact ?? false
}

export function resolveSideNavActiveId(sections: SideNavSection[], activeId?: string): string | undefined {
  if (activeId) return activeId

  for (const section of sections) {
    for (const item of section.items) {
      if (!item.disabled) return item.id
    }
  }

  return undefined
}

function renderSideNavItems(items: SideNavItem[], activeId: string | undefined): any[] {
  return items.map((item) => {
    const current = item.id === activeId
    return (
      <li key={item.id} className="rf-side-nav-item" data-active={current ? "true" : "false"}>
        {item.href && !item.disabled ? (
          <a className="rf-side-nav-link" href={item.href} aria-current={current ? "page" : undefined}>
            {item.label}
          </a>
        ) : (
          <span className="rf-side-nav-link" aria-current={current ? "page" : undefined} data-disabled={item.disabled ? "true" : "false"}>
            {item.label}
          </span>
        )}

        {item.children && item.children.length > 0 ? (
          <ul className="rf-side-nav-sublist">{renderSideNavItems(item.children, activeId)}</ul>
        ) : null}
      </li>
    )
  })
}

export function SideNav(_handle: Handle) {
  return (props: SideNavProps) => {
    const compact = normalizeSideNavCompact(props.compact)
    const activeId = resolveSideNavActiveId(props.sections, props.activeId)

    return (
      <nav className="rf-side-nav" data-compact={compact ? "true" : "false"} aria-label={props.ariaLabel ?? "Side navigation"}>
        {props.sections.map((section, index) => (
          <section key={section.id ?? `section-${index}`} className="rf-side-nav-section">
            {section.label ? <h3 className="rf-side-nav-heading">{section.label}</h3> : null}
            <ul className="rf-side-nav-list">{renderSideNavItems(section.items, activeId)}</ul>
          </section>
        ))}
      </nav>
    )
  }
}
