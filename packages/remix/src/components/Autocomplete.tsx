import { on, ref, type Handle } from "remix/component"
import { filterComboboxOptions, findFirstEnabledIndex, findNextEnabledIndex, type ComboboxOption } from "./Combobox"

export type AutocompleteOption = ComboboxOption

export type AutocompleteCommit = {
  value: string
  option?: AutocompleteOption
}

export type AutocompleteProps = {
  id?: string
  name?: string
  options: AutocompleteOption[]
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  onValueChange?: (value: string) => void
  onCommit?: (commit: AutocompleteCommit) => void
}

export function resolveAutocompleteCommit(options: AutocompleteOption[], highlighted: number, fallbackValue: string): AutocompleteCommit {
  const option = highlighted >= 0 ? options[highlighted] : undefined
  if (option && !option.disabled) {
    return { value: option.value, option }
  }
  return { value: fallbackValue }
}

export function Autocomplete(handle: Handle) {
  let localValue = ""
  let open = false
  let highlighted = -1
  let rootElement: HTMLElement | null = null

  function findSelectedEnabledIndex(options: AutocompleteOption[], selectedValue: string): number {
    return options.findIndex((option) => !option.disabled && option.value === selectedValue)
  }

  function setValue(props: AutocompleteProps, next: string): void {
    if (props.value === undefined) {
      localValue = next
    }
    props.onValueChange?.(next)
  }

  function commit(props: AutocompleteProps, next: AutocompleteCommit): void {
    setValue(props, next.value)
    props.onCommit?.(next)
  }

  function close(): void {
    open = false
  }

  return (props: AutocompleteProps) => {
    if (localValue === "") {
      localValue = props.defaultValue ?? ""
    }

    const value = props.value ?? localValue
    const visible = filterComboboxOptions(props.options, value)
    if (highlighted >= 0 && (!visible[highlighted] || visible[highlighted]?.disabled)) {
      highlighted = -1
    }

    const listId = `${handle.id}-listbox`
    const activeOption = open && highlighted >= 0 ? visible[highlighted] : undefined

    return (
      <div
        className="rf-combobox"
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
          })
        ]}
      >
        <input
          id={props.id}
          name={props.name}
          disabled={props.disabled}
          required={props.required}
          type="text"
          className="rf-input-base rf-focus-ring"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={activeOption ? `${handle.id}-opt-${activeOption.id}` : undefined}
          placeholder={props.placeholder}
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
                event.preventDefault()
                const next = resolveAutocompleteCommit(visible, highlighted, value)
                commit(props, next)
                close()
                handle.update()
              } else if (event.key === "Tab") {
                if (!open) return
                const option = highlighted >= 0 ? visible[highlighted] : undefined
                if (!option || option.disabled) return
                commit(props, { value: option.value, option })
                close()
                handle.update()
              }
            })
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
                    commit(props, { value: option.value, option })
                    close()
                    handle.update()
                  })
                ]}
              >
                {option.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }
}
