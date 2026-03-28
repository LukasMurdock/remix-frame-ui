import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type CollapseProps = {
  title: ComponentChildren
  children: ComponentChildren
  /** @default false */
  open?: boolean
}

export function resolveCollapseOpen(open?: boolean): boolean {
  return open ?? false
}

export function Collapse(_handle: Handle) {
  return (props: CollapseProps) => (
    <details className="rf-collapse" open={resolveCollapseOpen(props.open)}>
      <summary className="rf-collapse-trigger">{props.title}</summary>
      <div className="rf-collapse-content">{props.children}</div>
    </details>
  )
}
