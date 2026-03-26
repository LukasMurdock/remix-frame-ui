import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type CommandItem = {
  id: string
  label: ComponentChildren
  keywords?: string[]
  disabled?: boolean
}

export type CommandPaletteProps = {
  open: boolean
  title?: ComponentChildren
  commands: CommandItem[]
  onClose: () => void
  onSelect?: (id: string) => void
}

export function filterCommands(commands: CommandItem[], query: string): CommandItem[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return commands

  return commands.filter((command) => {
    const haystack = [String(command.label), ...(command.keywords ?? [])].join(" ").toLowerCase()
    return haystack.includes(normalized)
  })
}

export function findNextEnabledCommandIndex(commands: CommandItem[], current: number, step: 1 | -1): number {
  if (commands.length === 0) return -1

  let next = current
  for (let i = 0; i < commands.length; i++) {
    next = (next + step + commands.length) % commands.length
    if (!commands[next]?.disabled) return next
  }
  return -1
}

export function CommandPalette(handle: Handle) {
  let query = ""
  let highlighted = -1

  return (props: CommandPaletteProps) => {
    if (!props.open) return null

    const filtered = filterCommands(props.commands, query)
    if (highlighted === -1 || !filtered[highlighted] || filtered[highlighted]?.disabled) {
      highlighted = findNextEnabledCommandIndex(filtered, filtered.length - 1, 1)
    }

    const listId = `${handle.id}-commands`

    return (
      <div
        className="rf-command-overlay"
        role="presentation"
        mix={[
          on("click", (event) => {
            if (event.target !== event.currentTarget) return
            props.onClose()
          }),
        ]}
      >
        <section
          className="rf-command"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          mix={[
            on("keydown", (event) => {
              if (event.key === "Escape") {
                props.onClose()
              }
            }),
          ]}
        >
          <header className="rf-command-header">
            <h2 className="rf-command-title">{props.title ?? "Command palette"}</h2>
          </header>
          <input
            type="search"
            className="rf-input-base rf-focus-ring"
            placeholder="Search commands"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={true}
            aria-controls={listId}
            list={listId}
            mix={[
              on("input", (event) => {
                const target = event.currentTarget as HTMLInputElement
                query = target.value
                highlighted = findNextEnabledCommandIndex(filterCommands(props.commands, target.value), filtered.length - 1, 1)
                handle.update()
              }),
              on("keydown", (event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault()
                  const next = findNextEnabledCommandIndex(filtered, highlighted < 0 ? filtered.length - 1 : highlighted, 1)
                  if (next < 0) return
                  highlighted = next
                  handle.update()
                } else if (event.key === "ArrowUp") {
                  event.preventDefault()
                  const next = findNextEnabledCommandIndex(filtered, highlighted < 0 ? 0 : highlighted, -1)
                  if (next < 0) return
                  highlighted = next
                  handle.update()
                } else if (event.key === "Enter") {
                  const active = filtered[highlighted]
                  if (!active || active.disabled) return
                  props.onSelect?.(active.id)
                  props.onClose()
                }
              }),
            ]}
          />

          <ul id={listId} role="listbox" className="rf-command-list">
            {filtered.length === 0 ? <li className="rf-command-empty">No commands found</li> : null}
            {filtered.map((command, index) => (
              <li
                key={command.id}
                role="option"
                aria-selected={index === highlighted}
                data-highlighted={index === highlighted ? "true" : "false"}
                data-disabled={command.disabled ? "true" : "false"}
                className="rf-command-item"
                mix={[
                  on("click", () => {
                    if (command.disabled) return
                    props.onSelect?.(command.id)
                    props.onClose()
                  }),
                ]}
              >
                {command.label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  }
}
