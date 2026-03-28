import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type SwipeActionSide = "start" | "end"
export type SwipeActionOpenSide = SwipeActionSide | "none"

export type SwipeActionItem = {
  id: string
  label: ComponentChildren
  disabled?: boolean
  destructive?: boolean
}

export type SwipeActionProps = {
  children: ComponentChildren
  startActions?: readonly SwipeActionItem[]
  endActions?: readonly SwipeActionItem[]
  openSide?: SwipeActionOpenSide
  /** @default "none" */
  defaultOpenSide?: SwipeActionOpenSide
  onOpenSideChange?: (side: SwipeActionOpenSide) => void
  onAction?: (id: string, side: SwipeActionSide) => void
  /** @default true */
  closeOnAction?: boolean
  /** @default 72 */
  actionWidth?: number
  /** @default 56 */
  threshold?: number
  disabled?: boolean
  /** @default "Swipe actions" */
  ariaLabel?: string
}

type SwipeReleaseInput = {
  offset: number
  startWidth: number
  endWidth: number
  threshold: number
  startOpenSide: SwipeActionOpenSide
}

const swipeInteractiveSelector = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "[role='button']",
  "[contenteditable='true']",
].join(",")

export function resolveSwipeActionActionWidth(value?: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 72
  return Math.max(48, Math.round(value))
}

export function resolveSwipeActionThreshold(value?: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 56
  return Math.max(16, Math.round(value))
}

export function resolveSwipeActionCloseOnAction(value?: boolean): boolean {
  return value ?? true
}

export function resolveSwipeActionOpenSide(
  value: SwipeActionOpenSide | undefined,
  hasStartActions: boolean,
  hasEndActions: boolean,
): SwipeActionOpenSide {
  if (value === "start") return hasStartActions ? "start" : "none"
  if (value === "end") return hasEndActions ? "end" : "none"
  return "none"
}

export function clampSwipeActionOffset(offset: number, startWidth: number, endWidth: number): number {
  return Math.min(startWidth, Math.max(-endWidth, Math.round(offset)))
}

export function resolveSwipeActionReleaseSide({
  offset,
  startWidth,
  endWidth,
  threshold,
  startOpenSide,
}: SwipeReleaseInput): SwipeActionOpenSide {
  if (startOpenSide === "none") {
    if (offset >= threshold && startWidth > 0) return "start"
    if (offset <= -threshold && endWidth > 0) return "end"
    return "none"
  }

  if (startOpenSide === "start") {
    if (offset <= -threshold && endWidth > 0) return "end"
    if (offset >= Math.max(8, startWidth - threshold / 2)) return "start"
    return "none"
  }

  if (offset >= threshold && startWidth > 0) return "start"
  if (offset <= -Math.max(8, endWidth - threshold / 2)) return "end"
  return "none"
}

