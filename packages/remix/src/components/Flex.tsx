import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type FlexDirection = "row" | "column"
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline"
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly"
export type FlexWrap = "nowrap" | "wrap"

export type FlexProps = {
  children: ComponentChildren
  /** @default "row" */
  direction?: FlexDirection
  /** @default "stretch" */
  align?: FlexAlign
  /** @default "start" */
  justify?: FlexJustify
  /** @default "nowrap" */
  wrap?: FlexWrap
  /** @default "0.75rem" */
  gap?: string
  /** @default false */
  inline?: boolean
}

export function resolveFlexDirection(direction?: FlexDirection): FlexDirection {
  return direction ?? "row"
}

export function resolveFlexAlign(align?: FlexAlign): FlexAlign {
  return align ?? "stretch"
}

export function resolveFlexJustify(justify?: FlexJustify): FlexJustify {
  return justify ?? "start"
}

export function resolveFlexWrap(wrap?: FlexWrap): FlexWrap {
  return wrap ?? "nowrap"
}

export function resolveFlexGap(gap?: string): string {
  return gap ?? "0.75rem"
}

export function resolveFlexInline(inline?: boolean): boolean {
  return inline ?? false
}

export function Flex(_handle: Handle) {
  return (props: FlexProps) => {
    const direction = resolveFlexDirection(props.direction)
    const align = resolveFlexAlign(props.align)
    const justify = resolveFlexJustify(props.justify)
    const wrap = resolveFlexWrap(props.wrap)
    const inline = resolveFlexInline(props.inline)
    const gap = resolveFlexGap(props.gap)

    return (
      <div
        className="rf-flex"
        data-direction={direction}
        data-align={align}
        data-justify={justify}
        data-wrap={wrap}
        data-inline={inline ? "true" : "false"}
        style={`--rf-flex-gap: ${gap};`}
      >
        {props.children}
      </div>
    )
  }
}
