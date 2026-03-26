import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type StepItem = {
  id: string
  label: ComponentChildren
  description?: ComponentChildren
}

export type StepStatus = "complete" | "current" | "upcoming"

export type StepsProps = {
  items: StepItem[]
  currentId?: string
  ariaLabel?: string
}

export function resolveStepsCurrentIndex(items: StepItem[], currentId?: string): number {
  if (items.length === 0) return -1
  if (!currentId) return 0
  const index = items.findIndex((item) => item.id === currentId)
  return index >= 0 ? index : 0
}

export function resolveStepStatus(index: number, currentIndex: number): StepStatus {
  if (index < currentIndex) return "complete"
  if (index === currentIndex) return "current"
  return "upcoming"
}

export function Steps(_handle: Handle) {
  return (props: StepsProps) => {
    const currentIndex = resolveStepsCurrentIndex(props.items, props.currentId)

    return (
      <nav className="rf-steps" aria-label={props.ariaLabel ?? "Progress"}>
        <ol className="rf-steps-list">
          {props.items.map((item, index) => {
            const status = resolveStepStatus(index, currentIndex)
            const current = status === "current"
            return (
              <li key={item.id} className="rf-steps-item" data-status={status}>
                <span className="rf-steps-marker" aria-hidden="true">{index + 1}</span>
                <span className="rf-steps-content">
                  <span className="rf-steps-label" aria-current={current ? "step" : undefined}>
                    {item.label}
                  </span>
                  {item.description ? <span className="rf-steps-description">{item.description}</span> : null}
                </span>
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
}
