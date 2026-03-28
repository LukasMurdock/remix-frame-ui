import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TabBarItem = {
  id: string
  label: ComponentChildren
  icon?: ComponentChildren
  badge?: ComponentChildren
  disabled?: boolean
}

export type TabBarProps = {
  items: readonly TabBarItem[]
  value?: string
  /** @default first enabled item id */
  defaultValue?: string
  onChange?: (id: string) => void
  /** @default false */
  compact?: boolean
  /** @default true */
  safeArea?: boolean
  /** @default "Tab bar" */
  ariaLabel?: string
}

export function resolveTabBarCompact(compact?: boolean): boolean {
  return compact ?? false
}

export function resolveTabBarSafeArea(safeArea?: boolean): boolean {
  return safeArea ?? true
}

export function resolveTabBarValue(items: readonly TabBarItem[], value?: string): string | undefined {
  if (value !== undefined) {
    const selected = items.find((item) => item.id === value && !item.disabled)
    if (selected) return selected.id
  }

  for (const item of items) {
    if (!item.disabled) return item.id
  }

  return undefined
}

export function resolveTabBarKeyboardTargetIndex(
  currentIndex: number,
  itemCount: number,
  key: "ArrowRight" | "ArrowLeft" | "Home" | "End",
): number {
  if (itemCount <= 0) return -1
  if (key === "Home") return 0
  if (key === "End") return itemCount - 1

  const safeCurrent = currentIndex >= 0 ? currentIndex : 0
  if (key === "ArrowRight") return (safeCurrent + 1) % itemCount
  return (safeCurrent - 1 + itemCount) % itemCount
}

export function resolveTabBarNextEnabledIndex(
  items: readonly TabBarItem[],
  startIndex: number,
  direction: 1 | -1,
): number {
  if (items.length === 0) return -1

  let index = startIndex
  for (let scanCount = 0; scanCount < items.length; scanCount += 1) {
    const normalized = (index + items.length) % items.length
    const item = items[normalized]
    if (item && !item.disabled) return normalized
    index += direction
  }

  return -1
}

export function TabBar(handle: Handle) {
  let localValue: string | undefined

  return (props: TabBarProps) => {
    if (props.value === undefined && localValue === undefined) {
      localValue = resolveTabBarValue(props.items, props.defaultValue)
    }

    const selected = resolveTabBarValue(props.items, props.value ?? localValue)
    const compact = resolveTabBarCompact(props.compact)
    const safeArea = resolveTabBarSafeArea(props.safeArea)

    const setValue = (next: string) => {
      if (selected === next) return

      if (props.value === undefined) {
        localValue = next
        handle.update()
      }

      props.onChange?.(next)
    }

    const itemCount = Math.max(1, props.items.length)

    return (
      <nav
        className="rf-tab-bar"
        data-compact={compact ? "true" : "false"}
        data-safe-area={safeArea ? "true" : "false"}
        aria-label={props.ariaLabel ?? "Tab bar"}
        style={`--rf-tab-bar-count: ${itemCount};`}
      >
        <ul className="rf-tab-bar-list" role="list">
          {props.items.map((item, index) => {
            const active = item.id === selected
            const tabId = `${handle.id}-tab-${item.id}`

            return (
              <li
                key={item.id}
                className="rf-tab-bar-item"
                data-active={active ? "true" : "false"}
                data-disabled={item.disabled ? "true" : "false"}
              >
                <button
                  id={tabId}
                  type="button"
                  className="rf-tab-bar-button rf-focus-ring"
                  aria-current={active ? "page" : undefined}
                  disabled={item.disabled}
                  mix={[
                    on("click", () => {
                      if (item.disabled) return
                      setValue(item.id)
                    }),
                    on("keydown", (event) => {
                      if (
                        event.key !== "ArrowRight" &&
                        event.key !== "ArrowLeft" &&
                        event.key !== "Home" &&
                        event.key !== "End"
                      ) {
                        return
                      }

                      event.preventDefault()

                      if (event.key === "Home") {
                        const firstEnabled = resolveTabBarNextEnabledIndex(props.items, 0, 1)
                        if (firstEnabled < 0) return
                        const next = props.items[firstEnabled]
                        if (!next) return
                        setValue(next.id)
                        const nextButton = document.getElementById(`${handle.id}-tab-${next.id}`)
                        if (nextButton instanceof HTMLElement) nextButton.focus()
                        return
                      }

                      if (event.key === "End") {
                        const lastEnabled = resolveTabBarNextEnabledIndex(props.items, props.items.length - 1, -1)
                        if (lastEnabled < 0) return
                        const next = props.items[lastEnabled]
                        if (!next) return
                        setValue(next.id)
                        const nextButton = document.getElementById(`${handle.id}-tab-${next.id}`)
                        if (nextButton instanceof HTMLElement) nextButton.focus()
                        return
                      }

                      const direction = event.key === "ArrowRight" ? 1 : -1
                      const targetIndex = resolveTabBarKeyboardTargetIndex(index, props.items.length, event.key)
                      const nextIndex = resolveTabBarNextEnabledIndex(props.items, targetIndex, direction)
                      if (nextIndex < 0) return

                      const next = props.items[nextIndex]
                      if (!next) return

                      setValue(next.id)
                      const nextButton = document.getElementById(`${handle.id}-tab-${next.id}`)
                      if (nextButton instanceof HTMLElement) nextButton.focus()
                    }),
                  ]}
                >
                  {item.icon !== undefined ? (
                    <span className="rf-tab-bar-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  ) : (
                    <span className="rf-tab-bar-icon" aria-hidden="true">
                      •
                    </span>
                  )}
                  <span className="rf-tab-bar-label">{item.label}</span>
                  {item.badge !== undefined ? (
                    <span className="rf-tab-bar-badge" aria-hidden="true">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
}
