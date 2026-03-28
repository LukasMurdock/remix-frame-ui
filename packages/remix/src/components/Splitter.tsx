import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type SplitterOrientation = "horizontal" | "vertical"

export type SplitterProps = {
  first: ComponentChildren
  second: ComponentChildren
  /** @default "horizontal" */
  orientation?: SplitterOrientation
  size?: number
  /** @default 50 */
  defaultSize?: number
  /** @default 20 */
  minSize?: number
  /** @default 80 */
  maxSize?: number
  /** @default 5 */
  step?: number
  onSizeChange?: (size: number) => void
  /** @default "Resize panels" */
  ariaLabel?: string
}

export function resolveSplitterOrientation(orientation?: SplitterOrientation): SplitterOrientation {
  return orientation ?? "horizontal"
}

export function clampSplitterSize(size: number, minSize = 20, maxSize = 80): number {
  return Math.min(maxSize, Math.max(minSize, size))
}

export function resolveSplitterStep(step?: number): number {
  return Math.max(1, Math.floor(step ?? 5))
}

export function stepSplitterSize(
  current: number,
  key: string,
  orientation: SplitterOrientation,
  minSize: number,
  maxSize: number,
  step: number,
): number | undefined {
  if (key === "Home") return minSize
  if (key === "End") return maxSize

  if (orientation === "horizontal") {
    if (key === "ArrowLeft") return clampSplitterSize(current - step, minSize, maxSize)
    if (key === "ArrowRight") return clampSplitterSize(current + step, minSize, maxSize)
    return undefined
  }

  if (key === "ArrowUp") return clampSplitterSize(current - step, minSize, maxSize)
  if (key === "ArrowDown") return clampSplitterSize(current + step, minSize, maxSize)
  return undefined
}

export function Splitter(handle: Handle) {
  let localSize: number | undefined

  return (props: SplitterProps) => {
    const orientation = resolveSplitterOrientation(props.orientation)
    const minSize = props.minSize ?? 20
    const maxSize = props.maxSize ?? 80
    const step = resolveSplitterStep(props.step)
    const currentSize = clampSplitterSize(props.size ?? localSize ?? props.defaultSize ?? 50, minSize, maxSize)

    const setSize = (next: number) => {
      const resolved = clampSplitterSize(next, minSize, maxSize)
      if (props.size === undefined) {
        localSize = resolved
        handle.update()
      }
      props.onSizeChange?.(resolved)
    }

    return (
      <section className="rf-splitter" data-orientation={orientation} style={`--rf-splitter-size: ${currentSize}%;`}>
        <div className="rf-splitter-pane" data-pane="first">
          {props.first}
        </div>

        <div
          className="rf-splitter-handle rf-focus-ring"
          role="separator"
          tabIndex={0}
          aria-label={props.ariaLabel ?? "Resize panels"}
          aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
          aria-valuemin={minSize}
          aria-valuemax={maxSize}
          aria-valuenow={Math.round(currentSize)}
          mix={[
            on("keydown", (event) => {
              const next = stepSplitterSize(
                currentSize,
                (event as KeyboardEvent).key,
                orientation,
                minSize,
                maxSize,
                step,
              )

              if (next === undefined) return
              ;(event as KeyboardEvent).preventDefault()
              setSize(next)
            }),
            on("mousedown", (event) => {
              const mouseEvent = event as MouseEvent
              if (mouseEvent.button !== 0) return
              mouseEvent.preventDefault()

              const handleElement = mouseEvent.currentTarget as HTMLElement
              const splitter = handleElement.closest(".rf-splitter")
              if (!(splitter instanceof HTMLElement)) return

              const rect = splitter.getBoundingClientRect()
              const startPosition = orientation === "horizontal" ? mouseEvent.clientX : mouseEvent.clientY
              const startSize = currentSize
              const total = orientation === "horizontal" ? rect.width : rect.height

              if (total <= 0) return

              const onMove = (moveEvent: MouseEvent) => {
                const nextPosition = orientation === "horizontal" ? moveEvent.clientX : moveEvent.clientY
                const deltaPercent = ((nextPosition - startPosition) / total) * 100
                setSize(startSize + deltaPercent)
              }

              const onUp = () => {
                document.removeEventListener("mousemove", onMove)
                document.removeEventListener("mouseup", onUp)
              }

              document.addEventListener("mousemove", onMove)
              document.addEventListener("mouseup", onUp)
            }),
          ]}
        >
          <span className="rf-splitter-handle-dot" aria-hidden="true" />
        </div>

        <div className="rf-splitter-pane" data-pane="second">
          {props.second}
        </div>
      </section>
    )
  }
}
