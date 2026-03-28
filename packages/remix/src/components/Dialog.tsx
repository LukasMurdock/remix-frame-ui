import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import {
  focusInitial,
  isolateModalTree,
  lockDocumentScroll,
  mountInContainer,
  trapTabNavigation,
} from "../overlay/primitives"

export type DialogCloseReason = "escape" | "backdrop" | "close-button" | "programmatic"

export type DialogProps = {
  open: boolean
  children: ComponentChildren
  onClose: (reason: DialogCloseReason) => void
  title?: ComponentChildren
  /** @default "Close" */
  closeLabel?: string
  /** @default true */
  showCloseButton?: boolean
  /** @default true */
  dismissOnBackdrop?: boolean
  /** @default true */
  dismissOnEscape?: boolean
  /** @default true */
  restoreFocus?: boolean
  container?: HTMLElement
  ariaLabel?: string
  /** @default generated from title when present */
  ariaLabelledBy?: string
}

let activeDialogId: string | null = null

export function Dialog(handle: Handle) {
  let panel: HTMLElement | null = null
  let portalNode: HTMLElement | null = null
  let previousOpen = false
  let previousFocus: HTMLElement | null = null
  let restoreIsolation: (() => void) | null = null
  let restoreScroll: (() => void) | null = null

  function teardown(props: DialogProps): void {
    restoreIsolation?.()
    restoreIsolation = null

    restoreScroll?.()
    restoreScroll = null

    if (props.restoreFocus !== false && previousFocus) {
      previousFocus.focus()
    }

    if (activeDialogId === handle.id) activeDialogId = null
  }

  handle.signal.addEventListener("abort", () => {
    if (restoreIsolation) restoreIsolation()
    if (restoreScroll) restoreScroll()
    restoreIsolation = null
    restoreScroll = null
    if (activeDialogId === handle.id) activeDialogId = null
  })

  return (props: DialogProps) => {
    if (props.open && !previousOpen && typeof document !== "undefined") {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    }

    if (!props.open && previousOpen) {
      teardown(props)
    }

    previousOpen = props.open

    if (!props.open) return null

    if (activeDialogId !== null && activeDialogId !== handle.id) {
      props.onClose("programmatic")
      return null
    }

    const titleId = `${handle.id}-title`
    const ariaLabelledBy = props.ariaLabelledBy ?? (props.title ? titleId : undefined)
    const shouldDismissOnBackdrop = props.dismissOnBackdrop ?? true
    const shouldDismissOnEscape = props.dismissOnEscape ?? true
    const showCloseButton = props.showCloseButton ?? true

    return (
      <div
        className="rf-dialog-portal"
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
          className="rf-dialog-backdrop"
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
            className="rf-dialog-panel"
            mix={[
              ref((node) => {
                panel = node

                if (!panel || typeof document === "undefined") return
                if (activeDialogId === handle.id) return

                activeDialogId = handle.id
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
              <header>
                <h2 id={titleId}>{props.title}</h2>
              </header>
            ) : null}

            <div>{props.children}</div>

            {showCloseButton ? (
              <footer>
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
