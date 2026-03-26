import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type EmptyResultsProps = {
  title?: ComponentChildren
  description?: ComponentChildren
  clearAction?: ComponentChildren
}

export function EmptyResults(_handle: Handle) {
  return (props: EmptyResultsProps) => (
    <section className="rf-empty-results" role="status" aria-live="polite">
      <h2 className="rf-empty-results-title">{props.title ?? "No matching results"}</h2>
      {props.description ? <p className="rf-empty-results-description">{props.description}</p> : null}
      {props.clearAction ? <div className="rf-empty-results-action">{props.clearAction}</div> : null}
    </section>
  )
}
