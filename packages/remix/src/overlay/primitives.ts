export type DismissReason = "escape" | "outside"

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

export function trapTabNavigation(event: KeyboardEvent, root: HTMLElement): void {
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
    return
  }

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  }
}

export function focusInitial(root: HTMLElement): void {
  const focusable = getFocusableElements(root)
  const first = focusable[0]
  if (first) {
    first.focus()
    return
  }

  root.setAttribute("tabindex", "-1")
  root.focus()
}

export function lockDocumentScroll(doc: Document): () => void {
  const previousOverflow = doc.body.style.overflow
  doc.body.style.overflow = "hidden"
  return () => {
    doc.body.style.overflow = previousOverflow
  }
}

type Restore = () => void

export function isolateModalTree(doc: Document, modalRoot: HTMLElement): Restore {
  const restores: Restore[] = []

  for (const child of Array.from(doc.body.children)) {
    if (!(child instanceof HTMLElement)) continue
    if (child === modalRoot || child.contains(modalRoot)) continue

    const el = child as HTMLElement & { inert?: boolean }
    const hadInert = "inert" in el ? Boolean(el.inert) : false
    const previousAriaHidden = child.getAttribute("aria-hidden")
    const previousPointerEvents = child.style.pointerEvents

    if ("inert" in el) {
      el.inert = true
      restores.push(() => {
        el.inert = hadInert
      })
    } else {
      child.setAttribute("aria-hidden", "true")
      child.style.pointerEvents = "none"
      restores.push(() => {
        if (previousAriaHidden === null) child.removeAttribute("aria-hidden")
        else child.setAttribute("aria-hidden", previousAriaHidden)
        child.style.pointerEvents = previousPointerEvents
      })
    }
  }

  return () => {
    for (const restore of restores) restore()
  }
}

export function mountInContainer(node: HTMLElement, container: HTMLElement): () => void {
  if (node.parentElement !== container) {
    container.appendChild(node)
  }

  return () => {
    node.remove()
  }
}

export function getEnabledMenuItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[role='menuitem']:not([disabled])"))
}

export function focusMenuBoundary(root: HTMLElement, boundary: "first" | "last"): void {
  const items = getEnabledMenuItems(root)
  if (items.length === 0) return

  const target = boundary === "first" ? items[0] : items[items.length - 1]
  target?.focus()
}

export function focusMenuStep(root: HTMLElement, step: 1 | -1): void {
  const items = getEnabledMenuItems(root)
  if (items.length === 0) return

  const active = document.activeElement
  const currentIndex = items.findIndex((item) => item === active)
  const nextIndex =
    currentIndex === -1 ? (step === 1 ? 0 : items.length - 1) : (currentIndex + step + items.length) % items.length
  const next = items[nextIndex]
  next?.focus()
}
