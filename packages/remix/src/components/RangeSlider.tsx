import { on, type Handle } from "remix/component"
import { normalizeSliderStep } from "./Slider"

export type RangeSliderValue = [number, number]

export type RangeSliderProps = {
  id?: string
  value?: RangeSliderValue
  defaultValue?: RangeSliderValue
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  required?: boolean
  nameStart?: string
  nameEnd?: string
  startLabel?: string
  endLabel?: string
  onValueChange?: (value: RangeSliderValue) => void
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

export function normalizeRangeSliderBounds(min?: number, max?: number): { min: number; max: number } {
  const resolvedMin = min ?? 0
  const resolvedMax = max ?? 100
  if (resolvedMin <= resolvedMax) return { min: resolvedMin, max: resolvedMax }
  return { min: resolvedMax, max: resolvedMin }
}

export function normalizeRangeSliderValue(
  value: RangeSliderValue | undefined,
  min: number,
  max: number,
): RangeSliderValue {
  const rawStart = value?.[0] ?? min
  const rawEnd = value?.[1] ?? max
  const start = Math.min(max, Math.max(min, rawStart))
  const end = Math.min(max, Math.max(min, rawEnd))
  if (start <= end) return [start, end]
  return [end, start]
}

export function RangeSlider(handle: Handle) {
  let localValue: RangeSliderValue | undefined

  return (props: RangeSliderProps) => {
    const bounds = normalizeRangeSliderBounds(props.min, props.max)
    const step = normalizeSliderStep(props.step)

    if (!localValue) {
      localValue = normalizeRangeSliderValue(props.defaultValue, bounds.min, bounds.max)
    }

    const resolved = normalizeRangeSliderValue(props.value ?? localValue, bounds.min, bounds.max)
    const [start, end] = resolved
    const rangeSize = Math.max(bounds.max - bounds.min, 1)
    const startPercent = ((start - bounds.min) / rangeSize) * 100
    const endPercent = ((end - bounds.min) / rangeSize) * 100

    const updateValue = (next: RangeSliderValue) => {
      const normalized = normalizeRangeSliderValue(next, bounds.min, bounds.max)
      if (props.value === undefined) localValue = normalized
      props.onValueChange?.(normalized)
      handle.update()
    }

    return (
      <div
        id={props.id}
        className="rf-range-slider"
        style={`--rf-range-start: ${startPercent}%; --rf-range-end: ${endPercent}%;`}
      >
        <div className="rf-range-slider-track" aria-hidden="true" />
        <input
          type="range"
          className="rf-range-slider-input rf-focus-ring"
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={start}
          disabled={props.disabled}
          required={props.required}
          name={props.nameStart}
          aria-label={props.startLabel ?? "Minimum value"}
          aria-describedby={props["aria-describedby"]}
          aria-invalid={props["aria-invalid"]}
          mix={[
            on("input", (event) => {
              const target = event.currentTarget as HTMLInputElement
              const next = Math.min(Number(target.value), end)
              updateValue([next, end])
            }),
          ]}
        />
        <input
          type="range"
          className="rf-range-slider-input rf-focus-ring"
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={end}
          disabled={props.disabled}
          required={props.required}
          name={props.nameEnd}
          aria-label={props.endLabel ?? "Maximum value"}
          aria-describedby={props["aria-describedby"]}
          aria-invalid={props["aria-invalid"]}
          mix={[
            on("input", (event) => {
              const target = event.currentTarget as HTMLInputElement
              const next = Math.max(Number(target.value), start)
              updateValue([start, next])
            }),
          ]}
        />
      </div>
    )
  }
}
