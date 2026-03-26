import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type AlertTone = "info" | "success" | "warning" | "danger"

export type AlertProps = {
  tone?: AlertTone
  title?: ComponentChildren
  children: ComponentChildren
  dismissible?: boolean
  onDismiss?: () => void
}

export function Alert(_handle: Handle) {
  return (props: AlertProps) => {
    const tone = props.tone ?? "info"
    const role = tone === "danger" || tone === "warning" ? "alert" : "status"

    return (
      <section className="rf-alert" data-tone={tone} role={role}>
        <div className="rf-alert-body">
          {props.title ? <h3 className="rf-alert-title">{props.title}</h3> : null}
          <div>{props.children}</div>
        </div>
        {props.dismissible ? (
          <button
            type="button"
            className="rf-alert-dismiss rf-focus-ring"
            aria-label="Dismiss alert"
            mix={[on("click", () => props.onDismiss?.())]}
          >
            ×
          </button>
        ) : null}
      </section>
    )
  }
}
