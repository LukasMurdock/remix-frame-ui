import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type FormMethod = "get" | "post"

export type FormProps = {
  children: ComponentChildren
  action?: string
  method?: FormMethod
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain"
  noValidate?: boolean
  busy?: boolean
  "aria-describedby"?: string
}

export type FormErrorSummaryProps = {
  id: string
  title?: ComponentChildren
  errors: string[]
}

export function resolveFormMethod(method?: FormMethod): FormMethod {
  return method ?? "get"
}

export function resolveFormBusy(busy?: boolean): boolean {
  return busy ?? false
}

export function resolveFormNoValidate(noValidate?: boolean): boolean {
  return noValidate ?? false
}

export function Form(_handle: Handle) {
  return (props: FormProps) => {
    const busy = resolveFormBusy(props.busy)

    return (
      <form
        action={props.action}
        method={resolveFormMethod(props.method)}
        encType={props.encType}
        noValidate={resolveFormNoValidate(props.noValidate)}
        aria-busy={busy ? "true" : undefined}
        aria-describedby={props["aria-describedby"]}
        data-busy={busy ? "true" : "false"}
      >
        {props.children}
      </form>
    )
  }
}

export function FormErrorSummary(_handle: Handle) {
  return (props: FormErrorSummaryProps) => {
    if (props.errors.length === 0) return null

    return (
      <section id={props.id} className="rf-form-error-summary" role="alert" aria-live="assertive">
        <h2 className="rf-form-error-summary-title">{props.title ?? "Please fix the following errors"}</h2>
        <ul className="rf-form-error-summary-list">
          {props.errors.map((error, index) => (
            <li key={`${props.id}-${index}`} className="rf-form-error-summary-item">
              {error}
            </li>
          ))}
        </ul>
      </section>
    )
  }
}
