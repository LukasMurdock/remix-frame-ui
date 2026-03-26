import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type ToastTone = "neutral" | "success" | "danger"

export type ToastItem = {
  id: string
  tone?: ToastTone
  content: ComponentChildren
  durationMs?: number
  dismissible?: boolean
}

export type ToastViewportProps = {
  items: ToastItem[]
  onPause?: (id: string) => void
  onResume?: (id: string) => void
  onDismiss?: (id: string, reason: "escape" | "close-button") => void
}

export function ToastViewport(_handle: Handle) {
  return (props: ToastViewportProps) => (
    <section aria-label="Notifications" role="region">
      <ul aria-live="polite" aria-relevant="additions removals" aria-atomic="false">
        {props.items.map((item) => {
          const tone = item.tone ?? "neutral"
          const ariaLive = tone === "danger" ? "assertive" : "polite"
          const dismissible = item.dismissible ?? true

          return (
            <li
              key={item.id}
              data-tone={tone}
              aria-live={ariaLive}
              tabIndex={0}
              mix={[
                on("mouseenter", () => props.onPause?.(item.id)),
                on("mouseleave", () => props.onResume?.(item.id)),
                on("focusin", () => props.onPause?.(item.id)),
                on("focusout", () => props.onResume?.(item.id)),
                on("keydown", (event) => {
                  if (event.key !== "Escape") return
                  if (!dismissible) return
                  props.onDismiss?.(item.id, "escape")
                }),
              ]}
            >
              <div>{item.content}</div>
              {dismissible ? (
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  mix={[on("click", () => props.onDismiss?.(item.id, "close-button"))]}
                >
                  Dismiss
                </button>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export type ToastStore = {
  items(): ToastItem[]
  show(item: ToastItem): void
  dismiss(id: string, reason?: "timeout" | "programmatic" | "escape" | "close-button"): void
  pause(id: string): void
  resume(id: string): void
}

export function createToastStore(
  initial: ToastItem[] = [],
  options: {
    defaultDurationMs?: number
  } = {},
): ToastStore {
  const queue = [...initial]
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  const startedAt = new Map<string, number>()
  const remainingMs = new Map<string, number>()
  const defaultDurationMs = options.defaultDurationMs ?? 5000

  function clearTimer(id: string): void {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
  }

  function schedule(item: ToastItem, ms: number): void {
    if (ms <= 0) {
      dismiss(item.id)
      return
    }

    clearTimer(item.id)
    startedAt.set(item.id, Date.now())
    remainingMs.set(item.id, ms)
    const timer = setTimeout(() => dismiss(item.id, "timeout"), ms)
    timers.set(item.id, timer)
  }

  function dismiss(id: string, _reason?: "timeout" | "programmatic" | "escape" | "close-button"): void {
    clearTimer(id)
    startedAt.delete(id)
    remainingMs.delete(id)

    const index = queue.findIndex((item) => item.id === id)
    if (index >= 0) queue.splice(index, 1)
  }

  for (const item of initial) {
    const duration = item.durationMs ?? defaultDurationMs
    if (duration > 0) schedule(item, duration)
  }

  return {
    items() {
      return [...queue]
    },
    show(item) {
      queue.push(item)
      const duration = item.durationMs ?? defaultDurationMs
      if (duration > 0) schedule(item, duration)
    },
    dismiss,
    pause(id) {
      const start = startedAt.get(id)
      const remaining = remainingMs.get(id)
      if (start === undefined || remaining === undefined) return

      const elapsed = Date.now() - start
      const nextRemaining = Math.max(0, remaining - elapsed)
      remainingMs.set(id, nextRemaining)
      clearTimer(id)
    },
    resume(id) {
      const remaining = remainingMs.get(id)
      const item = queue.find((entry) => entry.id === id)
      if (!item || remaining === undefined) return
      schedule(item, remaining)
    },
  }
}
