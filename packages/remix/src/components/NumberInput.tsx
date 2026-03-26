import type { Handle } from "remix/component"

export type NumberInputProps = {
  id?: string
  name?: string
  value?: number
  defaultValue?: number
  disabled?: boolean
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  step?: number
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

export function normalizeNumberInputStep(step?: number): number | undefined {
  if (step === undefined) return undefined
  return step > 0 ? step : 1
}

export function NumberInput(_handle: Handle) {
  return (props: NumberInputProps) => (
    <input
      id={props.id}
      type="number"
      name={props.name}
      value={props.value}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      required={props.required}
      placeholder={props.placeholder}
      min={props.min}
      max={props.max}
      step={normalizeNumberInputStep(props.step)}
      aria-describedby={props["aria-describedby"]}
      aria-invalid={props["aria-invalid"]}
      className="rf-input-base rf-focus-ring"
    />
  )
}
