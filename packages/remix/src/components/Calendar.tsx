import { on, type Handle } from "remix/component"

export type CalendarView = "month" | "year"

export type CalendarProps = {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  min?: string
  max?: string
  /** @default false */
  disabled?: boolean
  required?: boolean
  /** @default "month" */
  view?: CalendarView
  onValueChange?: (value: string | undefined) => void
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

export function resolveCalendarView(view?: CalendarView): CalendarView {
  return view ?? "month"
}

export function resolveCalendarDisabled(disabled?: boolean): boolean {
  return disabled ?? false
}

export function resolveCalendarType(view?: CalendarView): "date" | "month" {
  return resolveCalendarView(view) === "year" ? "month" : "date"
}

export function Calendar(_handle: Handle) {
  return (props: CalendarProps) => {
    const disabled = resolveCalendarDisabled(props.disabled)
    const view = resolveCalendarView(props.view)

    return (
      <input
        id={props.id}
        name={props.name}
        className="rf-calendar rf-input-base rf-focus-ring"
        type={resolveCalendarType(view)}
        value={props.value}
        defaultValue={props.defaultValue}
        min={props.min}
        max={props.max}
        disabled={disabled}
        required={props.required}
        aria-describedby={props["aria-describedby"]}
        aria-invalid={props["aria-invalid"]}
        data-view={view}
        mix={[
          on("input", (event) => {
            const target = event.currentTarget as HTMLInputElement
            props.onValueChange?.(target.value || undefined)
          }),
        ]}
      />
    )
  }
}
