import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import { normalizeFileUploadAccept } from "./FileUpload"

export type ImageUploaderValueItem = {
  id: string
  src: string
  alt?: string
  fileName?: string
  uploading?: boolean
  error?: boolean
}

export type ImageUploaderUploadResult =
  | string
  | {
      src: string
      alt?: string
      fileName?: string
    }

export type ImageUploaderProps = {
  value?: readonly ImageUploaderValueItem[]
  /** @default [] */
  defaultValue?: readonly ImageUploaderValueItem[]
  onChange?: (items: readonly ImageUploaderValueItem[]) => void
  upload?: (file: File) => ImageUploaderUploadResult | Promise<ImageUploaderUploadResult>
  onUploadError?: (error: unknown, file: File) => void
  /** @default 9 */
  maxCount?: number
  /** @default true (unless maxCount is 1) */
  multiple?: boolean
  /** @default "image/*" */
  accept?: string[] | string
  disabled?: boolean
  /** @default true */
  deletable?: boolean
  /** @default "Add image" */
  addLabel?: ComponentChildren
  /** @default "Image uploader" */
  ariaLabel?: string
}

export function resolveImageUploaderMaxCount(value?: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 9
  return Math.max(1, Math.round(value))
}

export function resolveImageUploaderMultiple(value: boolean | undefined, maxCount: number): boolean {
  if (maxCount <= 1) return false
  return value ?? true
}

export function resolveImageUploaderDeletable(value?: boolean): boolean {
  return value ?? true
}

export function resolveImageUploaderAddLabel(value?: ComponentChildren): ComponentChildren {
  return value ?? "Add image"
}

export function resolveImageUploaderAccept(value?: string[] | string): string {
  return normalizeFileUploadAccept(value) ?? "image/*"
}

export function limitImageUploaderItems(
  items: readonly ImageUploaderValueItem[],
  maxCount: number,
): ImageUploaderValueItem[] {
  return items.slice(0, maxCount)
}

export function resolveImageUploaderUploadResult(
  result: ImageUploaderUploadResult,
  fallback: { alt: string; fileName: string },
): { src: string; alt: string; fileName: string } {
  if (typeof result === "string") {
    return {
      src: result,
      alt: fallback.alt,
      fileName: fallback.fileName,
    }
  }

  return {
    src: result.src,
    alt: result.alt ?? fallback.alt,
    fileName: result.fileName ?? fallback.fileName,
  }
}

