import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import { normalizeFileUploadAccept } from "./FileUpload"
import { ImageViewer, type ImageViewerImage } from "./ImageViewer"

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

export type ImageUploaderUploadTaskStatus = "pending" | "success" | "fail"

export type ImageUploaderUploadTask = {
  itemId: string
  fileName: string
  status: ImageUploaderUploadTaskStatus
  error?: unknown
}

export type ImageUploaderProps = {
  value?: readonly ImageUploaderValueItem[]
  /** @default [] */
  defaultValue?: readonly ImageUploaderValueItem[]
  onChange?: (items: readonly ImageUploaderValueItem[]) => void
  upload?: (file: File) => ImageUploaderUploadResult | Promise<ImageUploaderUploadResult>
  /** Return null to skip a file. Return undefined to keep the original file. */
  beforeUpload?: (file: File, files: readonly File[]) => File | null | undefined | Promise<File | null | undefined>
  onUploadError?: (error: unknown, file: File) => void
  onUploadQueueChange?: (tasks: readonly ImageUploaderUploadTask[]) => void
  onCountExceed?: (exceed: number) => void
  /** @default 9 */
  maxCount?: number
  /** @default true (unless maxCount is 1) */
  multiple?: boolean
  /** @default "image/*" */
  accept?: string[] | string
  /** @default true */
  showUpload?: boolean
  /** @default false */
  disableUpload?: boolean
  disabled?: boolean
  /** @default true */
  preview?: boolean
  onPreview?: (index: number, item: ImageUploaderValueItem) => void
  onDelete?: (item: ImageUploaderValueItem, index: number) => boolean | void | Promise<boolean | void>
  /** @default true */
  showFailed?: boolean
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

export function resolveImageUploaderPreview(value?: boolean): boolean {
  return value ?? true
}

export function resolveImageUploaderShowFailed(value?: boolean): boolean {
  return value ?? true
}

export function resolveImageUploaderShowUpload(value?: boolean): boolean {
  return value ?? true
}

export function resolveImageUploaderDisableUpload(value?: boolean): boolean {
  return value ?? false
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

export function limitImageUploaderItemsByActiveCount(
  items: readonly ImageUploaderValueItem[],
  maxCount: number,
  showFailed: boolean,
): ImageUploaderValueItem[] {
  if (showFailed) {
    return limitImageUploaderItems(items, maxCount)
  }

  const nextItems: ImageUploaderValueItem[] = []
  let activeCount = 0

  for (const item of items) {
    if (item.error) {
      nextItems.push(item)
      continue
    }

    if (activeCount >= maxCount) {
      continue
    }

    nextItems.push(item)
    activeCount += 1
  }

  return nextItems
}

export function countImageUploaderActiveItems(items: readonly ImageUploaderValueItem[], showFailed: boolean): number {
  if (showFailed) return items.length
  return items.filter((item) => !item.error).length
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
  let previewOpen = false
  let previewIndex = 0
  const objectUrlById = new Map<string, string>()
  const sourceFileById = new Map<string, File>()
  const uploadTaskById = new Map<string, ImageUploaderUploadTask>()

  const emitUploadQueueChange = (props: ImageUploaderProps) => {
    props.onUploadQueueChange?.([...uploadTaskById.values()])
  }

  const pruneTransientStateForItems = (items: readonly ImageUploaderValueItem[]) => {
    const activeIds = new Set(items.map((item) => item.id))

    for (const [itemId] of sourceFileById) {
      if (activeIds.has(itemId)) continue
      sourceFileById.delete(itemId)
    }

    let queueChanged = false
    for (const [itemId] of uploadTaskById) {
      if (activeIds.has(itemId)) continue
      uploadTaskById.delete(itemId)
      queueChanged = true
    }

    return queueChanged
  }

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
    sourceFileById.clear()
    uploadTaskById.clear()
    shadowItems = []
    localItems = undefined
    lastControlledValue = undefined
    previewOpen = false
    previewIndex = 0
  })

  return (props: ImageUploaderProps) => {
    const maxCount = resolveImageUploaderMaxCount(props.maxCount)
    const multiple = resolveImageUploaderMultiple(props.multiple, maxCount)
    const deletable = resolveImageUploaderDeletable(props.deletable)
    const preview = resolveImageUploaderPreview(props.preview)
    const showFailed = resolveImageUploaderShowFailed(props.showFailed)
    const showUpload = resolveImageUploaderShowUpload(props.showUpload)
    const disableUpload = resolveImageUploaderDisableUpload(props.disableUpload)
    const accept = resolveImageUploaderAccept(props.accept)
    const disabled = props.disabled ?? false
    const uploadsDisabled = disabled || disableUpload

    if (props.value !== undefined) {
      if (!hasShadow || props.value !== lastControlledValue) {
        shadowItems = limitImageUploaderItemsByActiveCount(props.value, maxCount, showFailed)
        hasShadow = true
        lastControlledValue = props.value
      }
    } else {
      if (!hasShadow) {
        shadowItems = limitImageUploaderItemsByActiveCount(props.defaultValue ?? [], maxCount, showFailed)
        hasShadow = true
      }
      localItems = limitImageUploaderItemsByActiveCount(localItems ?? shadowItems, maxCount, showFailed)
      shadowItems = localItems
      lastControlledValue = undefined
    }

    const currentItems = shadowItems
    revokeMissingObjectUrls(currentItems)
    if (pruneTransientStateForItems(currentItems)) {
      handle.queueTask(() => {
        if (disposed) return
        emitUploadQueueChange(props)
      })
    }

    const setItems = (nextItems: readonly ImageUploaderValueItem[]) => {
      const normalized = limitImageUploaderItemsByActiveCount(nextItems, maxCount, showFailed)
      revokeMissingObjectUrls(normalized)
      pruneTransientStateForItems(normalized)

      shadowItems = normalized

      if (props.value === undefined) {
        localItems = normalized
      }

      handle.update()
      props.onChange?.(normalized)
      emitUploadQueueChange(props)
    }

    const updateItemById = (itemId: string, patch: Partial<ImageUploaderValueItem>) => {
      const latestItems = limitImageUploaderItemsByActiveCount(shadowItems, maxCount, showFailed)
      const nextItems = latestItems.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
      setItems(nextItems)
    }

    const removeItem = (itemId: string) => {
      const latestItems = limitImageUploaderItemsByActiveCount(shadowItems, maxCount, showFailed)
      const nextItems = latestItems.filter((item) => item.id !== itemId)
      revokeObjectUrl(itemId)
      sourceFileById.delete(itemId)
      uploadTaskById.delete(itemId)
      setItems(nextItems)
    }

    const requestRemoveItem = (item: ImageUploaderValueItem, index: number) => {
      if (disabled) return

      Promise.resolve(props.onDelete?.(item, index) ?? true)
        .then((allowed) => {
          if (disposed || allowed === false) return
          removeItem(item.id)
        })
        .catch(() => {
          // ignore delete callback errors to keep UI responsive
        })
    }

    const startUpload = (file: File, created: ImageUploaderValueItem) => {
      if (!props.upload) return

      uploadTaskById.set(created.id, {
        itemId: created.id,
        fileName: created.fileName ?? file.name,
        status: "pending",
      })
      emitUploadQueueChange(props)

      Promise.resolve()
        .then(() => props.upload?.(file))
        .then((result) => {
          if (disposed) return
          if (result == null) {
            throw new Error("Image uploader upload() returned no result")
          }

          const previousObjectUrl = objectUrlById.get(created.id)
          const uploadResult = resolveImageUploaderUploadResult(result, {
            alt: file.name,
            fileName: file.name,
          })

          if (previousObjectUrl && uploadResult.src !== previousObjectUrl) {
            revokeObjectUrl(created.id)
          }

          sourceFileById.delete(created.id)
          uploadTaskById.set(created.id, {
            itemId: created.id,
            fileName: uploadResult.fileName,
            status: "success",
          })

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

          uploadTaskById.set(created.id, {
            itemId: created.id,
            fileName: created.fileName ?? file.name,
            status: "fail",
            error,
          })
          updateItemById(created.id, {
            uploading: false,
            error: true,
          })

          props.onUploadError?.(error, file)
        })
    }

    const retryItemUpload = (itemId: string) => {
      if (!props.upload || uploadsDisabled) return
      if (uploadTaskById.get(itemId)?.status === "pending") return

      const file = sourceFileById.get(itemId)
      if (!file) return

      const latestItems = limitImageUploaderItemsByActiveCount(shadowItems, maxCount, showFailed)
      const target = latestItems.find((item) => item.id === itemId)
      if (!target) return

      if (!showFailed && target.error) {
        const activeCount = countImageUploaderActiveItems(latestItems, showFailed)
        if (activeCount >= maxCount) return
      }

      updateItemById(itemId, {
        uploading: true,
        error: false,
      })

      startUpload(file, target)
    }

    const handleSelectFiles = async (input: HTMLInputElement) => {
      if (uploadsDisabled) return

      try {
        const files = input.files ? Array.from(input.files) : []
        if (files.length === 0) return

        const acceptedFiles: File[] = []

        for (const originalFile of files) {
          if (disposed) return

          let nextFile: File | null | undefined
          try {
            nextFile = await Promise.resolve(
              props.beforeUpload ? props.beforeUpload(originalFile, files) : originalFile,
            )
          } catch (error) {
            props.onUploadError?.(error, originalFile)
            continue
          }

          if (nextFile === null) {
            continue
          }

          const file = nextFile instanceof File ? nextFile : originalFile
          acceptedFiles.push(file)
        }

        const normalizedEntries: Array<{ file: File; created: ImageUploaderValueItem }> = []

        for (const file of acceptedFiles) {
          const id = `${handle.id}-image-${Date.now()}-${itemSequence}`
          itemSequence += 1

          let previewUrl = ""
          if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
            previewUrl = URL.createObjectURL(file)
            objectUrlById.set(id, previewUrl)
          }

          const created = {
            id,
            src: previewUrl,
            alt: file.name,
            fileName: file.name,
            uploading: props.upload ? true : false,
            error: false,
          } satisfies ImageUploaderValueItem

          if (props.upload) {
            sourceFileById.set(id, file)
          }
          normalizedEntries.push({ file, created })
        }

        if (normalizedEntries.length === 0) {
          return
        }

        const latestItemsForAppend = limitImageUploaderItemsByActiveCount(shadowItems, maxCount, showFailed)
        const latestAppendBase = latestItemsForAppend
        const finalRemaining = Math.max(0, maxCount - countImageUploaderActiveItems(latestAppendBase, showFailed))
        const committedEntries = normalizedEntries.slice(0, finalRemaining)

        const commitExceed = Math.max(0, normalizedEntries.length - committedEntries.length)
        if (commitExceed > 0) {
          props.onCountExceed?.(commitExceed)
        }

        if (committedEntries.length === 0) {
          return
        }

        const createdItems = committedEntries.map((entry) => entry.created)
        const nextItems = [...latestAppendBase, ...createdItems]
        setItems(nextItems)

        if (props.upload) {
          for (const entry of committedEntries) {
            startUpload(entry.file, entry.created)
          }
        } else {
          uploadTaskById.clear()
          emitUploadQueueChange(props)
        }
      } finally {
        input.value = ""
      }
    }

    const activeCount = countImageUploaderActiveItems(currentItems, showFailed)
    const renderedItems = showFailed ? currentItems : currentItems.filter((item) => !item.error)
    const previewableItems = renderedItems.filter((item) => item.src)
    const previewImages = previewableItems.map(
      (item, index) =>
        ({
          src: item.src,
          alt: item.alt ?? item.fileName ?? `Uploaded image ${index + 1}`,
        }) satisfies ImageViewerImage,
    )

    if (!preview || previewableItems.length === 0) {
      previewOpen = false
      previewIndex = 0
    } else {
      previewIndex = Math.min(previewIndex, previewableItems.length - 1)
    }

    const canAdd = !uploadsDisabled && activeCount < maxCount
    const showAddTile = showUpload && (canAdd || uploadsDisabled)

    const openPreview = (index: number, item: ImageUploaderValueItem) => {
      props.onPreview?.(index, item)
      if (!preview || disabled) return

      const nextIndex = previewableItems.findIndex((entry) => entry.id === item.id)
      if (nextIndex < 0) return

      previewIndex = nextIndex
      previewOpen = true
      handle.update()
    }

    const closePreview = () => {
      if (!previewOpen) return
      previewOpen = false
      handle.update()
    }

    return (
      <section className="rf-image-uploader" aria-label={props.ariaLabel ?? "Image uploader"}>
        <ul className="rf-image-uploader-list" role="list">
          {renderedItems.map((item, index) => (
            <li
              key={item.id}
              className="rf-image-uploader-item"
              data-item-id={item.id}
              data-uploading={item.uploading ? "true" : "false"}
              data-error={item.error ? "true" : "false"}
            >
              <figure className="rf-image-uploader-thumb">
                {item.src ? (
                  preview ? (
                    <button
                      type="button"
                      className="rf-image-uploader-preview rf-focus-ring"
                      disabled={disabled}
                      aria-label={`Preview ${item.fileName ?? `image ${index + 1}`}`}
                      mix={[on("click", () => openPreview(index, item))]}
                    >
                      <img
                        className="rf-image-uploader-image"
                        src={item.src}
                        alt={item.alt ?? `Uploaded image ${index + 1}`}
                      />
                    </button>
                  ) : (
                    <img
                      className="rf-image-uploader-image"
                      src={item.src}
                      alt={item.alt ?? `Uploaded image ${index + 1}`}
                    />
                  )
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
                  data-variant="danger"
                  disabled={disabled}
                  aria-label={`Remove ${item.fileName ?? `image ${index + 1}`}`}
                  mix={[on("click", () => requestRemoveItem(item, index))]}
                >
                  Remove
                </button>
              ) : null}

              {item.error && props.upload ? (
                <button
                  type="button"
                  className="rf-image-uploader-remove rf-focus-ring"
                  data-variant="neutral"
                  disabled={uploadsDisabled || !sourceFileById.has(item.id)}
                  aria-label={`Retry ${item.fileName ?? `image ${index + 1}`}`}
                  mix={[on("click", () => retryItemUpload(item.id))]}
                >
                  Retry
                </button>
              ) : null}
            </li>
          ))}

          {showAddTile ? (
            <li className="rf-image-uploader-item rf-image-uploader-add-wrap" data-hidden="false">
              <label className="rf-image-uploader-add rf-focus-ring" data-disabled={canAdd ? "false" : "true"}>
                <input
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  disabled={!canAdd}
                  className="rf-image-uploader-input"
                  aria-label="Choose images to upload"
                  mix={[
                    on("change", (event) => {
                      const target = event.currentTarget
                      if (!(target instanceof HTMLInputElement)) return
                      void handleSelectFiles(target)
                    }),
                  ]}
                />
                <span className="rf-image-uploader-add-icon" aria-hidden="true">
                  +
                </span>
                <span className="rf-image-uploader-add-label">{resolveImageUploaderAddLabel(props.addLabel)}</span>
                <span className="rf-image-uploader-count" aria-hidden="true">
                  {activeCount}/{maxCount}
                </span>
              </label>
            </li>
          ) : null}
        </ul>

        <ImageViewer
          open={previewOpen}
          images={previewImages}
          defaultIndex={previewIndex}
          onIndexChange={(next) => {
            previewIndex = next
          }}
          onClose={() => {
            closePreview()
          }}
          dismissOnBackdrop
          dismissOnEscape
          loop={false}
          ariaLabel="Image uploader preview"
        />
      </section>
    )
  }
}
