import { on, ref, type Handle } from "remix/component"
import {
  focusInitial,
  isolateModalTree,
  lockDocumentScroll,
  mountInContainer,
  trapTabNavigation,
} from "../overlay/primitives"

export type ImageViewerImage = {
  src: string
  alt?: string
}

export type ImageViewerCloseReason = "escape" | "backdrop" | "close-button" | "programmatic"

export type ImageViewerProps = {
  /** @default false */
  open?: boolean
  /** @default false */
  visible?: boolean
  images: readonly ImageViewerImage[]
  index?: number
  /** @default 0 */
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  onClose: (reason: ImageViewerCloseReason) => void
  afterClose?: () => void
  /** @default true */
  dismissOnBackdrop?: boolean
  /** @default true */
  dismissOnEscape?: boolean
  /** @default false */
  loop?: boolean
  /** @default true */
  showCounter?: boolean
  /** @default true */
  restoreFocus?: boolean
  container?: HTMLElement
  /** @default "Image viewer" */
  ariaLabel?: string
}

export function resolveImageViewerDismissOnBackdrop(value?: boolean): boolean {
  return value ?? true
}

export function resolveImageViewerDismissOnEscape(value?: boolean): boolean {
  return value ?? true
}

export function resolveImageViewerLoop(value?: boolean): boolean {
  return value ?? false
}

export function resolveImageViewerShowCounter(value?: boolean): boolean {
  return value ?? true
}

export function resolveImageViewerOpen(open: boolean | undefined, visible: boolean | undefined): boolean {
  return visible ?? open ?? false
}

export function normalizeImageViewerIndex(index: number | undefined, imageCount: number): number {
  if (imageCount <= 0) return 0
  if (typeof index !== "number" || !Number.isFinite(index)) return 0
  return Math.min(imageCount - 1, Math.max(0, Math.round(index)))
}

export function resolveImageViewerNextIndex(
  currentIndex: number,
  direction: 1 | -1,
  imageCount: number,
  loop: boolean,
): number {
  if (imageCount <= 0) return 0
  if (loop) return (currentIndex + direction + imageCount) % imageCount
  return Math.min(imageCount - 1, Math.max(0, currentIndex + direction))
}

let activeImageViewerId: string | null = null

