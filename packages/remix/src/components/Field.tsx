import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

function createFieldIds(seed: string): { inputId: string; descriptionId: string; errorId: string } {
  return {
    inputId: `${seed}-input`,
    descriptionId: `${seed}-description`,
    errorId: `${seed}-error`,
  }
}

function createAriaFieldState(params: { descriptionId?: string; errorId?: string; invalid?: boolean }) {
  const describedBy = [params.descriptionId, params.errorId].filter(Boolean).join(" ")
  return {
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(params.invalid ? { "aria-invalid": "true" as const } : {}),
  }
}

export function resolveFieldInvalid(invalid?: boolean, error?: ComponentChildren): boolean {
  if (invalid !== undefined) return invalid
  return Boolean(error)
}

export type FieldProps = {
  id: string
  label: ComponentChildren
  description?: ComponentChildren
  error?: ComponentChildren
  invalid?: boolean
  children: (ids: {
    inputId: string
    descriptionId?: string
    errorId?: string
    aria: {
      "aria-describedby"?: string
      "aria-invalid"?: "true"
    }
  }) => ComponentChildren
}

export function Field(_handle: Handle) {
  return (props: FieldProps) => {
    const ids = createFieldIds(props.id)
    const invalid = resolveFieldInvalid(props.invalid, props.error)
    const aria = createAriaFieldState({
      ...(props.description ? { descriptionId: ids.descriptionId } : {}),
      ...(props.error ? { errorId: ids.errorId } : {}),
      ...(invalid ? { invalid: true } : {}),
    })

    return (
      <div className="rf-field">
        <Label htmlFor={ids.inputId}>{props.label}</Label>
        {props.children({
          inputId: ids.inputId,
          ...(props.description ? { descriptionId: ids.descriptionId } : {}),
          ...(props.error ? { errorId: ids.errorId } : {}),
          aria,
        })}
        {props.description ? <Description id={ids.descriptionId}>{props.description}</Description> : null}
        {props.error ? <Error id={ids.errorId}>{props.error}</Error> : null}
      </div>
    )
  }
}

export function Label(_handle: Handle) {
  return (props: { htmlFor?: string; children: ComponentChildren }) => (
    <label htmlFor={props.htmlFor}>{props.children}</label>
  )
}

export function Description(_handle: Handle) {
  return (props: { id: string; children: ComponentChildren }) => <p id={props.id}>{props.children}</p>
}

export function Error(_handle: Handle) {
  return (props: { id: string; children: ComponentChildren }) => (
    <p id={props.id} className="rf-error">
      {props.children}
    </p>
  )
}
