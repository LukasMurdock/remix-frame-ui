import { on, type Handle } from "remix/component"

export type TextareaProps = {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  /** @default 4 */
  rows?: number
  maxLength?: number
  minLength?: number
  onValueChange?: (value: string | undefined) => void
  "aria-describedby"?: string
  "aria-invalid"?: "true"
}

export function resolveTextareaRows(rows?: number): number {
  if (rows === undefined) return 4
  return rows > 0 ? rows : 1
}

export function Textarea(_handle: Handle) {
  return (props: TextareaProps) => (
    <textarea
      id={props.id}
      name={props.name}
      value={props.value}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      required={props.required}
      placeholder={props.placeholder}
      rows={resolveTextareaRows(props.rows)}
      maxLength={props.maxLength}
      minLength={props.minLength}
      aria-describedby={props["aria-describedby"]}
      aria-invalid={props["aria-invalid"]}
      className="rf-input-base rf-textarea-base rf-focus-ring"
      mix={[
        on("input", (event) => {
          const target = event.currentTarget as HTMLTextAreaElement
          props.onValueChange?.(target.value || undefined)
        }),
      ]}
    />
  )
}
