import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type CascaderOption = {
  value: string
  label: ComponentChildren
  children?: CascaderOption[]
  disabled?: boolean
}

export type CascaderProps = {
  options: CascaderOption[]
  /** @default [] */
  value?: string[]
  /** @default [] */
  defaultValue?: string[]
  /** @default false */
  open?: boolean
  /** @default false */
  defaultOpen?: boolean
  /** @default "Select" */
  placeholder?: ComponentChildren
  /** @default "No options" */
  emptyState?: ComponentChildren
  /** @default false */
  changeOnSelect?: boolean
  /** @default "Cascader" */
  ariaLabel?: string
  onChange?: (value: string[]) => void
  onOpenChange?: (open: boolean) => void
}

export function isCascaderLeaf(option: CascaderOption): boolean {
  return !option.children || option.children.length === 0
}

export function resolveCascaderPath(options: CascaderOption[], value?: string[]): string[] {
  if (!value || value.length === 0) return []

  const resolved: string[] = []
  let currentOptions = options

  for (const segment of value) {
    const match = currentOptions.find((option) => option.value === segment)
    if (!match) break
    resolved.push(match.value)
    currentOptions = match.children ?? []
  }

  return resolved
}

export function resolveCascaderColumns(options: CascaderOption[], path: string[]): CascaderOption[][] {
  const columns: CascaderOption[][] = []
  let currentOptions = options
  columns.push(currentOptions)

  for (const segment of path) {
    const match = currentOptions.find((option) => option.value === segment)
    if (!match || !match.children || match.children.length === 0) break
    currentOptions = match.children
    columns.push(currentOptions)
  }

  return columns
}

export function resolveCascaderPathLabels(options: CascaderOption[], path: string[]): string[] {
  const labels: string[] = []
  let currentOptions = options

  for (const segment of path) {
    const match = currentOptions.find((option) => option.value === segment)
    if (!match) break
    labels.push(String(match.label))
    currentOptions = match.children ?? []
  }

  return labels
}

export function resolveCascaderTriggerLabel(
  options: CascaderOption[],
  path: string[],
  placeholder: ComponentChildren,
): ComponentChildren {
  const labels = resolveCascaderPathLabels(options, path)
  if (labels.length === 0) return placeholder
  return labels.join(" / ")
}

export function shouldCascaderCommitSelection(
  option: CascaderOption,
  changeOnSelect?: boolean,
): { commit: boolean; close: boolean } {
  const leaf = isCascaderLeaf(option)
  if (leaf) return { commit: true, close: true }
  if (changeOnSelect) return { commit: true, close: false }
  return { commit: false, close: false }
}

export function findCascaderOptionIndex(column: CascaderOption[], value?: string): number {
  if (!value) return -1
  return column.findIndex((option) => option.value === value)
}

export function findNextEnabledCascaderOption(column: CascaderOption[], start: number, step: 1 | -1): number {
  if (column.length === 0) return -1

  let cursor = start
  for (let count = 0; count < column.length; count += 1) {
    cursor = (cursor + step + column.length) % column.length
    if (!column[cursor]?.disabled) {
      return cursor
    }
  }

  return -1
}

