import type { Handle } from "remix/component"

export type InputType = "text" | "email" | "password" | "search" | "url" | "tel"

export type InputProps = {
  id?: string
  type?: InputType
  name?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

function assertNativeInputType(type: string): asserts type is InputType {
  const allowed = new Set(["text", "email", "password", "search", "url", "tel"])
  if (!allowed.has(type)) {
    throw new Error(`Unsupported input type: ${type}`)
  }
}

export function Input(_handle: Handle) {
  return (props: InputProps) => {
    const type = props.type ?? "text"
    assertNativeInputType(type)

    const inputProps = {
      id: props.id,
      type,
      name: props.name,
      value: props.value,
      defaultValue: props.defaultValue,
      disabled: props.disabled,
      required: props.required,
      placeholder: props.placeholder,
      "aria-describedby": props["aria-describedby"],
      "aria-invalid": props["aria-invalid"],
      className: "rf-input-base rf-focus-ring",
    } as unknown as Record<string, unknown>

    return <input {...inputProps} />
  }
}
