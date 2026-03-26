export type OverlayDismissReason = "escape" | "outside" | "programmatic"

export function getFocusableElements(root: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",")

  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true",
  )
}

export function trapTab(event: KeyboardEvent, root: HTMLElement): void {
  if (event.key !== "Tab") return

  const focusable = getFocusableElements(root)
  if (focusable.length === 0) {
    event.preventDefault()
    root.focus()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  const active = document.activeElement
  if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  }
}
