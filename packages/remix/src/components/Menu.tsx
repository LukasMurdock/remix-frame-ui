import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import { focusInitial, focusMenuBoundary, focusMenuStep } from "../overlay/primitives"

export type MenuItem = {
  id: string
  label: ComponentChildren
  disabled?: boolean
}

export type MenuProps = {
  triggerLabel: ComponentChildren
  items: MenuItem[]
  /** @default false */
  open?: boolean
  /** @default false */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSelect?: (id: string) => void
}

export function resolveMenuOpen(props: MenuProps, uncontrolledOpen: boolean | undefined): boolean {
  return props.open ?? uncontrolledOpen ?? props.defaultOpen ?? false
}

export function Menu(handle: Handle) {
  let uncontrolledOpen: boolean | undefined
  let triggerElement: HTMLElement | null = null
  let menuElement: HTMLElement | null = null

  function setOpen(props: MenuProps, next: boolean, restoreFocus = false): void {
    if (props.open === undefined) {
      uncontrolledOpen = next
      handle.update()
    }

    if (!next && restoreFocus) {
      handle.queueTask(() => {
        triggerElement?.focus()
      })
    }

    props.onOpenChange?.(next)
  }

  return (props: MenuProps) => {
    if (uncontrolledOpen === undefined) {
      uncontrolledOpen = props.defaultOpen ?? false
    }

    const open = resolveMenuOpen(props, uncontrolledOpen)

    const menuId = `${handle.id}-menu`

    return (
      <div className="rf-menu" data-open={open ? "true" : "false"}>
        <button
          type="button"
          className="rf-button rf-menu-trigger"
          data-variant="outline"
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          aria-expanded={open}
          mix={[
            ref((node) => {
              triggerElement = node
            }),
            on("click", () => {
              setOpen(props, !open)
            }),
            on("keydown", (event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault()
                if (!open) {
                  setOpen(props, true)
                  handle.queueTask(() => {
                    if (!menuElement) return
                    focusMenuBoundary(menuElement, "first")
                  })
                  return
                }

                if (!menuElement) return
                focusMenuStep(menuElement, 1)
              } else if (event.key === "ArrowUp") {
                event.preventDefault()
                if (!open) {
                  setOpen(props, true)
                  handle.queueTask(() => {
                    if (!menuElement) return
                    focusMenuBoundary(menuElement, "last")
                  })
                  return
                }

                if (!menuElement) return
                focusMenuStep(menuElement, -1)
              }
            }),
          ]}
        >
          {props.triggerLabel}
        </button>

        {open ? (
          <ul
            id={menuId}
            role="menu"
            aria-orientation="vertical"
            className="rf-menu-list"
            mix={[
              ref((node, signal) => {
                menuElement = node
                focusInitial(node)

                if (typeof document === "undefined") return

                const onPointerDown = (event: Event) => {
                  const target = event.target
                  if (!(target instanceof Node)) return
                  if (node.contains(target)) return
                  if (triggerElement?.contains(target)) return
                  setOpen(props, false)
                }

                document.addEventListener("pointerdown", onPointerDown, { signal })
              }),
              on("keydown", (event) => {
                if (event.key === "Tab") {
                  setOpen(props, false)
                } else if (event.key === "Escape") {
                  setOpen(props, false, true)
                } else if (event.key === "ArrowDown") {
                  event.preventDefault()
                  if (!menuElement) return
                  focusMenuStep(menuElement, 1)
                } else if (event.key === "ArrowUp") {
                  event.preventDefault()
                  if (!menuElement) return
                  focusMenuStep(menuElement, -1)
                } else if (event.key === "Home") {
                  event.preventDefault()
                  if (!menuElement) return
                  focusMenuBoundary(menuElement, "first")
                } else if (event.key === "End") {
                  event.preventDefault()
                  if (!menuElement) return
                  focusMenuBoundary(menuElement, "last")
                }
              }),
            ]}
          >
            {props.items.map((item) => (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  className="rf-button rf-menu-item"
                  data-variant="ghost"
                  mix={[
                    on("click", () => {
                      if (item.disabled) return
                      props.onSelect?.(item.id)
                      setOpen(props, false, true)
                    }),
                  ]}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }
}
