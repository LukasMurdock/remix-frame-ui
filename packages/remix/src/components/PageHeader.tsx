import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type PageHeaderProps = {
  title: ComponentChildren
  subtitle?: ComponentChildren
  actions?: ComponentChildren
}

export function PageHeader(_handle: Handle) {
  return (props: PageHeaderProps) => (
    <header className="rf-page-header">
      <div>
        <h1 className="rf-page-header-title">{props.title}</h1>
        {props.subtitle ? <p className="rf-page-header-subtitle">{props.subtitle}</p> : null}
      </div>
      {props.actions ? <div className="rf-page-header-actions">{props.actions}</div> : null}
    </header>
  )
}
