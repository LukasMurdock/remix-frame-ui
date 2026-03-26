import type { Handle } from "remix/component"

export type DividerOrientation = "horizontal" | "vertical"

export type DividerProps = {
  orientation?: DividerOrientation
  decorative?: boolean
  inset?: boolean
  ariaLabel?: string
}

export function resolveDividerOrientation(orientation?: DividerOrientation): DividerOrientation {
  return orientation ?? "horizontal"
}

export function resolveDividerDecorative(decorative?: boolean): boolean {
  return decorative ?? true
}

export function resolveDividerInset(inset?: boolean): boolean {
  return inset ?? false
}

export function Divider(_handle: Handle) {
  return (props: DividerProps) => {
    const orientation = resolveDividerOrientation(props.orientation)
    const decorative = resolveDividerDecorative(props.decorative)
    const inset = resolveDividerInset(props.inset)

    return (
      <div
        className="rf-divider"
        data-orientation={orientation}
        data-inset={inset ? "true" : "false"}
        role={decorative ? undefined : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        aria-label={!decorative ? props.ariaLabel : undefined}
        aria-hidden={decorative ? "true" : undefined}
      />
    )
  }
}
