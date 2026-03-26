import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type FilterBarProps = {
  title?: ComponentChildren
  children: ComponentChildren
  actions?: ComponentChildren
}

export function FilterBar(_handle: Handle) {
  return (props: FilterBarProps) => (
    <section className="rf-filter-bar" aria-label="Filters">
      {props.title ? <h2 className="rf-filter-bar-title">{props.title}</h2> : null}
      <div className="rf-filter-bar-fields">{props.children}</div>
      {props.actions ? <div className="rf-filter-bar-actions">{props.actions}</div> : null}
    </section>
  )
}
