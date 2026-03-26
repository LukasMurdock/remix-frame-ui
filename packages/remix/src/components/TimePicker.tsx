import { on, type Handle } from "remix/component"

export type TimePickerProps = {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  min?: string
  max?: string
  step?: number
  disabled?: boolean
  required?: boolean
  onValueChange?: (value: string | undefined) => void
  onValueCommit?: (value: string | undefined) => void
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

export function parseTimeValue(value?: string): { hours: number; minutes: number; seconds: number } | undefined {
  if (!value) return undefined
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value)
  if (!match) return undefined

  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = match[3] ? Number(match[3]) : 0

  if (hours < 0 || hours > 23) return undefined
  if (minutes < 0 || minutes > 59) return undefined
  if (seconds < 0 || seconds > 59) return undefined

  return { hours, minutes, seconds }
}

export function normalizeTimeStep(step?: number): number | undefined {
  if (step === undefined) return undefined
  return step > 0 ? Math.floor(step) : 60
}

export function TimePicker(_handle: Handle) {
  return (props: TimePickerProps) => (
    <input
      id={props.id}
      type="time"
      name={props.name}
      value={props.value}
      defaultValue={props.defaultValue}
      min={props.min}
      max={props.max}
      step={normalizeTimeStep(props.step)}
      disabled={props.disabled}
      required={props.required}
      aria-describedby={props["aria-describedby"]}
      aria-invalid={props["aria-invalid"]}
      className="rf-input-base rf-focus-ring rf-time-picker"
      mix={[
        on("input", (event) => {
          const target = event.currentTarget as HTMLInputElement
          props.onValueChange?.(target.value || undefined)
        }),
        on("change", (event) => {
          const target = event.currentTarget as HTMLInputElement
          props.onValueCommit?.(target.value || undefined)
        }),
      ]}
    />
  )
}
