import type { Handle } from "remix/component"

export type SpinnerSize = "sm" | "md" | "lg"

export type SpinnerProps = {
  label?: string
  size?: SpinnerSize
}

export function resolveSpinnerSize(size?: SpinnerSize): SpinnerSize {
  return size ?? "md"
}

export function Spinner(_handle: Handle) {
  return (props: SpinnerProps) => (
    <span className="rf-spinner" data-size={resolveSpinnerSize(props.size)} role="status" aria-live="polite">
      <span className="rf-spinner-dot" aria-hidden="true" />
      <span className="rf-spinner-label">{props.label ?? "Loading"}</span>
    </span>
  )
}
