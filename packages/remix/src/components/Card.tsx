import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type CardProps = {
  title?: ComponentChildren
  subtitle?: ComponentChildren
  children: ComponentChildren
  footer?: ComponentChildren
}

export function Card(_handle: Handle) {
  return (props: CardProps) => (
    <section className="rf-card">
      {props.title || props.subtitle ? (
        <header className="rf-card-header">
          {props.title ? <h3 className="rf-card-title">{props.title}</h3> : null}
          {props.subtitle ? <p className="rf-card-subtitle">{props.subtitle}</p> : null}
        </header>
      ) : null}
      <div className="rf-card-body">{props.children}</div>
      {props.footer ? <footer className="rf-card-footer">{props.footer}</footer> : null}
    </section>
  )
}
