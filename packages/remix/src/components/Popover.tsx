import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import { focusInitial } from "../overlay/primitives"

export type PopoverProps = {
  trigger: ComponentChildren
  content: ComponentChildren
  /** @default false */
  open?: boolean
  /** @default false */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function resolvePopoverOpen(props: PopoverProps, uncontrolledOpen: boolean | undefined): boolean {
  return props.open ?? uncontrolledOpen ?? false
}

export function Popover(handle: Handle) {
  let uncontrolledOpen: boolean | undefined
  let triggerElement: HTMLElement | null = null
  let panelElement: HTMLElement | null = null

  function setOpen(props: PopoverProps, next: boolean, restoreFocus = false): void {
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

  return (props: PopoverProps) => {
    if (uncontrolledOpen === undefined) uncontrolledOpen = props.defaultOpen ?? false

    const open = resolvePopoverOpen(props, uncontrolledOpen)
    const panelId = `${handle.id}-panel`

    return (
      <div
        className="rf-popover"
        mix={[
          ref((node, signal) => {
            if (typeof document === "undefined") return

            const onPointerDown = (event: Event) => {
              const target = event.target
              if (!(target instanceof Node)) return

              if (triggerElement?.contains(target)) return
              if (panelElement?.contains(target)) return
              if (!open) return

              setOpen(props, false)
            }

            document.addEventListener("pointerdown", onPointerDown, { signal })

            const onFocusOut = (event: FocusEvent) => {
              if (!open) return
              const next = event.relatedTarget
              if (next instanceof Node) {
                if (triggerElement?.contains(next)) return
                if (panelElement?.contains(next)) return
              }

              setOpen(props, false)
            }

            node.addEventListener("focusout", onFocusOut, { signal })
          }),
        ]}
      >
        <button
          type="button"
          className="rf-button"
          data-variant="outline"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          mix={[
            ref((node) => {
              triggerElement = node
            }),
            on("click", () => {
              setOpen(props, !open)
            }),
          ]}
        >
          {props.trigger}
        </button>

        {open ? (
          <section
            id={panelId}
            role="dialog"
            aria-label="Popover"
            className="rf-popover-panel"
            mix={[
              ref((node) => {
                panelElement = node
                focusInitial(node)
              }),
              on("keydown", (event) => {
                if (event.key === "Escape") {
                  setOpen(props, false, true)
                }
              }),
            ]}
          >
            {props.content}
          </section>
        ) : null}
      </div>
    )
  }
}
