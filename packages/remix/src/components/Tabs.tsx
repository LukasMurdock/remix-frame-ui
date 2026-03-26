import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TabItem = {
  id: string
  label: ComponentChildren
  panel: ComponentChildren
}

export type TabsProps = {
  items: TabItem[]
  value?: string
  defaultValue?: string
  activation?: "manual" | "automatic"
  overflow?: "wrap" | "menu"
  maxVisibleTabs?: number
  overflowLabel?: ComponentChildren
}

export type TabsActivation = "manual" | "automatic"

export type TabsOverflowPartition = {
  visible: TabItem[]
  overflow: TabItem[]
}

export function resolveTabsOverflow(overflow?: "wrap" | "menu"): "wrap" | "menu" {
  return overflow ?? "wrap"
}

export function resolveTabsActivation(activation?: TabsActivation): TabsActivation {
  return activation ?? "manual"
}

export function resolveTabsMaxVisible(maxVisibleTabs?: number): number {
  if (maxVisibleTabs === undefined || Number.isNaN(maxVisibleTabs)) return 4
  return Math.max(1, Math.floor(maxVisibleTabs))
}

export function partitionTabsForOverflow(
  items: TabItem[],
  selectedId: string | undefined,
  maxVisibleTabs: number,
): TabsOverflowPartition {
  if (items.length <= maxVisibleTabs) {
    return { visible: items, overflow: [] }
  }

  const selectedIndex = selectedId ? items.findIndex((item) => item.id === selectedId) : -1

  if (selectedIndex >= 0 && selectedIndex >= maxVisibleTabs) {
    const selectedItem = items[selectedIndex]
    if (!selectedItem) {
      return {
        visible: items.slice(0, maxVisibleTabs),
        overflow: items.slice(maxVisibleTabs),
      }
    }

    const visible = [...items.slice(0, maxVisibleTabs - 1), selectedItem]
    const visibleIds = new Set(visible.map((item) => item.id))
    const overflow = items.filter((item) => !visibleIds.has(item.id))
    return { visible, overflow }
  }

  return {
    visible: items.slice(0, maxVisibleTabs),
    overflow: items.slice(maxVisibleTabs),
  }
}

export function resolveTabsKeyboardTargetIndex(
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

export function Tabs(handle: Handle) {
  let selectedId: string | undefined

  return (props: TabsProps) => {
    const selected = props.value ?? selectedId ?? props.defaultValue ?? props.items[0]?.id
    const activation = resolveTabsActivation(props.activation)
    const overflow = resolveTabsOverflow(props.overflow)
    const maxVisibleTabs = resolveTabsMaxVisible(props.maxVisibleTabs)
    const partition =
      overflow === "menu"
        ? partitionTabsForOverflow(props.items, selected, maxVisibleTabs)
        : { visible: props.items, overflow: [] }

    const overflowMenuId = `${handle.id}-tabs-overflow-menu`

    return (
      <section className="rf-tabs" data-activation={activation} data-overflow={overflow}>
        <div className="rf-tabs-controls">
          <div className="rf-tabs-list" role="tablist" aria-orientation="horizontal">
            {partition.visible.map((item) => {
              const active = item.id === selected
              const tabId = `${handle.id}-tab-${item.id}`
              const panelId = `${handle.id}-panel-${item.id}`

              return (
                <button
                  key={item.id}
                  id={tabId}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls={panelId}
                  tabIndex={active ? 0 : -1}
                  className="rf-tabs-trigger"
                  data-active={active ? "true" : "false"}
                  mix={[
                    on("click", () => {
                      if (props.value !== undefined) return
                      selectedId = item.id
                      handle.update()
                    }),
                    on("keydown", (event) => {
                      if (
                        event.key !== "ArrowRight" &&
                        event.key !== "ArrowLeft" &&
                        event.key !== "Home" &&
                        event.key !== "End" &&
                        event.key !== "Enter" &&
                        event.key !== " "
                      ) {
                        return
                      }

                      if (event.key === "Enter" || event.key === " ") {
                        if (activation !== "manual") return
                        event.preventDefault()
                        if (props.value !== undefined) return
                        selectedId = item.id
                        handle.update()
                        return
                      }

                      event.preventDefault()
                      const currentIndex = partition.visible.findIndex((candidate) => candidate.id === item.id)
                      const nextIndex = resolveTabsKeyboardTargetIndex(
                        currentIndex,
                        partition.visible.length,
                        event.key,
                      )
                      const nextItem = partition.visible[nextIndex]
                      if (!nextItem) return

                      const nextTabId = `${handle.id}-tab-${nextItem.id}`
                      const nextTab = document.getElementById(nextTabId)
                      if (nextTab instanceof HTMLElement) nextTab.focus()

                      if (activation === "automatic" && props.value === undefined) {
                        selectedId = nextItem.id
                        handle.update()
                      }
                    }),
                  ]}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {partition.overflow.length > 0 ? (
            <details className="rf-tabs-overflow">
              <summary className="rf-tabs-overflow-trigger" aria-haspopup="menu" aria-controls={overflowMenuId}>
                {props.overflowLabel ?? "More"} ({partition.overflow.length})
              </summary>
              <div id={overflowMenuId} className="rf-tabs-overflow-menu" role="menu" aria-label="Overflow tabs">
                {partition.overflow.map((item) => {
                  const active = item.id === selected
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={active}
                      className="rf-tabs-overflow-item"
                      data-active={active ? "true" : "false"}
                      mix={[
                        on("click", (event) => {
                          if (props.value !== undefined) return
                          selectedId = item.id
                          const target = event.currentTarget
                          if (target instanceof HTMLElement) {
                            const details = target.closest("details")
                            if (details instanceof HTMLDetailsElement) details.open = false
                          }
                          handle.update()
                        }),
                      ]}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </details>
          ) : null}
        </div>

        {props.items.map((item) => {
          const panelId = `${handle.id}-panel-${item.id}`
          const tabId = `${handle.id}-tab-${item.id}`

          return (
            <div
              key={item.id}
              id={panelId}
              className="rf-tabs-panel"
              role="tabpanel"
              aria-labelledby={tabId}
              hidden={item.id !== selected}
            >
              {item.panel}
            </div>
          )
        })}
      </section>
    )
  }
}
