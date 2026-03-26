import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TimelineTone = "neutral" | "success" | "warning" | "danger"

export type TimelineItem = {
  key: string
  title: ComponentChildren
  description?: ComponentChildren
  time?: ComponentChildren
  tone?: TimelineTone
}

export type TimelineProps = {
  items: TimelineItem[]
  pending?: ComponentChildren
  emptyState?: ComponentChildren
}

export function resolveTimelineTone(tone?: TimelineTone): TimelineTone {
  return tone ?? "neutral"
}

export function resolveTimelinePending(pending?: ComponentChildren): ComponentChildren {
  return pending ?? "Pending"
}

export function Timeline(_handle: Handle) {
  return (props: TimelineProps) => {
    if (props.items.length === 0) {
      return <section className="rf-timeline-empty">{props.emptyState ?? "No events"}</section>
    }

    return (
      <section className="rf-timeline-wrap">
        <ol className="rf-timeline" role="list">
          {props.items.map((item) => (
            <li key={item.key} className="rf-timeline-item" data-tone={resolveTimelineTone(item.tone)}>
              <span className="rf-timeline-marker" aria-hidden="true" />
              <div className="rf-timeline-content">
                <p className="rf-timeline-title">{item.title}</p>
                {item.description ? <p className="rf-timeline-description">{item.description}</p> : null}
                {item.time ? <p className="rf-timeline-time">{item.time}</p> : null}
              </div>
            </li>
          ))}

          {props.pending ? (
            <li className="rf-timeline-item" data-pending="true" data-tone="neutral">
              <span className="rf-timeline-marker" aria-hidden="true" />
              <div className="rf-timeline-content">
                <p className="rf-timeline-title">{resolveTimelinePending(props.pending)}</p>
              </div>
            </li>
          ) : null}
        </ol>
      </section>
    )
  }
}
