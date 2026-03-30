import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type FormLayoutColumns = 1 | 2 | 3
export type FormLayoutActionsAlign = "start" | "end"

export type FormLayoutProps = {
  title?: ComponentChildren
  description?: ComponentChildren
  children: ComponentChildren
  actions?: ComponentChildren
  /** @default 1 */
  columns?: FormLayoutColumns
  /** @default "start" */
  actionsAlign?: FormLayoutActionsAlign
}

export function normalizeFormLayoutColumns(columns?: FormLayoutColumns): FormLayoutColumns {
  return columns ?? 1
}

export function normalizeFormLayoutActionsAlign(actionsAlign?: FormLayoutActionsAlign): FormLayoutActionsAlign {
  return actionsAlign ?? "start"
}

export function FormLayout(handle: Handle) {
  return (props: FormLayoutProps) => {
    const titleId = `${handle.id}-title`
    const descriptionId = `${handle.id}-description`

    return (
      <form
        className="rf-form-layout"
        data-columns={normalizeFormLayoutColumns(props.columns)}
        aria-labelledby={props.title ? titleId : undefined}
        aria-describedby={props.description ? descriptionId : undefined}
      >
        {props.title ? <h2 id={titleId}>{props.title}</h2> : null}
        {props.description ? <p id={descriptionId}>{props.description}</p> : null}
        <div className="rf-form-layout-fields">{props.children}</div>
        {props.actions ? (
          <div className="rf-form-layout-actions" data-align={normalizeFormLayoutActionsAlign(props.actionsAlign)}>
            {props.actions}
          </div>
        ) : null}
      </form>
    )
  }
}
