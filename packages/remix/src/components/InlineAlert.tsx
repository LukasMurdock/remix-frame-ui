import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type InlineAlertTone = "info" | "success" | "warning" | "danger"

export type InlineAlertProps = {
  /** @default "info" */
  tone?: InlineAlertTone
  children: ComponentChildren
  action?: ComponentChildren
}

export function resolveInlineAlertTone(tone?: InlineAlertTone): InlineAlertTone {
  return tone ?? "info"
}

export function resolveInlineAlertRole(tone: InlineAlertTone): "status" | "alert" {
  return tone === "warning" || tone === "danger" ? "alert" : "status"
}

export function InlineAlert(_handle: Handle) {
  return (props: InlineAlertProps) => {
    const tone = resolveInlineAlertTone(props.tone)
    const role = resolveInlineAlertRole(tone)

    return (
      <section className="rf-inline-alert" data-tone={tone} role={role}>
        <div className="rf-inline-alert-body">{props.children}</div>
        {props.action ? <div className="rf-inline-alert-action">{props.action}</div> : null}
      </section>
    )
  }
}
