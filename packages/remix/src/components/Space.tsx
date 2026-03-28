import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type SpaceDirection = "horizontal" | "vertical"
export type SpaceSize = "xs" | "sm" | "md" | "lg"
export type SpaceAlign = "start" | "center" | "end" | "baseline" | "stretch"

export type SpaceProps = {
  children: ComponentChildren
  /** @default "horizontal" */
  direction?: SpaceDirection
  /** @default "md" */
  size?: SpaceSize
  /** @default "center" */
  align?: SpaceAlign
  /** @default false */
  wrap?: boolean
}

export function resolveSpaceDirection(direction?: SpaceDirection): SpaceDirection {
  return direction ?? "horizontal"
}

export function resolveSpaceSize(size?: SpaceSize): SpaceSize {
  return size ?? "md"
}

export function resolveSpaceAlign(align?: SpaceAlign): SpaceAlign {
  return align ?? "center"
}

export function resolveSpaceWrap(wrap?: boolean): boolean {
  return wrap ?? false
}

export function Space(_handle: Handle) {
  return (props: SpaceProps) => {
    const direction = resolveSpaceDirection(props.direction)
    const size = resolveSpaceSize(props.size)
    const align = resolveSpaceAlign(props.align)
    const wrap = resolveSpaceWrap(props.wrap)

    return (
      <div
        className="rf-space"
        data-direction={direction}
        data-size={size}
        data-align={align}
        data-wrap={wrap ? "true" : "false"}
      >
        {props.children}
      </div>
    )
  }
}
