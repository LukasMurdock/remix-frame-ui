import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type FloatingPanelPlacement = "bottom" | "top"

export type FloatingPanelProps = {
  children: ComponentChildren
  /** @default [120, 280, 440] */
  anchors?: number[]
  height?: number
  /** @default first anchor */
  defaultHeight?: number
  onHeightChange?: (height: number, animating: boolean) => void
  /** @default "bottom" */
  placement?: FloatingPanelPlacement
  /** @default true */
  handleDraggingOfContent?: boolean
  /** @default "Floating panel" */
  ariaLabel?: string
}

const DEFAULT_FLOATING_PANEL_MIN = 120
const DEFAULT_FLOATING_PANEL_MID = 280
const DEFAULT_FLOATING_PANEL_MAX = 440
const DEFAULT_FLOATING_PANEL_ANCHORS = [
  DEFAULT_FLOATING_PANEL_MIN,
  DEFAULT_FLOATING_PANEL_MID,
  DEFAULT_FLOATING_PANEL_MAX,
]

const interactiveContentSelector = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "[role='button']",
  "[contenteditable='true']",
].join(",")

export function resolveFloatingPanelPlacement(placement?: FloatingPanelPlacement): FloatingPanelPlacement {
  return placement ?? "bottom"
}

export function resolveFloatingPanelHandleDraggingOfContent(value?: boolean): boolean {
  return value ?? true
}

export function normalizeFloatingPanelAnchors(anchors?: number[]): number[] {
  const source = anchors && anchors.length > 0 ? anchors : DEFAULT_FLOATING_PANEL_ANCHORS
  const seen = new Set<number>()
  const normalized: number[] = []

  for (const anchor of source) {
    const value = Math.round(anchor)
    if (!Number.isFinite(value) || value <= 0) continue
    if (seen.has(value)) continue
    seen.add(value)
    normalized.push(value)
  }

  if (normalized.length === 0) return [...DEFAULT_FLOATING_PANEL_ANCHORS]
  normalized.sort((a, b) => a - b)
  return normalized
}

export function clampFloatingPanelHeight(height: number, anchors: number[]): number {
  const normalizedAnchors = normalizeFloatingPanelAnchors(anchors)
  const min = normalizedAnchors[0] ?? DEFAULT_FLOATING_PANEL_MIN
  const max = normalizedAnchors[normalizedAnchors.length - 1] ?? DEFAULT_FLOATING_PANEL_MAX
  return Math.min(max, Math.max(min, Math.round(height)))
}

export function resolveFloatingPanelHeight(params: {
  anchors: number[]
  height?: number
  localHeight?: number
  defaultHeight?: number
}): number {
  const anchors = normalizeFloatingPanelAnchors(params.anchors)
  const fallback = params.defaultHeight ?? anchors[0] ?? DEFAULT_FLOATING_PANEL_MIN
  const value = params.height ?? params.localHeight ?? fallback
  return clampFloatingPanelHeight(value, anchors)
}

export function findNearestFloatingPanelAnchor(height: number, anchors: number[]): number {
  const normalizedAnchors = normalizeFloatingPanelAnchors(anchors)
  const clamped = clampFloatingPanelHeight(height, normalizedAnchors)
  let nearest = normalizedAnchors[0] ?? clamped

  for (const anchor of normalizedAnchors) {
    if (Math.abs(anchor - clamped) < Math.abs((nearest ?? clamped) - clamped)) {
      nearest = anchor
    }
  }

  return nearest ?? clamped
}

export function stepFloatingPanelHeight(
  currentHeight: number,
  key: string,
  placement: FloatingPanelPlacement,
  anchors: number[],
): number | undefined {
  const normalizedAnchors = normalizeFloatingPanelAnchors(anchors)
  const currentAnchor = findNearestFloatingPanelAnchor(currentHeight, normalizedAnchors)
  const index = Math.max(0, normalizedAnchors.indexOf(currentAnchor))
  const last = normalizedAnchors.length - 1

  if (key === "Home") return normalizedAnchors[0]
  if (key === "End") return normalizedAnchors[last]

  if (placement === "bottom") {
    if (key === "ArrowUp") return normalizedAnchors[Math.min(last, index + 1)]
    if (key === "ArrowDown") return normalizedAnchors[Math.max(0, index - 1)]
    return undefined
  }

  if (key === "ArrowDown") return normalizedAnchors[Math.min(last, index + 1)]
  if (key === "ArrowUp") return normalizedAnchors[Math.max(0, index - 1)]
  return undefined
}

export function calculateFloatingPanelDragHeight(
  startHeight: number,
  startY: number,
  nextY: number,
  placement: FloatingPanelPlacement,
  anchors: number[],
): number {
  const delta = startY - nextY
  const direction = placement === "bottom" ? 1 : -1
  const nextHeight = startHeight + delta * direction
  return clampFloatingPanelHeight(nextHeight, anchors)
}

export function canDragFloatingPanelFromContent(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  placement: FloatingPanelPlacement,
): boolean {
  if (scrollHeight <= clientHeight + 1) return true
  if (placement === "bottom") return scrollTop <= 0
  return scrollTop + clientHeight >= scrollHeight - 1
}

