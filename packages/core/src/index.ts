export type FieldIds = {
  inputId: string
  descriptionId?: string
  errorId?: string
}

export type AriaFieldState = {
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

export function createFieldIds(seed: string): FieldIds {
  return {
    inputId: `${seed}-input`,
    descriptionId: `${seed}-description`,
    errorId: `${seed}-error`,
  }
}

export function createAriaFieldState(params: {
  descriptionId?: string
  errorId?: string
  invalid?: boolean
}): AriaFieldState {
  const describedBy = [params.descriptionId, params.errorId].filter(Boolean).join(" ")

  return {
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(params.invalid ? { "aria-invalid": "true" as const } : {}),
  }
}

export type ControlledValue<T> = { mode: "controlled"; value: T } | { mode: "uncontrolled"; defaultValue?: T }

export function getCheckboxSubmissionValue(value?: string): string {
  return value ?? "on"
}

export function assertNativeInputType(
  type: string,
): asserts type is "text" | "email" | "password" | "search" | "url" | "tel" {
  const allowed = new Set(["text", "email", "password", "search", "url", "tel"])
  if (!allowed.has(type)) {
    throw new Error(`Unsupported input type: ${type}`)
  }
}
