import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type SwitchProps = {
  id?: string
  name?: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  children?: ComponentChildren
}

export function getSwitchSubmissionValue(value?: string): string {
  return value ?? "on"
}

export function Switch(_handle: Handle) {
  return (props: SwitchProps) => (
    <label className="rf-switch">
      <input
        className="rf-switch-input"
        type="checkbox"
        role="switch"
        id={props.id}
        name={props.name}
        value={getSwitchSubmissionValue(props.value)}
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        disabled={props.disabled}
        required={props.required}
      />
      <span className="rf-switch-control" aria-hidden="true">
        <span className="rf-switch-thumb" />
      </span>
      {props.children ? <span className="rf-switch-label">{props.children}</span> : null}
    </label>
  )
}
