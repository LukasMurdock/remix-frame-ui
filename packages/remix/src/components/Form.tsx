import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type FormMethod = "get" | "post"

export type FormProps = {
  children: ComponentChildren
  action?: string
  /** @default "get" */
  method?: FormMethod
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain"
  /** @default false */
  noValidate?: boolean
  /** @default false */
  busy?: boolean
  "aria-describedby"?: string
}

export type FormErrorSummaryProps = {
  id: string
  /** @default "Please fix the following errors" */
  title?: ComponentChildren
  errors: Array<string | { message: ComponentChildren; fieldId?: string }>
}

export type FormErrorSummaryItem = {
  message: ComponentChildren
  href?: string
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

export function normalizeFormErrorSummaryItems(
  errors: Array<string | { message: ComponentChildren; fieldId?: string }>,
): FormErrorSummaryItem[] {
  return errors.map((error) => {
    if (typeof error === "string") return { message: error }
    const cleanFieldId = error.fieldId?.startsWith("#") ? error.fieldId.slice(1) : error.fieldId
    return cleanFieldId ? { message: error.message, href: `#${cleanFieldId}` } : { message: error.message }
  })
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
    const items = normalizeFormErrorSummaryItems(props.errors)

    return (
      <section id={props.id} className="rf-form-error-summary" role="alert" aria-live="assertive">
        <h2 className="rf-form-error-summary-title">{props.title ?? "Please fix the following errors"}</h2>
        <ul className="rf-form-error-summary-list">
          {items.map((item, index) => (
            <li key={`${props.id}-${index}`} className="rf-form-error-summary-item">
              {item.href ? (
                <a href={item.href} className="rf-form-error-summary-link">
                  {item.message}
                </a>
              ) : (
                item.message
              )}
            </li>
          ))}
        </ul>
      </section>
    )
  }
}
