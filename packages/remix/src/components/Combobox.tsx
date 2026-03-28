import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type ComboboxOption = {
  id: string
  label: ComponentChildren
  value: string
  textValue?: string
  disabled?: boolean
}

export type ComboboxProps = {
  id?: string
  label: ComponentChildren
  options: ComboboxOption[]
  /** @default "" */
  value?: string
  /** @default "" */
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export function filterComboboxOptions(options: ComboboxOption[], query: string): ComboboxOption[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return options

  return options.filter((option) => {
    const haystack = [option.textValue ?? "", option.value, String(option.label)].join(" ").toLowerCase()
    return haystack.includes(normalized)
  })
}

export function findNextEnabledIndex(options: ComboboxOption[], current: number, step: 1 | -1): number {
  if (options.length === 0) return -1
  let next = current

  for (let i = 0; i < options.length; i++) {
    next = (next + step + options.length) % options.length
    if (!options[next]?.disabled) return next
  }

  return -1
}

export function findFirstEnabledIndex(options: ComboboxOption[]): number {
  return options.findIndex((option) => !option.disabled)
}

export function Combobox(handle: Handle) {
  let localValue = ""
  let open = false
  let highlighted = -1
  let rootElement: HTMLElement | null = null

  function findSelectedEnabledIndex(options: ComboboxOption[], selectedValue: string): number {
    return options.findIndex((option) => !option.disabled && option.value === selectedValue)
  }

  function setValue(props: ComboboxProps, next: string): void {
    if (props.value === undefined) {
      localValue = next
    }
    props.onValueChange?.(next)
  }

  function close(): void {
    open = false
  }

  return (props: ComboboxProps) => {
    if (localValue === "") {
      localValue = props.defaultValue ?? ""
    }

    const value = props.value ?? localValue
    const visible = filterComboboxOptions(props.options, value)
    if (highlighted >= 0 && (!visible[highlighted] || visible[highlighted]?.disabled)) {
      highlighted = -1
    }

    const listId = `${handle.id}-listbox`
    const inputId = props.id ?? `${handle.id}-input`
    const activeOption = open && highlighted >= 0 ? visible[highlighted] : undefined

    return (
      <div
        className="rf-field"
        mix={[
          ref((node, signal) => {
            rootElement = node

            if (typeof document === "undefined") return
            const onPointerDown = (event: Event) => {
              const target = event.target
              if (!(target instanceof Node)) return
              if (!rootElement || rootElement.contains(target)) return
              close()
              handle.update()
            }

            document.addEventListener("pointerdown", onPointerDown, { signal })
          }),
        ]}
      >
        <label htmlFor={inputId} className="rf-combobox-label">
          {props.label}
        </label>

        <div className="rf-combobox">
          <input
            id={inputId}
            type="text"
            className="rf-input-base rf-focus-ring"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={activeOption ? `${handle.id}-opt-${activeOption.id}` : undefined}
            value={value}
            mix={[
              on("input", (event) => {
                const target = event.currentTarget as HTMLInputElement
                open = true
                setValue(props, target.value)
                highlighted = findFirstEnabledIndex(filterComboboxOptions(props.options, target.value))
                handle.update()
              }),
              on("focusin", () => {
                highlighted = -1
              }),
              on("click", () => {
                open = true
                highlighted = findSelectedEnabledIndex(visible, value)
                handle.update()
              }),
              on("focusout", () => {
                handle.queueTask(() => {
                  if (!rootElement) return
                  const active = document.activeElement
                  if (active instanceof Node && rootElement.contains(active)) return
                  close()
                  handle.update()
                })
              }),
              on("keydown", (event) => {
                if (event.key === "Escape") {
                  close()
                  handle.update()
                } else if (event.key === "ArrowDown") {
                  event.preventDefault()
                  if (!open) {
                    open = true
                    highlighted = findFirstEnabledIndex(visible)
                    handle.update()
                    return
                  }

                  const next = findNextEnabledIndex(visible, highlighted < 0 ? visible.length - 1 : highlighted, 1)
                  if (next >= 0) {
                    highlighted = next
                    handle.update()
                  }
                } else if (event.key === "ArrowUp") {
                  event.preventDefault()
                  const start = highlighted < 0 ? 0 : highlighted
                  const next = findNextEnabledIndex(visible, start, -1)
                  if (next >= 0) {
                    highlighted = next
                    open = true
                    handle.update()
                  }
                } else if (event.key === "Enter") {
                  const option = highlighted >= 0 ? visible[highlighted] : undefined
                  if (!option || option.disabled) return
                  setValue(props, option.value)
                  close()
                  handle.update()
                }
              }),
            ]}
          />

          {open ? (
            <ul id={listId} role="listbox" className="rf-combobox-list">
              {visible.length === 0 ? <li className="rf-combobox-empty">No matches</li> : null}
              {visible.map((option, index) => (
                <li
                  id={`${handle.id}-opt-${option.id}`}
                  key={option.id}
                  role="option"
                  aria-selected={index === highlighted}
                  data-highlighted={index === highlighted ? "true" : "false"}
                  data-disabled={option.disabled ? "true" : "false"}
                  className="rf-combobox-option"
                  mix={[
                    on("mousedown", (event) => {
                      event.preventDefault()
                    }),
                    on("click", () => {
                      if (option.disabled) return
                      setValue(props, option.value)
                      close()
                      handle.update()
                    }),
                  ]}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    )
  }
}
