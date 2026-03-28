import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type PullToRefreshStatus = "idle" | "pulling" | "can-release" | "refreshing" | "complete"

export type PullToRefreshProps = {
  children: ComponentChildren
  onRefresh?: () => void | Promise<void>
  refreshing?: boolean
  disabled?: boolean
  /** @default 72 */
  threshold?: number
  /** @default 420 */
  completeDelay?: number
  /** @default "Pull to refresh" */
  pullingText?: ComponentChildren
  /** @default "Release to refresh" */
  canReleaseText?: ComponentChildren
  /** @default "Refreshing..." */
  refreshingText?: ComponentChildren
  /** @default "Refresh complete" */
  completeText?: ComponentChildren
  /** @default "Pull to refresh" */
  ariaLabel?: string
}

const interactiveDragSelector = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "[role='button']",
  "[contenteditable='true']",
].join(",")

export function resolvePullToRefreshThreshold(value?: number): number {
  const threshold = Number.isFinite(value) ? Math.round(value as number) : 72
  return Math.max(24, threshold)
}

export function resolvePullToRefreshCompleteDelay(value?: number): number {
  const delay = Number.isFinite(value) ? Math.round(value as number) : 420
  return Math.max(0, delay)
}

export function clampPullToRefreshOffset(offset: number, threshold: number): number {
  const max = Math.round(threshold * 1.6)
  return Math.max(0, Math.min(max, Math.round(offset)))
}

export function resolvePullToRefreshStatus(
  offset: number,
  threshold: number,
  refreshing: boolean,
  complete: boolean,
): PullToRefreshStatus {
  if (refreshing) return "refreshing"
  if (complete) return "complete"
  if (offset <= 0) return "idle"
  if (offset >= threshold) return "can-release"
  return "pulling"
}

export function shouldStartPullToRefreshDrag(scrollTop: number, disabled: boolean, refreshing: boolean): boolean {
  return !disabled && !refreshing && scrollTop <= 0
}

function resolvePullToRefreshLabel(status: PullToRefreshStatus, props: PullToRefreshProps): ComponentChildren {
  if (status === "can-release") return props.canReleaseText ?? "Release to refresh"
  if (status === "refreshing") return props.refreshingText ?? "Refreshing..."
  if (status === "complete") return props.completeText ?? "Refresh complete"
  return props.pullingText ?? "Pull to refresh"
}

