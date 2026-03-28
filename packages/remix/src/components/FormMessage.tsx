import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type FormMessageTone = "help" | "success" | "warning" | "error"

export type FormMessageProps = {
  id?: string
  tone?: FormMessageTone
  children: ComponentChildren
}

export function resolveFormMessageA11y(tone: FormMessageTone): {
  role?: "status" | "alert"
  live?: "polite" | "assertive"
} {
  if (tone === "error") {
    return { role: "alert", live: "assertive" }
  }
  if (tone === "success" || tone === "warning") {
    return { role: "status", live: "polite" }
  }
  return {}
}

export function FormMessage(_handle: Handle) {
  return (props: FormMessageProps) => {
    const tone = props.tone ?? "help"
    const a11y = resolveFormMessageA11y(tone)

    return (
      <p id={props.id} className="rf-form-message" data-tone={tone} role={a11y.role} aria-live={a11y.live}>
        {props.children}
      </p>
    )
  }
}
