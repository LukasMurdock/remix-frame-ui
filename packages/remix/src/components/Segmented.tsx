import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type SegmentedSize = "comfortable" | "compact"

export type SegmentedOption = {
  value: string
  label: ComponentChildren
  disabled?: boolean
}

export type SegmentedProps = {
  options: SegmentedOption[]
  /** @default first enabled option value */
  value?: string
  /** @default first enabled option value */
  defaultValue?: string
  onChange?: (value: string) => void
  /** @default "comfortable" */
  size?: SegmentedSize
  /** @default false */
  fullWidth?: boolean
  /** @default "Segmented control" */
  ariaLabel?: string
}

export function resolveSegmentedSize(size?: SegmentedSize): SegmentedSize {
  return size ?? "comfortable"
}

export function resolveSegmentedFullWidth(fullWidth?: boolean): boolean {
  return fullWidth ?? false
}

export function resolveSegmentedValue(options: SegmentedOption[], value?: string): string | undefined {
  if (value) return value
  const firstEnabled = options.find((option) => !option.disabled)
  return firstEnabled?.value
}

export function Segmented(handle: Handle) {
  let localValue: string | undefined

  return (props: SegmentedProps) => {
    if (props.value === undefined && localValue === undefined) {
      localValue = resolveSegmentedValue(props.options, props.defaultValue)
    }

    const value = props.value ?? localValue
    const size = resolveSegmentedSize(props.size)
    const fullWidth = resolveSegmentedFullWidth(props.fullWidth)

    const setValue = (next: string) => {
      if (props.value === undefined) {
        localValue = next
        handle.update()
      }
      props.onChange?.(next)
    }

    return (
      <div
        className="rf-segmented"
        data-size={size}
        data-full-width={fullWidth ? "true" : "false"}
        role="radiogroup"
        aria-label={props.ariaLabel ?? "Segmented control"}
      >
        {props.options.map((option) => {
          const selected = option.value === value

          return (
            <button
              key={option.value}
              type="button"
              className="rf-segmented-option rf-focus-ring"
              role="radio"
              aria-checked={selected ? "true" : "false"}
              data-selected={selected ? "true" : "false"}
              disabled={option.disabled}
              mix={[
                on("click", () => {
                  if (option.disabled) return
                  setValue(option.value)
                }),
              ]}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }
}
