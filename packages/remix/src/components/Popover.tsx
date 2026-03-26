import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import { focusInitial } from "../overlay/primitives"

export type PopoverProps = {
  trigger: ComponentChildren
  content: ComponentChildren
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
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

    const open = props.open ?? uncontrolledOpen ?? false
    const panelId = `${handle.id}-panel`

    return (
      <div
        className="rf-popover"
        mix={[
          ref((_node, signal) => {
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
          }),
        ]}
      >
        <button
          type="button"
          className="rf-button"
          data-variant="outline"
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
                } else if (event.key === "Tab") {
                  setOpen(props, false)
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
