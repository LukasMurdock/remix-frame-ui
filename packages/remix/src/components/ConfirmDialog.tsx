import { on, type Handle } from "remix/component"
import { Dialog, type DialogCloseReason } from "./Dialog"
import type { ComponentChildren } from "../types"

export type ConfirmDialogCloseReason = DialogCloseReason | "cancel" | "confirm"

export type ConfirmDialogProps = {
  open: boolean
  title: ComponentChildren
  description?: ComponentChildren
  children?: ComponentChildren
  onClose: (reason: ConfirmDialogCloseReason) => void
  onConfirm?: () => void
  onCancel?: () => void
  /** @default "Confirm" */
  confirmLabel?: ComponentChildren
  /** @default "Cancel" */
  cancelLabel?: ComponentChildren
  /** @default false */
  confirmDisabled?: boolean
  /** @default false */
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

export type ConfirmDialogDefaults = {
  dismissOnBackdrop: boolean
  confirmLabel: ComponentChildren
  cancelLabel: ComponentChildren
}

export function resolveConfirmDialogDefaults(props: ConfirmDialogProps): ConfirmDialogDefaults {
  return {
    dismissOnBackdrop: props.dismissOnBackdrop ?? false,
    confirmLabel: props.confirmLabel ?? "Confirm",
    cancelLabel: props.cancelLabel ?? "Cancel",
  }
}

export function ConfirmDialog(_handle: Handle) {
  return (props: ConfirmDialogProps) => {
    const defaults = resolveConfirmDialogDefaults(props)
    const dialogProps = {
      open: props.open,
      title: props.title,
      onClose: props.onClose,
      showCloseButton: false,
      dismissOnBackdrop: defaults.dismissOnBackdrop,
      dismissOnEscape: props.dismissOnEscape ?? true,
      restoreFocus: props.restoreFocus ?? true,
      ...(props.container ? { container: props.container } : {}),
      ...(props.ariaLabel ? { ariaLabel: props.ariaLabel } : {}),
      ...(props.ariaLabelledBy ? { ariaLabelledBy: props.ariaLabelledBy } : {}),
    }

    return (
      <Dialog {...dialogProps}>
        {props.description ? <p className="rf-confirm-dialog-description">{props.description}</p> : null}
        {props.children ? <div className="rf-confirm-dialog-body">{props.children}</div> : null}
        <div className="rf-confirm-dialog-actions">
          <button
            type="button"
            className="rf-button rf-focus-ring"
            data-variant="outline"
            mix={[
              on("click", () => {
                props.onCancel?.()
                props.onClose("cancel")
              }),
            ]}
          >
            {defaults.cancelLabel}
          </button>
          <button
            type="button"
            className="rf-button rf-focus-ring"
            data-variant="solid"
            data-tone="danger"
            disabled={props.confirmDisabled}
            mix={[
              on("click", () => {
                props.onConfirm?.()
                props.onClose("confirm")
              }),
            ]}
          >
            {defaults.confirmLabel}
          </button>
        </div>
      </Dialog>
    )
  }
}
