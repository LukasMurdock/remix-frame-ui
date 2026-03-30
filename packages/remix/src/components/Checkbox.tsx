import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type CheckboxProps = {
  id?: string
  name?: string
  /** @default "on" */
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  "aria-describedby"?: string
  "aria-invalid"?: "true"
  children?: ComponentChildren
}

function getCheckboxSubmissionValue(value?: string): string {
  return value ?? "on"
}

export function Checkbox(_handle: Handle) {
  return (props: CheckboxProps) => (
    <label>
      <input
        type="checkbox"
        id={props.id}
        name={props.name}
        value={getCheckboxSubmissionValue(props.value)}
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        disabled={props.disabled}
        required={props.required}
        aria-describedby={props["aria-describedby"]}
        aria-invalid={props["aria-invalid"]}
      />
      {props.children}
    </label>
  )
}