export function PullToRefresh(handle: Handle) {
  let localRefreshing = false
  let previousResolvedRefreshing = false
  let dragging = false
  let dragOffset = 0
  let showComplete = false
  let refreshVersion = 0
  let disposed = false
  let activePointerId: number | null = null
  let scrollElement: HTMLElement | null = null
  let completeTimer: ReturnType<typeof setTimeout> | null = null
  let releaseDragListeners: (() => void) | null = null

  const clearCompleteTimer = () => {
    if (!completeTimer) return
    clearTimeout(completeTimer)
    completeTimer = null
  }

  const setDragging = (next: boolean) => {
    if (dragging === next) return
    dragging = next
    handle.update()
  }

  const clearDragListeners = () => {
    if (releaseDragListeners) releaseDragListeners()
    releaseDragListeners = null
    activePointerId = null
    setDragging(false)
  }

  handle.signal.addEventListener("abort", () => {
    disposed = true
    refreshVersion += 1
    clearCompleteTimer()
    clearDragListeners()
    scrollElement = null
  })

  return (props: PullToRefreshProps) => {
    const threshold = resolvePullToRefreshThreshold(props.threshold)
    const completeDelay = resolvePullToRefreshCompleteDelay(props.completeDelay)
    const disabled = props.disabled ?? false
    const refreshing = props.refreshing ?? localRefreshing

    if (refreshing) {
      clearCompleteTimer()
      showComplete = false
    } else if (previousResolvedRefreshing && !refreshing && !showComplete) {
      showComplete = true
      dragOffset = 0
      if (completeDelay === 0) {
        showComplete = false
      } else {
        clearCompleteTimer()
        const completeVersion = refreshVersion
        completeTimer = setTimeout(() => {
          if (disposed || refreshVersion !== completeVersion) return
          showComplete = false
          handle.update()
        }, completeDelay)
      }
    }

    previousResolvedRefreshing = refreshing

    const status = resolvePullToRefreshStatus(dragOffset, threshold, refreshing, showComplete)
    const visualOffset =
      status === "refreshing"
        ? threshold
        : status === "complete"
          ? Math.round(threshold * 0.55)
          : clampPullToRefreshOffset(dragOffset, threshold)
    const label = resolvePullToRefreshLabel(status, props)

    const setDragOffset = (next: number) => {
      const resolved = clampPullToRefreshOffset(next, threshold)
      if (dragOffset === resolved) return
      dragOffset = resolved
      handle.update()
    }

    const triggerRefresh = () => {
      if (disposed) return
      if (refreshing || disabled) return

      const currentRefreshVersion = ++refreshVersion
      dragOffset = 0
      showComplete = false
      clearCompleteTimer()

      if (props.refreshing === undefined) {
        localRefreshing = true
      }

      handle.update()

      const finish = () => {
        if (disposed) return
        if (refreshVersion !== currentRefreshVersion) return
        if (props.refreshing === undefined) {
          localRefreshing = false
          handle.update()
        }
      }

      Promise.resolve()
        .then(() => props.onRefresh?.())
        .then(finish, finish)
    }

    const beginDrag = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return
      if (!scrollElement) return
      if (!shouldStartPullToRefreshDrag(scrollElement.scrollTop, disabled, refreshing)) return
      if (activePointerId !== null && event.pointerId !== activePointerId) return

      const target = event.target
      if (target instanceof Element && target.closest(interactiveDragSelector)) return

      event.preventDefault()
      clearDragListeners()

      activePointerId = event.pointerId
      const dragSource = event.currentTarget
      if (dragSource instanceof Element && typeof dragSource.setPointerCapture === "function") {
        try {
          dragSource.setPointerCapture(event.pointerId)
        } catch {}
      }

      const startY = event.clientY
      setDragging(true)

      const onMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== activePointerId) return
        const delta = moveEvent.clientY - startY
        const dampened = delta * 0.6
        setDragOffset(dampened)
        if (moveEvent.cancelable) moveEvent.preventDefault()
      }

      const onStop = (stopEvent: PointerEvent) => {
        if (stopEvent.pointerId !== activePointerId) return
        const shouldRefresh = dragOffset >= threshold
        clearDragListeners()
        if (shouldRefresh) {
          triggerRefresh()
          return
        }

        if (dragOffset !== 0) {
          dragOffset = 0
          handle.update()
        }
      }

      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onStop)
      window.addEventListener("pointercancel", onStop)

      releaseDragListeners = () => {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onStop)
        window.removeEventListener("pointercancel", onStop)
      }
    }

    return (
      <section
        className="rf-pull-to-refresh"
        data-status={status}
        data-dragging={dragging ? "true" : "false"}
        aria-label={props.ariaLabel ?? "Pull to refresh"}
        style={`--rf-pull-to-refresh-offset: ${visualOffset}px; --rf-pull-to-refresh-threshold: ${threshold}px;`}
      >
        <div className="rf-pull-to-refresh-indicator" aria-live="polite" aria-atomic="true">
          <span className="rf-pull-to-refresh-label">{label}</span>
        </div>
        <div
          className="rf-pull-to-refresh-scroll"
          mix={[
            ref((node) => {
              scrollElement = node
            }),
            on("pointerdown", (event) => {
              beginDrag(event as PointerEvent)
            }),
          ]}
        >
          {props.children}
        </div>
      </section>
    )
  }
}