export function Cascader(handle: Handle) {
  let localValue: string[] | undefined
  let localOpen: boolean | undefined
  let localPanelPath: string[] | undefined
  let rootElement: HTMLElement | null = null
  let triggerElement: HTMLButtonElement | null = null
  let panelElement: HTMLElement | null = null

  return (props: CascaderProps) => {
    if (props.value === undefined && localValue === undefined) {
      localValue = resolveCascaderPath(props.options, props.defaultValue)
    }

    if (props.open === undefined && localOpen === undefined) {
      localOpen = props.defaultOpen ?? false
    }

    const selectedPath = props.value ?? localValue ?? []
    const open = props.open ?? localOpen ?? false
    const panelPath = localPanelPath ?? selectedPath
    const columns = resolveCascaderColumns(props.options, panelPath)

    const focusOption = (columnIndex: number, preferredValue?: string) => {
      if (!panelElement) return
      const buttons = Array.from(
        panelElement.querySelectorAll(`.rf-cascader-option[data-column-index='${columnIndex}']`),
      ).filter((element): element is HTMLButtonElement => element instanceof HTMLButtonElement)
      if (buttons.length === 0) return

      const preferred = preferredValue
        ? buttons.find((button) => button.dataset.value === preferredValue && !button.disabled)
        : undefined

      const active = buttons.find((button) => button.dataset.active === "true" && !button.disabled)
      const firstEnabled = buttons.find((button) => !button.disabled)

      const target = preferred ?? active ?? firstEnabled
      target?.focus()
    }

    const setOpen = (next: boolean) => {
      if (props.open === undefined) {
        localOpen = next
      }
      if (next) {
        localPanelPath = selectedPath
      }
      props.onOpenChange?.(next)
      handle.update()
    }

    const setSelectedPath = (next: string[]) => {
      const resolved = resolveCascaderPath(props.options, next)
      if (props.value === undefined) {
        localValue = resolved
      }
      props.onChange?.(resolved)
      handle.update()
    }

    const selectOptionAt = (option: CascaderOption, columnIndex: number) => {
      if (option.disabled) return

      const nextPath = panelPath.slice(0, columnIndex).concat(option.value)
      localPanelPath = nextPath

      const commit = shouldCascaderCommitSelection(option, props.changeOnSelect)

      if (commit.commit) {
        setSelectedPath(nextPath)
      }

      if (commit.close) {
        setOpen(false)
      } else {
        handle.update()
      }
    }

    const triggerLabel = resolveCascaderTriggerLabel(props.options, selectedPath, props.placeholder ?? "Select")

    return (
      <section
        className="rf-cascader"
        data-open={open ? "true" : "false"}
        mix={[
          ref((node, signal) => {
            rootElement = node

            if (typeof document === "undefined") return

            const onPointerDown = (event: Event) => {
              const target = event.target
              if (!(target instanceof Node)) return
              if (!rootElement || rootElement.contains(target)) return
              if (!open) return
              setOpen(false)
            }

            document.addEventListener("pointerdown", onPointerDown, { signal })
          }),
          on("focusout", () => {
            handle.queueTask(() => {
              if (!rootElement || !open) return
              const active = document.activeElement
              if (active instanceof Node && rootElement.contains(active)) return
              setOpen(false)
            })
          }),
        ]}
      >
        <button
          type="button"
          className="rf-cascader-trigger rf-focus-ring"
          aria-haspopup="listbox"
          aria-expanded={open ? "true" : "false"}
          aria-label={props.ariaLabel ?? "Cascader"}
          mix={[
            ref((node) => {
              triggerElement = node
            }),
            on("click", () => setOpen(!open)),
            on("keydown", (event) => {
              if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
                event.preventDefault()
                if (!open) {
                  setOpen(true)
                  handle.queueTask(() => {
                    const focusColumn = Math.max(0, columns.length - 1)
                    focusOption(focusColumn, panelPath[focusColumn])
                  })
                }
              } else if (event.key === "Escape" && open) {
                event.preventDefault()
                setOpen(false)
              }
            }),
          ]}
        >
          <span className="rf-cascader-trigger-label">{triggerLabel}</span>
          <span className="rf-cascader-trigger-icon" aria-hidden="true">
            {open ? "▴" : "▾"}
          </span>
        </button>

        {open ? (
          <div
            className="rf-cascader-panel"
            role="listbox"
            mix={[
              ref((node) => {
                panelElement = node
              }),
              on("keydown", (event) => {
                const key = event.key
                if (key === "Escape") {
                  event.preventDefault()
                  setOpen(false)
                  handle.queueTask(() => {
                    triggerElement?.focus()
                  })
                  return
                }

                const target = event.target
                if (!(target instanceof HTMLElement)) return
                const optionButton = target.closest(".rf-cascader-option")
                if (!(optionButton instanceof HTMLButtonElement)) return

                const columnIndex = Number(optionButton.dataset.columnIndex ?? "0")
                const currentColumn = columns[columnIndex]
                if (!currentColumn) return

                const currentValue = optionButton.dataset.value
                const currentIndex = findCascaderOptionIndex(currentColumn, currentValue)

                if (key === "ArrowDown" || key === "ArrowUp") {
                  event.preventDefault()
                  const direction = key === "ArrowDown" ? 1 : -1
                  const nextIndex = findNextEnabledCascaderOption(currentColumn, currentIndex, direction)
                  if (nextIndex >= 0) {
                    focusOption(columnIndex, currentColumn[nextIndex]?.value)
                  }
                  return
                }

                if (key === "ArrowRight") {
                  event.preventDefault()
                  const currentOption = currentColumn[currentIndex]
                  if (!currentOption || currentOption.disabled || isCascaderLeaf(currentOption)) return

                  const nextPath = panelPath.slice(0, columnIndex).concat(currentOption.value)
                  localPanelPath = nextPath
                  handle.update()
                  handle.queueTask(() => {
                    focusOption(columnIndex + 1)
                  })
                  return
                }

                if (key === "ArrowLeft") {
                  if (columnIndex === 0) return
                  event.preventDefault()

                  const nextPath = panelPath.slice(0, columnIndex)
                  localPanelPath = nextPath
                  handle.update()
                  handle.queueTask(() => {
                    focusOption(columnIndex - 1, nextPath[columnIndex - 1])
                  })
                  return
                }

                if (key === "Enter" || key === " ") {
                  event.preventDefault()
                  const currentOption = currentColumn[currentIndex]
                  if (!currentOption) return
                  selectOptionAt(currentOption, columnIndex)
                }
              }),
            ]}
          >
            {props.options.length === 0 ? (
              <p className="rf-cascader-empty">{props.emptyState ?? "No options"}</p>
            ) : (
              <div className="rf-cascader-columns">
                {columns.map((column, columnIndex) => (
                  <ul key={`column-${columnIndex}`} className="rf-cascader-column" role="list">
                    {column.map((option) => {
                      const nextPath = panelPath.slice(0, columnIndex).concat(option.value)
                      const selected = selectedPath.join("/") === nextPath.join("/")
                      const active = panelPath[columnIndex] === option.value

                      return (
                        <li key={option.value}>
                          <button
                            type="button"
                            className="rf-cascader-option rf-focus-ring"
                            data-column-index={String(columnIndex)}
                            data-value={option.value}
                            data-selected={selected ? "true" : "false"}
                            data-active={active ? "true" : "false"}
                            disabled={option.disabled}
                            mix={[
                              on("click", () => {
                                selectOptionAt(option, columnIndex)
                              }),
                            ]}
                          >
                            <span className="rf-cascader-option-label">{option.label}</span>
                            {!isCascaderLeaf(option) ? <span className="rf-cascader-option-icon">›</span> : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </section>
    )
  }
}
