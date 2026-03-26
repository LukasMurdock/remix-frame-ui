import type { Handle } from "remix/component"

export type CalendarView = "month" | "year"

export type CalendarProps = {
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  view?: CalendarView
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
        className="rf-calendar rf-input-base rf-focus-ring"
        type={resolveCalendarType(view)}
        value={props.value}
        min={props.min}
        max={props.max}
        disabled={disabled}
        data-view={view}
      />
    )
  }
}
