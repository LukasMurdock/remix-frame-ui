import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type SelectOption = {
  value: string
  label: ComponentChildren
  disabled?: boolean
}

export type SelectProps = {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  "aria-describedby"?: string
  "aria-invalid"?: "true"
  options: SelectOption[]
}

export function Select(_handle: Handle) {
  return (props: SelectProps) => (
    <select
      id={props.id}
      name={props.name}
      value={props.value}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      required={props.required}
      aria-describedby={props["aria-describedby"]}
      aria-invalid={props["aria-invalid"]}
      className="rf-input-base rf-focus-ring"
    >
      {props.options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
