import { on, type Handle } from "remix/component"

export type SliderProps = {
  id?: string
  name?: string
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  required?: boolean
  onValueChange?: (value: number) => void
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

export function normalizeSliderStep(step?: number): number | undefined {
  if (step === undefined) return undefined
  return step > 0 ? step : 1
}

export function Slider(_handle: Handle) {
  return (props: SliderProps) => (
    <input
      id={props.id}
      type="range"
      name={props.name}
      value={props.value}
      defaultValue={props.defaultValue}
      min={props.min}
      max={props.max}
      step={normalizeSliderStep(props.step)}
      disabled={props.disabled}
      required={props.required}
      aria-describedby={props["aria-describedby"]}
      aria-invalid={props["aria-invalid"]}
      className="rf-slider rf-focus-ring"
      mix={[
        on("input", (event) => {
          const target = event.currentTarget as HTMLInputElement
          props.onValueChange?.(Number(target.value))
        }),
      ]}
    />
  )
}
