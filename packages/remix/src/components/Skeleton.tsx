import type { Handle } from "remix/component"

export type SkeletonProps = {
  lines?: number
  animated?: boolean
}

export function normalizeSkeletonLines(lines?: number): number {
  if (lines === undefined) return 3
  if (lines < 1) return 1
  return Math.floor(lines)
}

export function Skeleton(_handle: Handle) {
  return (props: SkeletonProps) => {
    const lines = normalizeSkeletonLines(props.lines)
    const animated = props.animated ?? true

    return (
      <div className="rf-skeleton" aria-hidden="true" data-animated={animated ? "true" : "false"}>
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={`line-${index}`}
            className="rf-skeleton-line"
            style={index === lines - 1 ? "width: 74%" : undefined}
          />
        ))}
      </div>
    )
  }
}
