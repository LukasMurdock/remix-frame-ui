import type { Handle } from "remix/component"
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
}

export function Radio(_handle: Handle) {
  return (props: RadioProps) => (
    <label>
      <input
        type="radio"
        id={props.id}
        name={props.name}
        value={props.value}
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        disabled={props.disabled}
        required={props.required}
      />
      {props.children}
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
}

export function RadioGroup(_handle: Handle) {
  return (props: RadioGroupProps) => {
    const errorId = props.error ? `${props.name}-error` : undefined

    return (
      <fieldset aria-describedby={errorId}>
        <legend>{props.legend}</legend>
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
              ...(option.disabled !== undefined ? { disabled: option.disabled } : {}),
            }}
          >
            {option.label}
          </Radio>
        ))}
        {props.error ? (
          <p id={errorId} className="rf-error">
            {props.error}
          </p>
        ) : null}
      </fieldset>
    )
  }
}