export function SwipeAction(handle: Handle) {
  let localOpenSide: SwipeActionOpenSide | undefined
  let dragging = false
  let dragOffset = 0
  let activePointerId: number | null = null
  let releaseDragListeners: (() => void) | null = null

  const clearDragListeners = () => {
    if (releaseDragListeners) releaseDragListeners()
    releaseDragListeners = null
    activePointerId = null
    if (!dragging) return
    dragging = false
    handle.update()
  }

  handle.signal.addEventListener("abort", () => {
    clearDragListeners()
  })

  return (props: SwipeActionProps) => {
    const startActions = props.startActions ?? []
    const endActions = props.endActions ?? []
    const hasStartActions = startActions.length > 0
    const hasEndActions = endActions.length > 0
    const actionWidth = resolveSwipeActionActionWidth(props.actionWidth)
    const threshold = resolveSwipeActionThreshold(props.threshold)
    const closeOnAction = resolveSwipeActionCloseOnAction(props.closeOnAction)
    const startWidth = hasStartActions ? actionWidth * startActions.length : 0
    const endWidth = hasEndActions ? actionWidth * endActions.length : 0

    if (props.openSide === undefined && localOpenSide === undefined) {
      localOpenSide = resolveSwipeActionOpenSide(props.defaultOpenSide, hasStartActions, hasEndActions)
    }

    const openSide = resolveSwipeActionOpenSide(props.openSide ?? localOpenSide, hasStartActions, hasEndActions)
    const startInteractive = !props.disabled && openSide === "start"
    const endInteractive = !props.disabled && openSide === "end"
    const baseOffset = openSide === "start" ? startWidth : openSide === "end" ? -endWidth : 0
    const currentOffset = dragging ? clampSwipeActionOffset(dragOffset, startWidth, endWidth) : baseOffset

    const setOpenSide = (nextSide: SwipeActionOpenSide) => {
      const resolved = resolveSwipeActionOpenSide(nextSide, hasStartActions, hasEndActions)

      if (props.openSide === undefined) {
        if (localOpenSide !== resolved) {
          localOpenSide = resolved
          handle.update()
        }
      } else {
        handle.update()
      }

      props.onOpenSideChange?.(resolved)
    }

    const onAction = (action: SwipeActionItem, side: SwipeActionSide) => {
      if (props.disabled || action.disabled) return
      props.onAction?.(action.id, side)
      if (closeOnAction) setOpenSide("none")
    }

    const beginDrag = (pointerEvent: PointerEvent) => {
      if (props.disabled) return
      if (pointerEvent.pointerType === "mouse" && pointerEvent.button !== 0) return
      if (activePointerId !== null && pointerEvent.pointerId !== activePointerId) return

      const target = pointerEvent.target
      if (target instanceof Element && target.closest(swipeInteractiveSelector)) return

      pointerEvent.preventDefault()
      clearDragListeners()

      activePointerId = pointerEvent.pointerId
      dragOffset = currentOffset
      dragging = true
      handle.update()

      const source = pointerEvent.currentTarget
      if (source instanceof Element && typeof source.setPointerCapture === "function") {
        try {
          source.setPointerCapture(pointerEvent.pointerId)
        } catch {}
      }

      const startX = pointerEvent.clientX
      const startY = pointerEvent.clientY
      const startOffset = currentOffset
      const startOpenSide = openSide
      let dragAxis: "undecided" | "horizontal" | "vertical" = "undecided"

      const onMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== activePointerId) return

        const deltaX = moveEvent.clientX - startX
        const deltaY = moveEvent.clientY - startY

        if (dragAxis === "undecided") {
          if (Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) return
          dragAxis = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical"
          if (dragAxis === "vertical") {
            clearDragListeners()
            dragOffset = startOffset
            return
          }
        }

        const nextOffset = clampSwipeActionOffset(startOffset + deltaX, startWidth, endWidth)
        if (dragOffset === nextOffset) return
        dragOffset = nextOffset
        handle.update()
        if (moveEvent.cancelable) moveEvent.preventDefault()
      }

      const onStop = (stopEvent: PointerEvent) => {
        if (stopEvent.pointerId !== activePointerId) return
        const releasedOffset = dragOffset
        clearDragListeners()
        dragOffset = 0

        const nextOpenSide = resolveSwipeActionReleaseSide({
          offset: releasedOffset,
          startWidth,
          endWidth,
          threshold,
          startOpenSide,
        })

        if (nextOpenSide === openSide && props.openSide === undefined) {
          handle.update()
          return
        }

        setOpenSide(nextOpenSide)
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
        className="rf-swipe-action"
        data-open-side={openSide}
        data-dragging={dragging ? "true" : "false"}
        data-disabled={props.disabled ? "true" : "false"}
        style={`--rf-swipe-action-width: ${actionWidth}px; --rf-swipe-action-offset: ${currentOffset}px;`}
      >
        {hasStartActions ? (
          <div
            className="rf-swipe-action-actions"
            data-side="start"
            data-interactive={startInteractive ? "true" : "false"}
            role="group"
            aria-label="Start actions"
            aria-hidden={startInteractive ? undefined : "true"}
          >
            {startActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="rf-swipe-action-button rf-focus-ring"
                data-destructive={action.destructive ? "true" : "false"}
                disabled={props.disabled || !startInteractive || action.disabled}
                tabIndex={startInteractive ? 0 : -1}
                mix={[on("click", () => onAction(action, "start"))]}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}

        {hasEndActions ? (
          <div
            className="rf-swipe-action-actions"
            data-side="end"
            data-interactive={endInteractive ? "true" : "false"}
            role="group"
            aria-label="End actions"
            aria-hidden={endInteractive ? undefined : "true"}
          >
            {endActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="rf-swipe-action-button rf-focus-ring"
                data-destructive={action.destructive ? "true" : "false"}
                disabled={props.disabled || !endInteractive || action.disabled}
                tabIndex={endInteractive ? 0 : -1}
                mix={[on("click", () => onAction(action, "end"))]}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}

        <div
          className="rf-swipe-action-content"
          role="group"
          aria-label={props.ariaLabel ?? "Swipe actions"}
          mix={[
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
