import { on, ref, type Handle } from "remix/component"
import { addDays, addMonths, buildCalendarCells, formatISODate, monthStart, parseISODate } from "./DatePicker"

export type DateRangeValue = {
  start?: string
  end?: string
}

export type DateRangePickerProps = {
  id?: string
  startName?: string
  endName?: string
  /** @default {} */
  value?: DateRangeValue
  /** @default {} */
  defaultValue?: DateRangeValue
  disabled?: boolean
  min?: string
  max?: string
  onValueChange?: (value: DateRangeValue) => void
}

export function nextDateRangeSelection(current: DateRangeValue, pickedISO: string): DateRangeValue {
  if (!current.start || (current.start && current.end)) {
    return { start: pickedISO }
  }

  if (pickedISO < current.start) {
    return { start: pickedISO, end: current.start }
  }

  return { start: current.start, end: pickedISO }
}

export function isDateWithinRange(iso: string, range: DateRangeValue): boolean {
  if (!range.start || !range.end) return false
  return iso >= range.start && iso <= range.end
}

export function formatDateRangeValue(range: DateRangeValue): string {
  if (!range.start && !range.end) return ""
  if (range.start && !range.end) return `${range.start} -`
  if (!range.start && range.end) return `- ${range.end}`
  return `${range.start} - ${range.end}`
}

function isDisabled(date: Date, min?: string, max?: string): boolean {
  const minDate = parseISODate(min)
  const maxDate = parseISODate(max)
  if (minDate && date < minDate) return true
  if (maxDate && date > maxDate) return true
  return false
}

function findNextEnabledDate(start: Date, step: number, min?: string, max?: string): Date {
  let date = addDays(start, step)
  for (let i = 0; i < 370; i += 1) {
    if (!isDisabled(date, min, max)) return date
    date = addDays(date, step)
  }
  return start
}