export function ImageViewer(handle: Handle) {
  let localIndex: number | undefined
  let panel: HTMLElement | null = null
  let portalNode: HTMLElement | null = null
  let previousOpen = false
  let previousFocus: HTMLElement | null = null
  let restoreIsolation: (() => void) | null = null
  let restoreScroll: (() => void) | null = null
  let programmaticCloseNotified = false
  let blockedByActiveViewer = false
  let touchStartX = 0
  let touchTracking = false

  const teardown = (props: ImageViewerProps) => {
    restoreIsolation?.()
    restoreIsolation = null

    restoreScroll?.()
    restoreScroll = null

    if (props.restoreFocus !== false && previousFocus) {
      previousFocus.focus()
    }

    if (activeImageViewerId === handle.id) activeImageViewerId = null

    props.afterClose?.()
  }

  handle.signal.addEventListener("abort", () => {
    restoreIsolation?.()
    restoreScroll?.()
    restoreIsolation = null
    restoreScroll = null
    if (activeImageViewerId === handle.id) activeImageViewerId = null
  })

  return (props: ImageViewerProps) => {
    const isOpen = resolveImageViewerOpen(props.open, props.visible)
    const imageCount = props.images.length

    if (!isOpen) {
      if (previousOpen) {
        teardown(props)
      }
      previousOpen = false
      programmaticCloseNotified = false
      blockedByActiveViewer = false
      return null
    }

    if (blockedByActiveViewer || (activeImageViewerId !== null && activeImageViewerId !== handle.id)) {
      blockedByActiveViewer = true
      previousOpen = false

      if (!programmaticCloseNotified) {
        programmaticCloseNotified = true
        handle.queueTask(() => {
          props.onClose("programmatic")
        })
      }
      return null
    }

    blockedByActiveViewer = false
    programmaticCloseNotified = false

    if (!previousOpen && typeof document !== "undefined") {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null

      if (props.index === undefined) {
        localIndex = normalizeImageViewerIndex(props.defaultIndex ?? 0, imageCount)
      }
    }
    previousOpen = true

    const currentIndex = normalizeImageViewerIndex(props.index ?? localIndex ?? props.defaultIndex ?? 0, imageCount)
    if (props.index === undefined) {
      localIndex = currentIndex
    }

    const currentImage = props.images[currentIndex]
    const dismissOnBackdrop = resolveImageViewerDismissOnBackdrop(props.dismissOnBackdrop)
    const dismissOnEscape = resolveImageViewerDismissOnEscape(props.dismissOnEscape)
    const loop = resolveImageViewerLoop(props.loop)
    const showCounter = resolveImageViewerShowCounter(props.showCounter)

    const canGoPrevious = imageCount > 1 && (loop || currentIndex > 0)
    const canGoNext = imageCount > 1 && (loop || currentIndex < imageCount - 1)

    const setIndex = (next: number) => {
      const resolved = normalizeImageViewerIndex(next, imageCount)

      if (props.index === undefined) {
        if (localIndex !== resolved) {
          localIndex = resolved
          handle.update()
        }
      }

      props.onIndexChange?.(resolved)
    }

    const step = (direction: 1 | -1) => {
      if (imageCount <= 1) return
      const next = resolveImageViewerNextIndex(currentIndex, direction, imageCount, loop)
      if (next === currentIndex) return
      setIndex(next)
    }

    return (
      <div
        className="rf-image-viewer-portal"
        mix={[
          ref((node, signal) => {
            if (typeof document === "undefined") return

            const target = props.container ?? document.body
            portalNode = node

            const restoreMount = mountInContainer(node, target)

            signal.addEventListener("abort", () => {
              restoreMount()
            })
          }),
        ]}
      >
        <div
          className="rf-image-viewer-backdrop"
          role="presentation"
          mix={[
            on("click", (event) => {
              if (!dismissOnBackdrop) return
              if (event.target !== event.currentTarget) return
              props.onClose("backdrop")
            }),
          ]}
        >
          <section
            className="rf-image-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={props.ariaLabel ?? "Image viewer"}
            mix={[
              ref((node) => {
                panel = node

                if (!panel || typeof document === "undefined") return
                if (activeImageViewerId === handle.id) return

                activeImageViewerId = handle.id
                restoreScroll = lockDocumentScroll(document)
                if (portalNode) {
                  restoreIsolation = isolateModalTree(document, portalNode)
                }

                focusInitial(panel)
              }),
              on("keydown", (event) => {
                if (!panel) return

                if (event.key === "Tab") {
                  trapTabNavigation(event, panel)
                  return
                }

                if (event.key === "Escape") {
                  if (!dismissOnEscape) return
                  props.onClose("escape")
                  return
                }

                if (event.key === "ArrowRight") {
                  event.preventDefault()
                  step(1)
                  return
                }

                if (event.key === "ArrowLeft") {
                  event.preventDefault()
                  step(-1)
                  return
                }

                if (event.key === "Home") {
                  event.preventDefault()
                  if (imageCount > 0) setIndex(0)
                  return
                }

                if (event.key === "End") {
                  event.preventDefault()
                  if (imageCount > 0) setIndex(imageCount - 1)
                }
              }),
            ]}
          >
            <header className="rf-image-viewer-header">
              {showCounter && imageCount > 0 ? (
                <p className="rf-image-viewer-counter" aria-live="polite" aria-atomic="true">
                  {currentIndex + 1} / {imageCount}
                </p>
              ) : (
                <span className="rf-image-viewer-counter" aria-hidden="true" />
              )}
              <button
                type="button"
                className="rf-image-viewer-close rf-focus-ring"
                aria-label="Close image viewer"
                mix={[on("click", () => props.onClose("close-button"))]}
              >
                Close
              </button>
            </header>

            <div className="rf-image-viewer-stage">
              <button
                type="button"
                className="rf-image-viewer-nav rf-focus-ring"
                data-direction="prev"
                disabled={!canGoPrevious}
                aria-label="Previous image"
                mix={[on("click", () => step(-1))]}
              >
                Prev
              </button>

              <figure className="rf-image-viewer-frame">
                {currentImage ? (
                  <img
                    key={`${currentIndex}-${currentImage.src}`}
                    src={currentImage.src}
                    alt={currentImage.alt ?? `Image ${currentIndex + 1}`}
                    className="rf-image-viewer-image"
                    loading="eager"
                    mix={[
                      on("touchstart", (event) => {
                        if (imageCount <= 1) return
                        const touch = event.touches[0]
                        if (!touch) return
                        touchStartX = touch.clientX
                        touchTracking = true
                      }),
                      on("touchend", (event) => {
                        if (imageCount <= 1 || !touchTracking) return
                        touchTracking = false
                        const touch = event.changedTouches[0]
                        if (!touch) return
                        const delta = touch.clientX - touchStartX
                        if (Math.abs(delta) < 36) return
                        if (delta < 0) {
                          step(1)
                        } else {
                          step(-1)
                        }
                      }),
                      on("touchcancel", () => {
                        touchTracking = false
                      }),
                    ]}
                  />
                ) : (
                  <figcaption className="rf-image-viewer-empty">No images available.</figcaption>
                )}
              </figure>

              <button
                type="button"
                className="rf-image-viewer-nav rf-focus-ring"
                data-direction="next"
                disabled={!canGoNext}
                aria-label="Next image"
                mix={[on("click", () => step(1))]}
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </div>
    )
  }
}
