import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type ButtonVariant = "solid" | "outline" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"

export type ButtonProps = {
  /** @default "button" */
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  /** @default "solid" */
  variant?: ButtonVariant
  /** @default "md" */
  size?: ButtonSize
  name?: string
  value?: string
  children: ComponentChildren
}

export function Button(_handle: Handle) {
  return (props: ButtonProps) => (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      name={props.name}
      value={props.value}
      className="rf-button rf-focus-ring"
      data-variant={props.variant ?? "solid"}
      data-size={props.size ?? "md"}
    >
      {props.children}
    </button>
  )
}
