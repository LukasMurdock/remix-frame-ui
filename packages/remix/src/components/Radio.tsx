import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type RadioProps = {
  id?: string
  name: string
  value: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  children?: ComponentChildren
  onValueChange?: (value: string) => void
}

export function Radio(_handle: Handle) {
  return (props: RadioProps) => (
    <label className="rf-radio-option">
      <input
        type="radio"
        id={props.id}
        name={props.name}
        value={props.value}
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        disabled={props.disabled}
        required={props.required}
        className="rf-radio-input"
        mix={[
          on("change", (event) => {
            const target = event.currentTarget as HTMLInputElement
            if (!target.checked) return
            props.onValueChange?.(props.value)
          }),
        ]}
      />
      <span className="rf-radio-label">{props.children}</span>
    </label>
  )
}

export type RadioGroupOption = {
  value: string
  label: ComponentChildren
  disabled?: boolean
}

export type RadioGroupProps = {
  legend: ComponentChildren
  name: string
  options: RadioGroupOption[]
  checkedValue?: string
  defaultCheckedValue?: string
  error?: ComponentChildren
  required?: boolean
  disabled?: boolean
  orientation?: "vertical" | "horizontal"
  onValueChange?: (value: string) => void
}

export function resolveRadioGroupOrientation(orientation?: "vertical" | "horizontal"): "vertical" | "horizontal" {
  return orientation ?? "vertical"
}

export function RadioGroup(_handle: Handle) {
  return (props: RadioGroupProps) => {
    const errorId = props.error ? `${props.name}-error` : undefined
    const orientation = resolveRadioGroupOrientation(props.orientation)

    return (
      <fieldset className="rf-radio-group" data-orientation={orientation} aria-describedby={errorId}>
        <legend>{props.legend}</legend>
        <div className="rf-radio-group-options">
          {props.options.map((option) => (
            <Radio
              key={option.value}
              {...{
                name: props.name,
                value: option.value,
                ...(props.checkedValue !== undefined ? { checked: props.checkedValue === option.value } : {}),
                ...(props.defaultCheckedValue !== undefined
                  ? { defaultChecked: props.defaultCheckedValue === option.value }
                  : {}),
                ...(option.disabled !== undefined || props.disabled !== undefined
                  ? { disabled: option.disabled ?? props.disabled }
                  : {}),
                ...(props.required !== undefined ? { required: props.required } : {}),
                ...(props.onValueChange ? { onValueChange: props.onValueChange } : {}),
              }}
            >
              {option.label}
            </Radio>
          ))}
        </div>
        {props.error ? (
          <p id={errorId} className="rf-error rf-radio-error">
            {props.error}
          </p>
        ) : null}
      </fieldset>
    )
  }
}
