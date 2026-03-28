import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type EmptySize = "comfortable" | "compact"

export type EmptyProps = {
  title: ComponentChildren
  description?: ComponentChildren
  action?: ComponentChildren
  icon?: ComponentChildren
  /** @default "comfortable" */
  size?: EmptySize
}

export function resolveEmptySize(size?: EmptySize): EmptySize {
  return size ?? "comfortable"
}

export function Empty(_handle: Handle) {
  return (props: EmptyProps) => (
    <section className="rf-empty" data-size={resolveEmptySize(props.size)} role="status">
      {props.icon ? <div className="rf-empty-icon">{props.icon}</div> : null}
      <h2 className="rf-empty-title">{props.title}</h2>
      {props.description ? <p className="rf-empty-description">{props.description}</p> : null}
      {props.action ? <div className="rf-empty-action">{props.action}</div> : null}
    </section>
  )
}
