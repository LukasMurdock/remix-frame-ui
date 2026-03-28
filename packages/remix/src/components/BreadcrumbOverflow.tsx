import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import { resolveBreadcrumbCurrentIndex, resolveBreadcrumbSeparator, type BreadcrumbItem } from "./Breadcrumbs"

export type BreadcrumbOverflowEntry =
  | {
      kind: "item"
      item: BreadcrumbItem
      current: boolean
    }
  | {
      kind: "ellipsis"
      hiddenCount: number
    }

export type BreadcrumbOverflowProps = {
  items: BreadcrumbItem[]
  /** @default 4 */
  maxVisible?: number
  /** @default "Breadcrumb" */
  ariaLabel?: string
  /** @default "/" */
  separator?: ComponentChildren
  /** @default "{hiddenCount} hidden breadcrumb items" */
  ellipsisLabel?: string
}

export function normalizeBreadcrumbOverflowMaxVisible(maxVisible?: number): number {
  if (maxVisible === undefined) return 4
  return Math.max(2, Math.floor(maxVisible))
}

export function buildBreadcrumbOverflowEntries(
  items: BreadcrumbItem[],
  maxVisible?: number,
): BreadcrumbOverflowEntry[] {
  const limit = normalizeBreadcrumbOverflowMaxVisible(maxVisible)
  const currentIndex = resolveBreadcrumbCurrentIndex(items)

  if (items.length <= limit) {
    return items.map((item, index) => ({ kind: "item", item, current: index === currentIndex }))
  }

  const head = items[0]
  if (!head) return []
  const tailCount = limit - 1
  const tailStart = Math.max(1, items.length - tailCount)
  const tail = items.slice(tailStart)
  const hiddenCount = Math.max(0, items.length - 1 - tail.length)

  const entries: BreadcrumbOverflowEntry[] = [{ kind: "item", item: head, current: 0 === currentIndex }]
  if (hiddenCount > 0) entries.push({ kind: "ellipsis", hiddenCount })

  for (let index = 0; index < tail.length; index += 1) {
    const item = tail[index]
    if (!item) continue
    const originalIndex = tailStart + index
    entries.push({ kind: "item", item, current: originalIndex === currentIndex })
  }

  return entries
}

export function BreadcrumbOverflow(_handle: Handle) {
  return (props: BreadcrumbOverflowProps) => {
    const separator = resolveBreadcrumbSeparator(props.separator)
    const entries = buildBreadcrumbOverflowEntries(props.items, props.maxVisible)

    return (
      <nav className="rf-breadcrumbs" aria-label={props.ariaLabel ?? "Breadcrumb"}>
        <ol className="rf-breadcrumbs-list">
          {entries.map((entry, index) => (
            <li key={entry.kind === "item" ? entry.item.id : `ellipsis-${index}`} className="rf-breadcrumbs-item">
              {entry.kind === "item" ? (
                entry.item.href && !entry.current && !entry.item.disabled ? (
                  <a className="rf-breadcrumbs-link" href={entry.item.href}>
                    {entry.item.label}
                  </a>
                ) : (
                  <span className="rf-breadcrumbs-label" aria-current={entry.current ? "page" : undefined}>
                    {entry.item.label}
                  </span>
                )
              ) : (
                <span
                  className="rf-breadcrumbs-overflow"
                  aria-label={props.ellipsisLabel ?? `${entry.hiddenCount} hidden breadcrumb items`}
                >
                  ...
                </span>
              )}

              {index < entries.length - 1 ? <span className="rf-breadcrumbs-separator">{separator}</span> : null}
            </li>
          ))}
        </ol>
      </nav>
    )
  }
}
