import { on, ref, type Handle } from "remix/component"

export type DatePickerProps = {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  min?: string
  max?: string
  onValueChange?: (value: string | undefined) => void
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

type CalendarCell = {
  iso: string
  day: number
  inMonth: boolean
  disabled: boolean
}

export function parseISODate(value?: string): Date | undefined {
  if (!value) return undefined
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined
  }

  return date
}

export function formatISODate(date: Date): string {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function addMonths(date: Date, months: number): Date {
  const targetMonthStart = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDayOfTargetMonth = new Date(
    targetMonthStart.getFullYear(),
    targetMonthStart.getMonth() + 1,
    0,
  ).getDate()

  return new Date(
    targetMonthStart.getFullYear(),
    targetMonthStart.getMonth(),
    Math.min(date.getDate(), lastDayOfTargetMonth),
  )
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && date < minDate) return true
  if (maxDate && date > maxDate) return true
  return false
}

export function buildCalendarCells(viewMonth: Date, min?: string, max?: string): CalendarCell[] {
  const minDate = parseISODate(min)
  const maxDate = parseISODate(max)
  const first = monthStart(viewMonth)
  const startOffset = first.getDay()
  const start = addDays(first, -startOffset)

  const cells: CalendarCell[] = []
  for (let index = 0; index < 42; index += 1) {
    const date = addDays(start, index)
    cells.push({
      iso: formatISODate(date),
      day: date.getDate(),
      inMonth: date.getMonth() === viewMonth.getMonth() && date.getFullYear() === viewMonth.getFullYear(),
      disabled: isDateDisabled(date, minDate, maxDate),
    })
  }
  return cells
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

function findNextEnabledDate(start: Date, step: number, min?: string, max?: string): Date {
  const minDate = parseISODate(min)
  const maxDate = parseISODate(max)
  let candidate = addDays(start, step)

  for (let i = 0; i < 370; i += 1) {
    if (!isDateDisabled(candidate, minDate, maxDate)) return candidate
    candidate = addDays(candidate, step)
  }

  return start
}

export function DatePicker(handle: Handle) {
  let uncontrolledValue: string | undefined
  let open = false
  let viewMonth = monthStart(new Date())
  let activeISO: string | undefined
  let rootElement: HTMLElement | null = null
  let inputElement: HTMLInputElement | null = null

  function setValue(props: DatePickerProps, next: string | undefined): void {
    if (props.value === undefined) {
      uncontrolledValue = next
    }
    props.onValueChange?.(next)
  }

  function setOpen(next: boolean, restoreFocus = false): void {
    open = next
    handle.update()
    if (!next && restoreFocus) {
      handle.queueTask(() => {
        inputElement?.focus()
      })
    }
  }

  function focusActiveDay(): void {
    handle.queueTask(() => {
      if (!rootElement || !activeISO) return
      const next = rootElement.querySelector(`[data-date="${activeISO}"]`)
      if (next instanceof HTMLButtonElement) next.focus()
    })
  }

  return (props: DatePickerProps) => {
    if (uncontrolledValue === undefined && props.defaultValue !== undefined) {
      uncontrolledValue = props.defaultValue
    }

    const selectedValue = props.value ?? uncontrolledValue
    const selectedDate = parseISODate(selectedValue)

    const openWithDate = (preferred?: Date) => {
      const initial = preferred ?? selectedDate ?? new Date()
      viewMonth = monthStart(initial)
      activeISO = formatISODate(initial)
      setOpen(true)
      focusActiveDay()
    }

    const cells = buildCalendarCells(viewMonth, props.min, props.max)
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    return (
      <div
        className="rf-date-picker"
        mix={[
          ref((node, signal) => {
            rootElement = node
            const root = node

            if (typeof document === "undefined") return
            const onPointerDown = (event: Event) => {
              const target = event.target
              if (!(target instanceof Node)) return
              if (root.contains(target)) return
              if (!open) return
              setOpen(false)
            }

            document.addEventListener("pointerdown", onPointerDown, { signal })
          }),
        ]}
      >
        <div className="rf-date-picker-field">
          <input
            id={props.id}
            type="text"
            name={props.name}
            className="rf-input-base rf-focus-ring"
            value={selectedValue ?? ""}
            placeholder={props.placeholder ?? "YYYY-MM-DD"}
            disabled={props.disabled}
            required={props.required}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? `${handle.id}-calendar` : undefined}
            aria-describedby={props["aria-describedby"]}
            aria-invalid={props["aria-invalid"]}
            mix={[
              ref((node) => {
                inputElement = node
              }),
              on("input", (event) => {
                const target = event.currentTarget as HTMLInputElement
                setValue(props, target.value || undefined)

                const parsed = parseISODate(target.value)
                if (parsed) {
                  viewMonth = monthStart(parsed)
                  activeISO = formatISODate(parsed)
                }
              }),
              on("click", () => {
                if (props.disabled) return
                if (!open) openWithDate()
              }),
              on("keydown", (event) => {
                if (props.disabled) return
                if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openWithDate()
                }
                if (event.key === "Escape") {
                  setOpen(false)
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
                if (open) setOpen(false, true)
                else openWithDate()
              }),
            ]}
          >
            📅
          </button>
        </div>

        {open ? (
          <section id={`${handle.id}-calendar`} role="dialog" aria-label="Choose date" className="rf-date-picker-panel">
            <header className="rf-date-picker-header">
              <button
                type="button"
                className="rf-date-picker-nav rf-focus-ring"
                aria-label="Previous month"
                mix={[
                  on("click", () => {
                    viewMonth = monthStart(addMonths(viewMonth, -1))
                    handle.update()
                    focusActiveDay()
                  }),
                ]}
              >
                ‹
              </button>
              <h3 className="rf-date-picker-title">{monthLabel(viewMonth)}</h3>
              <button
                type="button"
                className="rf-date-picker-nav rf-focus-ring"
                aria-label="Next month"
                mix={[
                  on("click", () => {
                    viewMonth = monthStart(addMonths(viewMonth, 1))
                    handle.update()
                    focusActiveDay()
                  }),
                ]}
              >
                ›
              </button>
            </header>

            <table className="rf-date-picker-grid">
              <thead>
                <tr>{weekDays.map((day) => <th key={day}>{day}</th>)}</tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, weekIndex) => (
                  <tr key={`week-${weekIndex}`}>
                    {cells.slice(weekIndex * 7, weekIndex * 7 + 7).map((cell) => (
                      <td key={cell.iso}>
                        <button
                          type="button"
                          data-date={cell.iso}
                          className="rf-date-picker-day rf-focus-ring"
                          data-in-month={cell.inMonth ? "true" : "false"}
                          data-selected={selectedValue === cell.iso ? "true" : "false"}
                          disabled={cell.disabled}
                          aria-current={selectedValue === cell.iso ? "date" : undefined}
                          mix={[
                            on("click", () => {
                              if (cell.disabled) return
                              setValue(props, cell.iso)
                              setOpen(false, true)
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
                                focusActiveDay()
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
                              } else if (event.key === "PageDown") {
                                event.preventDefault()
                                const next = addMonths(activeDate, 1)
                                activeISO = formatISODate(next)
                                viewMonth = monthStart(next)
                                handle.update()
                                focusActiveDay()
                              } else if (event.key === "PageUp") {
                                event.preventDefault()
                                const next = addMonths(activeDate, -1)
                                activeISO = formatISODate(next)
                                viewMonth = monthStart(next)
                                handle.update()
                                focusActiveDay()
                              } else if (event.key === "Home") {
                                event.preventDefault()
                                move(-activeDate.getDay())
                              } else if (event.key === "End") {
                                event.preventDefault()
                                move(6 - activeDate.getDay())
                              } else if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                setValue(props, cell.iso)
                                setOpen(false, true)
                              } else if (event.key === "Escape") {
                                event.preventDefault()
                                setOpen(false, true)
                              }
                            }),
                          ]}
                        >
                          {cell.day}
                        </button>
                      </td>
                    ))}
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
                    setValue(props, undefined)
                    setOpen(false, true)
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
