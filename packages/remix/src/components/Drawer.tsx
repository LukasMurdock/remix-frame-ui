import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import {
  focusInitial,
  isolateModalTree,
  lockDocumentScroll,
  mountInContainer,
  trapTabNavigation,
} from "../overlay/primitives"

export type DrawerPosition = "left" | "right"

export type DrawerCloseReason = "escape" | "backdrop" | "close-button" | "programmatic"

export type DrawerProps = {
  open: boolean
  onClose: (reason: DrawerCloseReason) => void
  title?: ComponentChildren
  children: ComponentChildren
  position?: DrawerPosition
  closeLabel?: string
  showCloseButton?: boolean
  dismissOnBackdrop?: boolean
  dismissOnEscape?: boolean
  restoreFocus?: boolean
  container?: HTMLElement
  ariaLabel?: string
  ariaLabelledBy?: string
}

export function resolveDrawerPosition(position?: DrawerPosition): DrawerPosition {
  return position ?? "right"
}

export function resolveDrawerDismissOnBackdrop(value?: boolean): boolean {
  return value ?? true
}

let activeDrawerId: string | null = null

export function Drawer(handle: Handle) {
  let panel: HTMLElement | null = null
  let portalNode: HTMLElement | null = null
  let previousOpen = false
  let previousFocus: HTMLElement | null = null
  let restoreIsolation: (() => void) | null = null
  let restoreScroll: (() => void) | null = null

  function teardown(props: DrawerProps): void {
    restoreIsolation?.()
    restoreIsolation = null

    restoreScroll?.()
    restoreScroll = null

    if (props.restoreFocus !== false && previousFocus) {
      previousFocus.focus()
    }

    if (activeDrawerId === handle.id) activeDrawerId = null
  }

  handle.signal.addEventListener("abort", () => {
    if (restoreIsolation) restoreIsolation()
    if (restoreScroll) restoreScroll()
    restoreIsolation = null
    restoreScroll = null
    if (activeDrawerId === handle.id) activeDrawerId = null
  })

  return (props: DrawerProps) => {
    if (props.open && !previousOpen && typeof document !== "undefined") {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    }

    if (!props.open && previousOpen) {
      teardown(props)
    }

    previousOpen = props.open

    if (!props.open) return null

    if (activeDrawerId !== null && activeDrawerId !== handle.id) {
      props.onClose("programmatic")
      return null
    }

    const titleId = `${handle.id}-title`
    const ariaLabelledBy = props.ariaLabelledBy ?? (props.title ? titleId : undefined)
    const shouldDismissOnBackdrop = resolveDrawerDismissOnBackdrop(props.dismissOnBackdrop)
    const shouldDismissOnEscape = props.dismissOnEscape ?? true
    const showCloseButton = props.showCloseButton ?? true

    return (
      <div
        className="rf-drawer-portal"
        mix={[
          ref((node, signal) => {
            if (typeof document === "undefined") return

            const target = props.container ?? document.body
            portalNode = node

            const restoreMount = mountInContainer(node, target)

            signal.addEventListener("abort", () => {
              restoreMount()
            })
          }),
        ]}
      >
        <div
          role="presentation"
          className="rf-drawer-backdrop"
          data-dismissible={shouldDismissOnBackdrop}
          mix={[
            on("click", (event) => {
              if (!shouldDismissOnBackdrop) return
              if (event.target !== event.currentTarget) return
              props.onClose("backdrop")
            }),
          ]}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={props.ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className="rf-drawer-panel"
            data-position={resolveDrawerPosition(props.position)}
            mix={[
              ref((node) => {
                panel = node

                if (!panel || typeof document === "undefined") return
                if (activeDrawerId === handle.id) return

                activeDrawerId = handle.id
                restoreScroll = lockDocumentScroll(document)
                if (portalNode) {
                  restoreIsolation = isolateModalTree(document, portalNode)
                }

                focusInitial(panel)
              }),
              on("keydown", (event) => {
                if (!panel) return

                if (event.key === "Tab") {
                  trapTabNavigation(event, panel)
                } else if (event.key === "Escape") {
                  if (!shouldDismissOnEscape) return
                  props.onClose("escape")
                }
              }),
            ]}
          >
            {props.title ? (
              <header className="rf-drawer-header">
                <h2 id={titleId}>{props.title}</h2>
              </header>
            ) : null}

            <div className="rf-drawer-body">{props.children}</div>

            {showCloseButton ? (
              <footer className="rf-drawer-footer">
                <button
                  type="button"
                  className="rf-button"
                  data-variant="outline"
                  mix={[on("click", () => props.onClose("close-button"))]}
                >
                  {props.closeLabel ?? "Close"}
                </button>
              </footer>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
