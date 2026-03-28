import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import {
  focusInitial,
  isolateModalTree,
  lockDocumentScroll,
  mountInContainer,
  trapTabNavigation,
} from "../overlay/primitives"

export type ActionSheetAction = {
  id: string
  label: ComponentChildren
  description?: ComponentChildren
  disabled?: boolean
  destructive?: boolean
}

export type ActionSheetCloseReason = "escape" | "backdrop" | "cancel" | "action" | "programmatic"

export type ActionSheetProps = {
  open: boolean
  actions: readonly ActionSheetAction[]
  onClose: (reason: ActionSheetCloseReason) => void
  onAction?: (id: string) => void
  title?: ComponentChildren
  description?: ComponentChildren
  /** @default "Cancel" */
  cancelText?: ComponentChildren
  /** @default true */
  showCancelButton?: boolean
  /** @default true */
  closeOnAction?: boolean
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

export function resolveActionSheetDismissOnBackdrop(value?: boolean): boolean {
  return value ?? true
}

export function resolveActionSheetDismissOnEscape(value?: boolean): boolean {
  return value ?? true
}

export function resolveActionSheetShowCancelButton(value?: boolean): boolean {
  return value ?? true
}

export function resolveActionSheetCloseOnAction(value?: boolean): boolean {
  return value ?? true
}

export function resolveActionSheetCancelText(value?: ComponentChildren): ComponentChildren {
  return value ?? "Cancel"
}

let activeActionSheetId: string | null = null

export function ActionSheet(handle: Handle) {
  let panel: HTMLElement | null = null
  let portalNode: HTMLElement | null = null
  let previousOpen = false
  let previousFocus: HTMLElement | null = null
  let restoreIsolation: (() => void) | null = null
  let restoreScroll: (() => void) | null = null
  let programmaticCloseNotified = false

  function teardown(props: ActionSheetProps): void {
    restoreIsolation?.()
    restoreIsolation = null

    restoreScroll?.()
    restoreScroll = null

    if (props.restoreFocus !== false && previousFocus) {
      previousFocus.focus()
    }

    if (activeActionSheetId === handle.id) activeActionSheetId = null
  }

  handle.signal.addEventListener("abort", () => {
    if (restoreIsolation) restoreIsolation()
    if (restoreScroll) restoreScroll()
    restoreIsolation = null
    restoreScroll = null
    if (activeActionSheetId === handle.id) activeActionSheetId = null
  })

  return (props: ActionSheetProps) => {
    if (props.open && !previousOpen && typeof document !== "undefined") {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    }

    if (!props.open && previousOpen) {
      teardown(props)
    }

    previousOpen = props.open

    if (!props.open) {
      programmaticCloseNotified = false
      return null
    }

    if (activeActionSheetId !== null && activeActionSheetId !== handle.id) {
      if (!programmaticCloseNotified) {
        programmaticCloseNotified = true
        handle.queueTask(() => {
          props.onClose("programmatic")
        })
      }
      return null
    }

    programmaticCloseNotified = false

    const titleId = `${handle.id}-title`
    const descriptionId = `${handle.id}-description`
    const ariaLabelledBy = props.ariaLabelledBy ?? (props.title ? titleId : undefined)
    const ariaLabel = props.ariaLabel ?? (ariaLabelledBy ? undefined : "Action sheet")
    const ariaDescribedBy = props.description ? descriptionId : undefined
    const shouldDismissOnBackdrop = resolveActionSheetDismissOnBackdrop(props.dismissOnBackdrop)
    const shouldDismissOnEscape = resolveActionSheetDismissOnEscape(props.dismissOnEscape)
    const showCancelButton = resolveActionSheetShowCancelButton(props.showCancelButton)
    const closeOnAction = resolveActionSheetCloseOnAction(props.closeOnAction)

    const selectAction = (action: ActionSheetAction) => {
      if (action.disabled) return
      props.onAction?.(action.id)
      if (closeOnAction) props.onClose("action")
    }

    return (
      <div
        className="rf-action-sheet-portal"
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
          className="rf-action-sheet-backdrop"
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
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            className="rf-action-sheet"
            mix={[
              ref((node) => {
                panel = node

                if (!panel || typeof document === "undefined") return
                if (activeActionSheetId === handle.id) return

                activeActionSheetId = handle.id
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
            <section className="rf-action-sheet-panel">
              {props.title || props.description ? (
                <header className="rf-action-sheet-header">
                  {props.title ? (
                    <h2 id={titleId} className="rf-action-sheet-title">
                      {props.title}
                    </h2>
                  ) : null}
                  {props.description ? (
                    <p id={descriptionId} className="rf-action-sheet-description">
                      {props.description}
                    </p>
                  ) : null}
                </header>
              ) : null}

              <div className="rf-action-sheet-actions">
                {props.actions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    className="rf-action-sheet-action rf-focus-ring"
                    data-destructive={action.destructive ? "true" : "false"}
                    disabled={action.disabled}
                    mix={[on("click", () => selectAction(action))]}
                  >
                    <span className="rf-action-sheet-action-label">{action.label}</span>
                    {action.description ? (
                      <span className="rf-action-sheet-action-description">{action.description}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>

            {showCancelButton ? (
              <button
                type="button"
                className="rf-action-sheet-cancel rf-focus-ring"
                mix={[on("click", () => props.onClose("cancel"))]}
              >
                {resolveActionSheetCancelText(props.cancelText)}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
