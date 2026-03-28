import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TagTone = "neutral" | "brand"

export type TagProps = {
  /** @default "neutral" */
  tone?: TagTone
  children: ComponentChildren
}

export type ChipProps = TagProps

export function resolveTagTone(tone?: TagTone): TagTone {
  return tone ?? "neutral"
}

export function Tag(_handle: Handle) {
  return (props: TagProps) => (
    <span className="rf-tag" data-tone={resolveTagTone(props.tone)}>
      {props.children}
    </span>
  )
}

export function Chip(handle: Handle) {
  const renderTag = Tag(handle)
  return (props: ChipProps) => renderTag(props)
}
