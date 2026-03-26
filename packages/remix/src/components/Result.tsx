import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type ResultTone = "info" | "success" | "warning" | "danger"

export type ResultProps = {
  tone?: ResultTone
  title: ComponentChildren
  description?: ComponentChildren
  actions?: ComponentChildren
}

export function resolveResultTone(tone?: ResultTone): ResultTone {
  return tone ?? "info"
}

export function resolveResultRole(tone: ResultTone): "status" | "alert" {
  return tone === "warning" || tone === "danger" ? "alert" : "status"
}

export function Result(_handle: Handle) {
  return (props: ResultProps) => {
    const tone = resolveResultTone(props.tone)
    const role = resolveResultRole(tone)

    return (
      <section className="rf-result" data-tone={tone} role={role}>
        <h2 className="rf-result-title">{props.title}</h2>
        {props.description ? <p className="rf-result-description">{props.description}</p> : null}
        {props.actions ? <div className="rf-result-actions">{props.actions}</div> : null}
      </section>
    )
  }
}
