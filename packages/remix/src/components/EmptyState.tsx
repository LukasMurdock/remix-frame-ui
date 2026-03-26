import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type EmptyStateProps = {
  title: ComponentChildren
  description?: ComponentChildren
  action?: ComponentChildren
}

export function EmptyState(_handle: Handle) {
  return (props: EmptyStateProps) => (
    <section className="rf-empty-state" role="status">
      <h2 className="rf-empty-state-title">{props.title}</h2>
      {props.description ? <p className="rf-empty-state-description">{props.description}</p> : null}
      {props.action ? <div className="rf-empty-state-action">{props.action}</div> : null}
    </section>
  )
}