export function DateRangePicker(handle: Handle) {
  let uncontrolledRange: DateRangeValue | undefined
  let open = false
  let viewMonth = monthStart(new Date())
  let activeISO: string | undefined
  let rootElement: HTMLElement | null = null

  function setRange(props: DateRangePickerProps, next: DateRangeValue): void {
    if (props.value === undefined) {
      uncontrolledRange = next
    }
    props.onValueChange?.(next)
  }

  return (props: DateRangePickerProps) => {
    if (uncontrolledRange === undefined && props.defaultValue) {
      uncontrolledRange = props.defaultValue
    }

    const range = props.value ?? uncontrolledRange ?? {}
    const selectedStart = range.start
    const selectedEnd = range.end
    const displayValue = formatDateRangeValue(range)
    const cells = buildCalendarCells(viewMonth, props.min, props.max)

    const openPicker = () => {
      const focusDate = parseISODate(selectedStart) ?? parseISODate(selectedEnd) ?? new Date()
      viewMonth = monthStart(focusDate)
      activeISO = formatISODate(focusDate)
      open = true
      handle.update()
      handle.queueTask(() => {
        if (!rootElement || !activeISO) return
        const target = rootElement.querySelector(`[data-date="${activeISO}"]`)
        if (target instanceof HTMLButtonElement) target.focus()
      })
    }

    return (
      <div
        className="rf-date-picker rf-date-range-picker"
        mix={[
          ref((node, signal) => {
            rootElement = node
            if (typeof document === "undefined") return
            const onPointerDown = (event: Event) => {
              const target = event.target
              if (!(target instanceof Node)) return
              if (node.contains(target)) return
              if (!open) return
              open = false
              handle.update()
            }
            document.addEventListener("pointerdown", onPointerDown, { signal })
          }),
        ]}
      >
        <div className="rf-date-picker-field">
          <input
            id={props.id}
            type="text"
            className="rf-input-base rf-focus-ring"
            value={displayValue}
            placeholder="YYYY-MM-DD - YYYY-MM-DD"
            readOnly
            disabled={props.disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? `${handle.id}-range` : undefined}
            mix={[
              on("click", () => {
                if (props.disabled) return
                if (!open) openPicker()
              }),
              on("keydown", (event) => {
                if (props.disabled) return
                if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openPicker()
                }
                if (event.key === "Escape") {
                  open = false
                  handle.update()
                }
              }),
            ]}
          />
          <button
            type="button"
            className="rf-date-picker-toggle rf-focus-ring"
            aria-label={open ? "Close calendar" : "Open calendar"}
            disabled={props.disabled}
            mix={[
              on("click", () => {
                if (open) {
                  open = false
                  handle.update()
                } else {
                  openPicker()
                }
              }),
            ]}
          >
            📅
          </button>
        </div>

        {props.startName ? <input type="hidden" name={props.startName} value={selectedStart ?? ""} /> : null}
        {props.endName ? <input type="hidden" name={props.endName} value={selectedEnd ?? ""} /> : null}

        {open ? (
          <section
            id={`${handle.id}-range`}
            role="dialog"
            aria-label="Choose date range"
            className="rf-date-picker-panel"
          >
            <header className="rf-date-picker-header">
              <button
                type="button"
                className="rf-date-picker-nav rf-focus-ring"
                aria-label="Previous month"
                mix={[
                  on("click", () => {
                    viewMonth = monthStart(addMonths(viewMonth, -1))
                    handle.update()
                  }),
                ]}
              >
                ‹
              </button>
              <h3 className="rf-date-picker-title">
                {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
              <button
                type="button"
                className="rf-date-picker-nav rf-focus-ring"
                aria-label="Next month"
                mix={[
                  on("click", () => {
                    viewMonth = monthStart(addMonths(viewMonth, 1))
                    handle.update()
                  }),
                ]}
              >
                ›
              </button>
            </header>

            <table className="rf-date-picker-grid">
              <thead>
                <tr>
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, weekIndex) => (
                  <tr key={`week-${weekIndex}`}>
                    {cells.slice(weekIndex * 7, weekIndex * 7 + 7).map((cell) => {
                      const selected = cell.iso === selectedStart || cell.iso === selectedEnd
                      const inRange = isDateWithinRange(cell.iso, range)

                      return (
                        <td key={cell.iso}>
                          <button
                            type="button"
                            className="rf-date-picker-day rf-focus-ring"
                            data-date={cell.iso}
                            data-in-month={cell.inMonth ? "true" : "false"}
                            data-selected={selected ? "true" : "false"}
                            data-in-range={inRange ? "true" : "false"}
                            disabled={cell.disabled}
                            mix={[
                              on("click", () => {
                                if (cell.disabled) return
                                const next = nextDateRangeSelection(range, cell.iso)
                                setRange(props, next)
                                if (next.start && next.end) {
                                  open = false
                                }
                                handle.update()
                              }),
                              on("focus", () => {
                                activeISO = cell.iso
                              }),
                              on("keydown", (event) => {
                                if (cell.disabled) return
                                const activeDate = parseISODate(activeISO ?? cell.iso) ?? parseISODate(cell.iso)
                                if (!activeDate) return

                                const move = (days: number) => {
                                  const next = findNextEnabledDate(activeDate, days, props.min, props.max)
                                  activeISO = formatISODate(next)
                                  viewMonth = monthStart(next)
                                  handle.update()
                                  handle.queueTask(() => {
                                    if (!rootElement || !activeISO) return
                                    const target = rootElement.querySelector(`[data-date="${activeISO}"]`)
                                    if (target instanceof HTMLButtonElement) target.focus()
                                  })
                                }

                                if (event.key === "ArrowRight") {
                                  event.preventDefault()
                                  move(1)
                                } else if (event.key === "ArrowLeft") {
                                  event.preventDefault()
                                  move(-1)
                                } else if (event.key === "ArrowDown") {
                                  event.preventDefault()
                                  move(7)
                                } else if (event.key === "ArrowUp") {
                                  event.preventDefault()
                                  move(-7)
                                } else if (event.key === "Escape") {
                                  event.preventDefault()
                                  open = false
                                  handle.update()
                                }
                              }),
                            ]}
                          >
                            {cell.day}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <footer className="rf-date-picker-footer">
              <button
                type="button"
                className="rf-button rf-focus-ring"
                data-variant="ghost"
                mix={[
                  on("click", () => {
                    setRange(props, {})
                    open = false
                    handle.update()
                  }),
                ]}
              >
                Clear
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    )
  }
}
