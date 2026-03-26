import type { Handle } from "remix/component"

export type FileUploadCapture = "user" | "environment"

export type FileUploadProps = {
  id?: string
  name?: string
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  accept?: string[] | string
  capture?: FileUploadCapture
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

export function normalizeFileUploadAccept(accept?: string[] | string): string | undefined {
  if (accept === undefined) return undefined
  if (Array.isArray(accept)) {
    const cleaned = accept.map((item) => item.trim()).filter(Boolean)
    return cleaned.length > 0 ? cleaned.join(",") : undefined
  }

  const normalized = accept
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(",")

  return normalized || undefined
}

export function FileUpload(_handle: Handle) {
  return (props: FileUploadProps) => (
    <input
      id={props.id}
      type="file"
      name={props.name}
      disabled={props.disabled}
      required={props.required}
      multiple={props.multiple}
      accept={normalizeFileUploadAccept(props.accept)}
      capture={props.capture}
      aria-describedby={props["aria-describedby"]}
      aria-invalid={props["aria-invalid"]}
      className="rf-file-upload rf-focus-ring"
    />
  )
}
