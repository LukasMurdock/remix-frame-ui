import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type DescriptionsSize = "comfortable" | "compact"
export type DescriptionsLayout = "horizontal" | "vertical"
export type DescriptionsCollapseBelow = "sm" | "md" | "lg" | "none"

export type DescriptionsItem = {
  key: string
  label: ComponentChildren
  content: ComponentChildren
  span?: number
}

export type DescriptionsProps = {
  items: DescriptionsItem[]
  title?: ComponentChildren
  extra?: ComponentChildren
  /** @default 3 */
  columns?: number
  /** @default "comfortable" */
  size?: DescriptionsSize
  /** @default "horizontal" */
  layout?: DescriptionsLayout
  /** @default "sm" */
  collapseBelow?: DescriptionsCollapseBelow
  /** @default true */
  bordered?: boolean
  /** @default "No details" */
  emptyState?: ComponentChildren
}

export function resolveDescriptionsColumns(columns?: number): number {
  const next = Math.floor(columns ?? 3)
  return Math.max(1, Math.min(4, next))
}

export function resolveDescriptionsSize(size?: DescriptionsSize): DescriptionsSize {
  return size ?? "comfortable"
}

export function resolveDescriptionsLayout(layout?: DescriptionsLayout): DescriptionsLayout {
  return layout ?? "horizontal"
}

export function resolveDescriptionsCollapseBelow(collapseBelow?: DescriptionsCollapseBelow): DescriptionsCollapseBelow {
  return collapseBelow ?? "sm"
}

export function resolveDescriptionsItemSpan(span: number | undefined, columns: number): number {
  const next = Math.floor(span ?? 1)
  return Math.max(1, Math.min(columns, next))
}

export function resolveDescriptionsBordered(bordered?: boolean): boolean {
  return bordered ?? true
}

export function Descriptions(_handle: Handle) {
  return (props: DescriptionsProps) => {
    const columns = resolveDescriptionsColumns(props.columns)
    const size = resolveDescriptionsSize(props.size)
    const layout = resolveDescriptionsLayout(props.layout)
    const collapseBelow = resolveDescriptionsCollapseBelow(props.collapseBelow)
    const bordered = resolveDescriptionsBordered(props.bordered)

    return (
      <section
        className="rf-descriptions"
        data-size={size}
        data-layout={layout}
        data-collapse-below={collapseBelow}
        data-bordered={bordered ? "true" : "false"}
        style={`--rf-descriptions-columns: ${columns};`}
      >
        {props.title || props.extra ? (
          <header className="rf-descriptions-header">
            {props.title ? <h3 className="rf-descriptions-title">{props.title}</h3> : null}
            {props.extra ? <div className="rf-descriptions-extra">{props.extra}</div> : null}
          </header>
        ) : null}

        {props.items.length === 0 ? (
          <p className="rf-descriptions-empty">{props.emptyState ?? "No details"}</p>
        ) : (
          <dl className="rf-descriptions-list">
            {props.items.map((item) => {
              const span = resolveDescriptionsItemSpan(item.span, columns)
              return (
                <div key={item.key} className="rf-descriptions-item" style={`grid-column: span ${span};`}>
                  <dt className="rf-descriptions-label">{item.label}</dt>
                  <dd className="rf-descriptions-content">{item.content}</dd>
                </div>
              )
            })}
          </dl>
        )}
      </section>
    )
  }
}
