import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type ProgressTone = "neutral" | "success" | "warning" | "danger"

export type ProgressProps = {
  value?: number
  max?: number
  tone?: ProgressTone
  label?: ComponentChildren
  showValue?: boolean
}

export function normalizeProgressMax(max?: number): number {
  if (max === undefined) return 100
  return max > 0 ? max : 100
}

export function clampProgressValue(value: number | undefined, max: number): number {
  if (value === undefined) return 0
  if (value < 0) return 0
  if (value > max) return max
  return value
}

export function resolveProgressTone(tone?: ProgressTone): ProgressTone {
  return tone ?? "neutral"
}

export function Progress(_handle: Handle) {
  return (props: ProgressProps) => {
    const max = normalizeProgressMax(props.max)
    const value = clampProgressValue(props.value, max)
    const percent = Math.round((value / max) * 100)

    return (
      <div className="rf-progress-wrap">
        {props.label ? <div className="rf-progress-label">{props.label}</div> : null}
        <div
          className="rf-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          data-tone={resolveProgressTone(props.tone)}
        >
          <div className="rf-progress-bar" style={`width: ${percent}%`} />
        </div>
        {props.showValue ? <div className="rf-progress-value">{`${percent}%`}</div> : null}
      </div>
    )
  }
}
