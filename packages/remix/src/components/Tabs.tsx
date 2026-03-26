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
}

export function Tabs(handle: Handle) {
  let selectedId: string | undefined

  return (props: TabsProps) => {
    const selected = props.value ?? selectedId ?? props.defaultValue ?? props.items[0]?.id
    const activation = props.activation ?? "manual"

    return (
      <section data-activation={activation}>
        <div role="tablist" aria-orientation="horizontal">
          {props.items.map((item) => {
            const active = item.id === selected

            return (
              <button
                key={item.id}
                id={`${item.id}-tab`}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls={`${item.id}-panel`}
                tabIndex={active ? 0 : -1}
                className="rf-button"
                data-variant={active ? "solid" : "ghost"}
                mix={[
                  on("click", () => {
                    if (props.value !== undefined) return
                    selectedId = item.id
                    handle.update()
                  }),
                ]}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {props.items.map((item) => (
          <div
            key={item.id}
            id={`${item.id}-panel`}
            role="tabpanel"
            aria-labelledby={`${item.id}-tab`}
            hidden={item.id !== selected}
          >
            {item.panel}
          </div>
        ))}
      </section>
    )
  }
}