export function FloatingPanel(handle: Handle) {
  let localHeight: number | undefined
  let dragHeight: number | null = null
  let dragging = false
  let bodyElement: HTMLElement | null = null
  let releaseDragListeners: (() => void) | null = null

  const clearDragListeners = () => {
    releaseDragListeners?.()
    releaseDragListeners = null
  }

  const setDragging = (next: boolean) => {
    if (dragging === next) return
    dragging = next
    handle.update()
  }

  handle.signal.addEventListener("abort", () => {
    clearDragListeners()
    bodyElement = null
    dragHeight = null
    dragging = false
  })

  return (props: FloatingPanelProps) => {
    const anchors = normalizeFloatingPanelAnchors(props.anchors)
    const placement = resolveFloatingPanelPlacement(props.placement)
    const heightState: {
      anchors: number[]
      height?: number
      localHeight?: number
      defaultHeight?: number
    } = { anchors }
    if (props.height !== undefined) heightState.height = props.height
    if (localHeight !== undefined) heightState.localHeight = localHeight
    if (props.defaultHeight !== undefined) heightState.defaultHeight = props.defaultHeight

    const baseHeight = resolveFloatingPanelHeight(heightState)
    const currentHeight = dragHeight === null ? baseHeight : clampFloatingPanelHeight(dragHeight, anchors)

    const emitHeight = (next: number, animating: boolean) => {
      props.onHeightChange?.(next, animating)
    }

    const previewHeight = (next: number) => {
      const resolved = clampFloatingPanelHeight(next, anchors)
      if (dragHeight === resolved) return
      dragHeight = resolved
      handle.update()
      emitHeight(resolved, false)
    }

    const commitHeight = (next: number, animating: boolean) => {
      const resolved = clampFloatingPanelHeight(next, anchors)
      dragHeight = null

      if (props.height === undefined) {
        if (localHeight !== resolved) {
          localHeight = resolved
          handle.update()
        }
      } else {
        handle.update()
      }

      emitHeight(resolved, animating)
    }

    const beginDrag = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerType === "mouse" && pointerEvent.button !== 0) return

      pointerEvent.preventDefault()
      clearDragListeners()

      const startY = pointerEvent.clientY
      const startHeight = currentHeight
      dragHeight = startHeight
      setDragging(true)

      const onMove = (moveEvent: PointerEvent) => {
        const next = calculateFloatingPanelDragHeight(startHeight, startY, moveEvent.clientY, placement, anchors)
        previewHeight(next)
        if (moveEvent.cancelable) moveEvent.preventDefault()
      }

      const onStop = () => {
        const next = findNearestFloatingPanelAnchor(dragHeight ?? startHeight, anchors)
        clearDragListeners()
        setDragging(false)
        commitHeight(next, true)
      }

      document.addEventListener("pointermove", onMove)
      document.addEventListener("pointerup", onStop)
      document.addEventListener("pointercancel", onStop)

      releaseDragListeners = () => {
        document.removeEventListener("pointermove", onMove)
        document.removeEventListener("pointerup", onStop)
        document.removeEventListener("pointercancel", onStop)
      }
    }

    return (
      <section
        className="rf-floating-panel"
        data-placement={placement}
        data-dragging={dragging ? "true" : "false"}
        role="region"
        aria-label={props.ariaLabel ?? "Floating panel"}
        style={`--rf-floating-panel-height: ${Math.round(currentHeight)}px;`}
      >
        <div
          className="rf-floating-panel-handle rf-focus-ring"
          tabIndex={0}
          role="separator"
          aria-orientation="vertical"
          aria-valuemin={anchors[0]}
          aria-valuemax={anchors[anchors.length - 1]}
          aria-valuenow={Math.round(currentHeight)}
          aria-label={props.ariaLabel ?? "Floating panel"}
          mix={[
            on("pointerdown", (event) => {
              beginDrag(event as PointerEvent)
            }),
            on("keydown", (event) => {
              const keyboardEvent = event as KeyboardEvent
              const next = stepFloatingPanelHeight(currentHeight, keyboardEvent.key, placement, anchors)
              if (next === undefined) return
              keyboardEvent.preventDefault()
              commitHeight(next, true)
            }),
          ]}
        >
          <span className="rf-floating-panel-handle-bar" aria-hidden="true" />
        </div>

        <div
          className="rf-floating-panel-body"
          mix={[
            ref((node) => {
              bodyElement = node
            }),
            on("pointerdown", (event) => {
              if (!resolveFloatingPanelHandleDraggingOfContent(props.handleDraggingOfContent)) return

              const pointerEvent = event as PointerEvent
              if (pointerEvent.pointerType === "mouse" && pointerEvent.button !== 0) return

              if (!bodyElement) return
              if (
                !canDragFloatingPanelFromContent(
                  bodyElement.scrollTop,
                  bodyElement.scrollHeight,
                  bodyElement.clientHeight,
                  placement,
                )
              ) {
                return
              }

              const target = pointerEvent.target
              if (target instanceof Element && target.closest(interactiveContentSelector)) return

              beginDrag(pointerEvent)
            }),
          ]}
        >
          {props.children}
        </div>
      </section>
    )
  }
}
