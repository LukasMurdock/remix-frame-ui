import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info"

export type BadgeProps = {
  tone?: BadgeTone
  children: ComponentChildren
}

export function resolveBadgeTone(tone?: BadgeTone): BadgeTone {
  return tone ?? "neutral"
}

export function Badge(_handle: Handle) {
  return (props: BadgeProps) => (
    <span className="rf-badge" data-tone={resolveBadgeTone(props.tone)}>
      {props.children}
    </span>
  )
}
