import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type FormFieldsetColumns = 1 | 2

export type FormFieldsetProps = {
  legend: ComponentChildren
  description?: ComponentChildren
  children: ComponentChildren
  /** @default 1 */
  columns?: FormFieldsetColumns
}

export function normalizeFormFieldsetColumns(columns?: FormFieldsetColumns): FormFieldsetColumns {
  return columns ?? 1
}

export function FormFieldset(handle: Handle) {
  return (props: FormFieldsetProps) => {
    const descriptionId = `${handle.id}-description`

    return (
      <fieldset
        className="rf-form-fieldset"
        data-columns={normalizeFormFieldsetColumns(props.columns)}
        aria-describedby={props.description ? descriptionId : undefined}
      >
        <legend>{props.legend}</legend>
        {props.description ? <p id={descriptionId}>{props.description}</p> : null}
        <div className="rf-form-fieldset-fields">{props.children}</div>
      </fieldset>
    )
  }
}
