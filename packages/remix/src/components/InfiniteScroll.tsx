import { on, ref, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type InfiniteScrollState = "idle" | "loading" | "complete"

export type InfiniteScrollProps = {
  children: ComponentChildren
  loadMore?: () => void | Promise<void>
  hasMore?: boolean
  loading?: boolean
  disabled?: boolean
  /** @default 120 */
  threshold?: number
  /** @default "Scroll for more" */
  idleText?: ComponentChildren
  /** @default "Loading more..." */
  loadingText?: ComponentChildren
  /** @default "No more items" */
  completeText?: ComponentChildren
  /** @default "Infinite scroll" */
  ariaLabel?: string
}

export function resolveInfiniteScrollThreshold(value?: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 120
  return Math.max(24, Math.round(value))
}

export function resolveInfiniteScrollHasMore(value?: boolean): boolean {
  return value ?? true
}

export function resolveInfiniteScrollLoading(controlledLoading: boolean | undefined, localLoading: boolean): boolean {
  return controlledLoading ?? localLoading
}

export function resolveInfiniteScrollState(loading: boolean, hasMore: boolean): InfiniteScrollState {
  if (loading) return "loading"
  if (!hasMore) return "complete"
  return "idle"
}

export function shouldInfiniteScrollLoadMore(
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
  threshold: number,
): boolean {
  return scrollHeight - (scrollTop + clientHeight) <= threshold
}

function resolveInfiniteScrollStatusLabel(state: InfiniteScrollState, props: InfiniteScrollProps): ComponentChildren {
  if (state === "loading") return props.loadingText ?? "Loading more..."
  if (state === "complete") return props.completeText ?? "No more items"
  return props.idleText ?? "Scroll for more"
}

export function InfiniteScroll(handle: Handle) {
  let localLoading = false
  let viewportElement: HTMLElement | null = null
  let initialCheckNode: HTMLElement | null = null
  let inFlight = false
  let requestToken = 0
  let latestProps: InfiniteScrollProps | null = null
  let latestThreshold = 120

  const maybeLoad = (node: HTMLElement | null) => {
    const props = latestProps
    if (!props) return

    const threshold = latestThreshold
    const hasMore = resolveInfiniteScrollHasMore(props.hasMore)
    const loading = resolveInfiniteScrollLoading(props.loading, localLoading)

    if (!node) return
    if (!props.loadMore) return
    if (props.disabled || inFlight || !hasMore || loading) return
    if (!shouldInfiniteScrollLoadMore(node.scrollTop, node.clientHeight, node.scrollHeight, threshold)) return

    const currentRequestToken = ++requestToken
    inFlight = true

    if (props.loading === undefined) {
      localLoading = true
      handle.update()
    }

    const finish = () => {
      if (currentRequestToken !== requestToken) return

      inFlight = false

      if (props.loading === undefined) {
        localLoading = false
        handle.update()
      }

      handle.queueTask(() => {
        maybeLoad(viewportElement)
      })
    }

    Promise.resolve()
      .then(() => props.loadMore?.())
      .then(finish, finish)
  }

  handle.signal.addEventListener("abort", () => {
    requestToken += 1
    inFlight = false
    viewportElement = null
    latestProps = null
  })

  return (props: InfiniteScrollProps) => {
    const threshold = resolveInfiniteScrollThreshold(props.threshold)
    const hasMore = resolveInfiniteScrollHasMore(props.hasMore)
    const loading = resolveInfiniteScrollLoading(props.loading, localLoading)
    const state = resolveInfiniteScrollState(loading, hasMore)
    const statusLabel = resolveInfiniteScrollStatusLabel(state, props)

    latestProps = props
    latestThreshold = threshold

    return (
      <section className="rf-infinite-scroll" data-state={state} aria-label={props.ariaLabel ?? "Infinite scroll"}>
        <div
          className="rf-infinite-scroll-viewport"
          mix={[
            ref((node) => {
              viewportElement = node

              if (initialCheckNode === node) return
              initialCheckNode = node

              handle.queueTask(() => {
                if (!viewportElement || viewportElement !== node) return
                maybeLoad(viewportElement)
              })
            }),
            on("scroll", () => {
              maybeLoad(viewportElement)
            }),
          ]}
        >
          {props.children}
        </div>
        <div className="rf-infinite-scroll-footer" aria-live="polite" aria-atomic="true">
          <span className="rf-infinite-scroll-status">{statusLabel}</span>
        </div>
      </section>
    )
  }
}
