import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type BreadcrumbItem = {
  id: string
  label: ComponentChildren
  href?: string
  current?: boolean
  disabled?: boolean
}

export type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  ariaLabel?: string
  separator?: ComponentChildren
}

export function resolveBreadcrumbCurrentIndex(items: BreadcrumbItem[]): number {
  const explicit = items.findIndex((item) => item.current)
  if (explicit >= 0) return explicit
  return items.length > 0 ? items.length - 1 : -1
}

export function resolveBreadcrumbSeparator(separator?: ComponentChildren): ComponentChildren {
  return separator ?? "/"
}

export function Breadcrumbs(_handle: Handle) {
  return (props: BreadcrumbsProps) => {
    const currentIndex = resolveBreadcrumbCurrentIndex(props.items)
    const separator = resolveBreadcrumbSeparator(props.separator)

    return (
      <nav className="rf-breadcrumbs" aria-label={props.ariaLabel ?? "Breadcrumb"}>
        <ol className="rf-breadcrumbs-list">
          {props.items.map((item, index) => {
            const current = index === currentIndex
            return (
              <li key={item.id} className="rf-breadcrumbs-item">
                {item.href && !current && !item.disabled ? (
                  <a className="rf-breadcrumbs-link" href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <span className="rf-breadcrumbs-label" aria-current={current ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
                {index < props.items.length - 1 ? <span className="rf-breadcrumbs-separator">{separator}</span> : null}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
}
