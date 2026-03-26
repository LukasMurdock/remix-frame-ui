import { on, type Handle } from "remix/component"
import { parseISODate } from "./DatePicker"
import { parseTimeValue } from "./TimePicker"

export type DateTimePickerParts = {
  date: string | undefined
  time: string | undefined
}

export type DateTimePickerProps = {
  id?: string
  name?: string
  dateName?: string
  timeName?: string
  value?: string
  defaultValue?: string
  minDate?: string
  maxDate?: string
  minTime?: string
  maxTime?: string
  step?: number
  disabled?: boolean
  required?: boolean
  onValueChange?: (value: string | undefined) => void
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

export function splitDateTimeLocal(value?: string): DateTimePickerParts {
  if (!value) return { date: undefined, time: undefined }
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}(?::\d{2})?)$/.exec(value)
  if (!match) return { date: undefined, time: undefined }

  const date = parseISODate(match[1]) ? match[1] : undefined
  const time = parseTimeValue(match[2]) ? match[2] : undefined
  return { date, time }
}

export function joinDateTimeLocal(date?: string, time?: string): string | undefined {
  if (!date || !time) return undefined
  if (!parseISODate(date) || !parseTimeValue(time)) return undefined
  return `${date}T${time}`
}

export function normalizeDateTimeLocal(value?: string): string | undefined {
  const parts = splitDateTimeLocal(value)
  return joinDateTimeLocal(parts.date, parts.time)
}

export function DateTimePicker(handle: Handle) {
  let uncontrolledValue: string | undefined

  function setValue(props: DateTimePickerProps, next: string | undefined): void {
    if (props.value === undefined) {
      uncontrolledValue = next
      handle.update()
    }
    props.onValueChange?.(next)
  }

  return (props: DateTimePickerProps) => {
    if (uncontrolledValue === undefined && props.defaultValue !== undefined) {
      uncontrolledValue = normalizeDateTimeLocal(props.defaultValue)
    }

    const value = normalizeDateTimeLocal(props.value ?? uncontrolledValue)
    const parts = splitDateTimeLocal(value)
    const dateId = props.id ? `${props.id}-date` : undefined
    const timeId = props.id ? `${props.id}-time` : undefined

    const updateParts = (nextParts: DateTimePickerParts) => {
      const next = joinDateTimeLocal(nextParts.date, nextParts.time)
      setValue(props, next)
    }

    return (
      <div className="rf-date-time-picker">
        <div className="rf-date-time-picker-fields">
          <input
            id={dateId}
            type="date"
            name={props.dateName}
            value={parts.date ?? ""}
            min={props.minDate}
            max={props.maxDate}
            disabled={props.disabled}
            required={props.required}
            aria-describedby={props["aria-describedby"]}
            aria-invalid={props["aria-invalid"]}
            className="rf-input-base rf-focus-ring"
            mix={[
              on("input", (event) => {
                const target = event.currentTarget as HTMLInputElement
                updateParts({ date: target.value || undefined, time: parts.time })
              }),
            ]}
          />
          <input
            id={timeId}
            type="time"
            name={props.timeName}
            value={parts.time ?? ""}
            min={props.minTime}
            max={props.maxTime}
            step={props.step}
            disabled={props.disabled}
            required={props.required}
            aria-describedby={props["aria-describedby"]}
            aria-invalid={props["aria-invalid"]}
            className="rf-input-base rf-focus-ring rf-time-picker"
            mix={[
              on("input", (event) => {
                const target = event.currentTarget as HTMLInputElement
                updateParts({ date: parts.date, time: target.value || undefined })
              }),
            ]}
          />
        </div>
        {props.name ? <input type="hidden" name={props.name} value={value ?? ""} /> : null}
      </div>
    )
  }
}
