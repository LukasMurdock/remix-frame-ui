import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12
export type GridAlign = "start" | "center" | "end" | "stretch"

export type GridProps = {
  children: ComponentChildren
  /** @default 2 */
  columns?: GridColumns
  /** @default "0.75rem" */
  gap?: string
  /** @default "stretch" */
  align?: GridAlign
}

export type GridItemProps = {
  children: ComponentChildren
  /** @default 1 */
  span?: GridColumns
}

export function resolveGridColumns(columns?: GridColumns): GridColumns {
  return columns ?? 2
}

export function resolveGridGap(gap?: string): string {
  return gap ?? "0.75rem"
}

export function resolveGridAlign(align?: GridAlign): GridAlign {
  return align ?? "stretch"
}

export function resolveGridItemSpan(span?: GridColumns): GridColumns {
  return span ?? 1
}

export function Grid(_handle: Handle) {
  return (props: GridProps) => {
    const columns = resolveGridColumns(props.columns)
    const gap = resolveGridGap(props.gap)
    const align = resolveGridAlign(props.align)

    return (
      <div className="rf-grid" data-columns={columns} data-align={align} style={`--rf-grid-gap: ${gap};`}>
        {props.children}
      </div>
    )
  }
}

export function GridItem(_handle: Handle) {
  return (props: GridItemProps) => (
    <div className="rf-grid-item" data-span={resolveGridItemSpan(props.span)}>
      {props.children}
    </div>
  )
}
