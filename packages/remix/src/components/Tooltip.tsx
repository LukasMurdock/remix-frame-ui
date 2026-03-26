import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TooltipProps = {
  label: ComponentChildren
  children: ComponentChildren
}

export function Tooltip(handle: Handle) {
  let open = false

  return (props: TooltipProps) => {
    const tooltipId = `${handle.id}-tooltip`

    return (
      <span className="rf-tooltip-wrap">
        <span
          tabIndex={0}
          aria-describedby={open ? tooltipId : undefined}
          mix={[
            on("mouseenter", () => {
              open = true
              handle.update()
            }),
            on("mouseleave", () => {
              open = false
              handle.update()
            }),
            on("focusin", () => {
              open = true
              handle.update()
            }),
            on("focusout", () => {
              open = false
              handle.update()
            }),
          ]}
        >
          {props.children}
        </span>
        {open ? (
          <span id={tooltipId} role="tooltip" className="rf-tooltip">
            {props.label}
          </span>
        ) : null}
      </span>
    )
  }
}