export function ImageUploader(handle: Handle) {
  let localItems: ImageUploaderValueItem[] | undefined
  let shadowItems: ImageUploaderValueItem[] = []
  let hasShadow = false
  let lastControlledValue: readonly ImageUploaderValueItem[] | undefined
  let itemSequence = 0
  let disposed = false
  const objectUrlById = new Map<string, string>()

  const revokeObjectUrl = (itemId: string) => {
    const url = objectUrlById.get(itemId)
    if (!url) return
    objectUrlById.delete(itemId)
    if (typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
      URL.revokeObjectURL(url)
    }
  }

  const revokeMissingObjectUrls = (items: readonly ImageUploaderValueItem[]) => {
    const activeIds = new Set(items.map((item) => item.id))
    for (const [itemId] of objectUrlById) {
      if (activeIds.has(itemId)) continue
      revokeObjectUrl(itemId)
    }
  }

  handle.signal.addEventListener("abort", () => {
    disposed = true
    for (const [itemId] of objectUrlById) {
      revokeObjectUrl(itemId)
    }
    objectUrlById.clear()
    shadowItems = []
    localItems = undefined
    lastControlledValue = undefined
  })

  return (props: ImageUploaderProps) => {
    const maxCount = resolveImageUploaderMaxCount(props.maxCount)
    const multiple = resolveImageUploaderMultiple(props.multiple, maxCount)
    const deletable = resolveImageUploaderDeletable(props.deletable)
    const accept = resolveImageUploaderAccept(props.accept)
    const disabled = props.disabled ?? false

    if (props.value !== undefined) {
      if (!hasShadow || props.value !== lastControlledValue) {
        shadowItems = limitImageUploaderItems(props.value, maxCount)
        hasShadow = true
        lastControlledValue = props.value
      }
    } else {
      if (!hasShadow) {
        shadowItems = limitImageUploaderItems(props.defaultValue ?? [], maxCount)
        hasShadow = true
      }
      localItems = limitImageUploaderItems(localItems ?? shadowItems, maxCount)
      shadowItems = localItems
      lastControlledValue = undefined
    }

    const currentItems = shadowItems
    revokeMissingObjectUrls(currentItems)

    const setItems = (nextItems: readonly ImageUploaderValueItem[]) => {
      const normalized = limitImageUploaderItems(nextItems, maxCount)
      revokeMissingObjectUrls(normalized)
      shadowItems = normalized

      if (props.value === undefined) {
        localItems = normalized
      }

      handle.update()
      props.onChange?.(normalized)
    }

    const updateItemById = (itemId: string, patch: Partial<ImageUploaderValueItem>) => {
      const latestItems = limitImageUploaderItems(shadowItems, maxCount)
      const nextItems = latestItems.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
      setItems(nextItems)
    }

    const removeItem = (itemId: string) => {
      const latestItems = limitImageUploaderItems(shadowItems, maxCount)
      const nextItems = latestItems.filter((item) => item.id !== itemId)
      revokeObjectUrl(itemId)
      setItems(nextItems)
    }

    const handleSelectFiles = (input: HTMLInputElement) => {
      if (disabled) return

      const files = input.files ? Array.from(input.files) : []
      if (files.length === 0) return

      const latestItems = limitImageUploaderItems(shadowItems, maxCount)
      const remaining = Math.max(0, maxCount - latestItems.length)
      const selectedFiles = files.slice(0, remaining)

      if (selectedFiles.length === 0) {
        input.value = ""
        return
      }

      const createdItems = selectedFiles.map((file) => {
        const id = `${handle.id}-image-${Date.now()}-${itemSequence}`
        itemSequence += 1

        let previewUrl = ""
        if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
          previewUrl = URL.createObjectURL(file)
          objectUrlById.set(id, previewUrl)
        }

        return {
          id,
          src: previewUrl,
          alt: file.name,
          fileName: file.name,
          uploading: props.upload ? true : false,
          error: false,
        } satisfies ImageUploaderValueItem
      })

      const nextItems = [...latestItems, ...createdItems]
      setItems(nextItems)

      if (props.upload) {
        for (let index = 0; index < selectedFiles.length; index += 1) {
          const file = selectedFiles[index]
          const created = createdItems[index]
          if (!file || !created) continue

          Promise.resolve()
            .then(() => props.upload?.(file))
            .then((result) => {
              if (disposed) return
              if (!result) return

              const previousObjectUrl = objectUrlById.get(created.id)
              const uploadResult = resolveImageUploaderUploadResult(result, {
                alt: file.name,
                fileName: file.name,
              })

              if (previousObjectUrl && uploadResult.src !== previousObjectUrl) {
                revokeObjectUrl(created.id)
              }

              const patch: Partial<ImageUploaderValueItem> = {
                src: uploadResult.src,
                uploading: false,
                error: false,
                alt: uploadResult.alt,
                fileName: uploadResult.fileName,
              }
              updateItemById(created.id, patch)
            })
            .catch((error) => {
              if (disposed) return
              updateItemById(created.id, {
                uploading: false,
                error: true,
              })
              props.onUploadError?.(error, file)
            })
        }
      }

      input.value = ""
    }

    const canAdd = !disabled && currentItems.length < maxCount

    return (
      <section className="rf-image-uploader" aria-label={props.ariaLabel ?? "Image uploader"}>
        <ul className="rf-image-uploader-list" role="list">
          {currentItems.map((item, index) => (
            <li
              key={item.id}
              className="rf-image-uploader-item"
              data-uploading={item.uploading ? "true" : "false"}
              data-error={item.error ? "true" : "false"}
            >
              <figure className="rf-image-uploader-thumb">
                {item.src ? (
                  <img
                    className="rf-image-uploader-image"
                    src={item.src}
                    alt={item.alt ?? `Uploaded image ${index + 1}`}
                  />
                ) : (
                  <span className="rf-image-uploader-empty">No preview</span>
                )}
              </figure>

              <p className="rf-image-uploader-name">{item.fileName ?? `Image ${index + 1}`}</p>

              <p className="rf-image-uploader-status" aria-live="polite" aria-atomic="true">
                {item.uploading ? "Uploading..." : item.error ? "Upload failed" : "Ready"}
              </p>

              {deletable ? (
                <button
                  type="button"
                  className="rf-image-uploader-remove rf-focus-ring"
                  disabled={disabled}
                  aria-label={`Remove ${item.fileName ?? `image ${index + 1}`}`}
                  mix={[on("click", () => removeItem(item.id))]}
                >
                  Remove
                </button>
              ) : null}
            </li>
          ))}

          <li className="rf-image-uploader-item rf-image-uploader-add-wrap" data-hidden={canAdd ? "false" : "true"}>
            <label className="rf-image-uploader-add rf-focus-ring" data-disabled={canAdd ? "false" : "true"}>
              <input
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={!canAdd}
                className="rf-image-uploader-input"
                mix={[
                  on("change", (event) => {
                    const target = event.currentTarget
                    if (!(target instanceof HTMLInputElement)) return
                    handleSelectFiles(target)
                  }),
                ]}
              />
              <span className="rf-image-uploader-add-label">{resolveImageUploaderAddLabel(props.addLabel)}</span>
              <span className="rf-image-uploader-count" aria-hidden="true">
                {currentItems.length}/{maxCount}
              </span>
            </label>
          </li>
        </ul>
      </section>
    )
  }
}
