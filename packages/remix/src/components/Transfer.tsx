import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TransferDirection = "left" | "right"

export type TransferItem = {
  key: string
  label: ComponentChildren
  description?: ComponentChildren
  disabled?: boolean
}

export type TransferProps = {
  items: TransferItem[]
  targetKeys?: string[]
  defaultTargetKeys?: string[]
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  onChange?: (targetKeys: string[]) => void
  onSelectChange?: (selectedKeys: string[]) => void
  leftTitle?: ComponentChildren
  rightTitle?: ComponentChildren
  emptyState?: ComponentChildren
}

export function resolveTransferTargetKeys(items: TransferItem[], targetKeys?: string[]): string[] {
  if (!targetKeys || targetKeys.length === 0) return []
  const available = new Set(items.map((item) => item.key))
  const unique = new Set<string>()

  for (const key of targetKeys) {
    if (!available.has(key)) continue
    unique.add(key)
  }

  return [...unique]
}

export function resolveTransferSelectedKeys(items: TransferItem[], selectedKeys?: string[]): string[] {
  if (!selectedKeys || selectedKeys.length === 0) return []
  const available = new Set(items.map((item) => item.key))
  const unique = new Set<string>()

  for (const key of selectedKeys) {
    if (!available.has(key)) continue
    unique.add(key)
  }

  return [...unique]
}

export function partitionTransferItems(items: TransferItem[], targetKeys: string[]): {
  sourceItems: TransferItem[]
  targetItems: TransferItem[]
} {
  const targetSet = new Set(targetKeys)
  const sourceItems: TransferItem[] = []
  const targetItems: TransferItem[] = []

  for (const item of items) {
    if (targetSet.has(item.key)) targetItems.push(item)
    else sourceItems.push(item)
  }

  return { sourceItems, targetItems }
}

export function resolveTransferMoveKeys(
  items: TransferItem[],
  selectedKeys: string[],
  targetKeys: string[],
  direction: TransferDirection,
): string[] {
  const selectedSet = new Set(selectedKeys)
  const targetSet = new Set(targetKeys)
  const moveKeys: string[] = []

  for (const item of items) {
    if (item.disabled || !selectedSet.has(item.key)) continue
    const inTarget = targetSet.has(item.key)
    if (direction === "right" && !inTarget) moveKeys.push(item.key)
    if (direction === "left" && inTarget) moveKeys.push(item.key)
  }

  return moveKeys
}

export function moveTransferKeys(
  currentTargetKeys: string[],
  moveKeys: string[],
  direction: TransferDirection,
): string[] {
  if (moveKeys.length === 0) return currentTargetKeys
  const moveSet = new Set(moveKeys)

  if (direction === "left") {
    return currentTargetKeys.filter((key) => !moveSet.has(key))
  }

  const next = [...currentTargetKeys]
  const currentSet = new Set(currentTargetKeys)
  for (const key of moveKeys) {
    if (currentSet.has(key)) continue
    next.push(key)
  }
  return next
}

export function Transfer(handle: Handle) {
  let localTargetKeys: string[] | undefined
  let localSelectedKeys: string[] | undefined

  return (props: TransferProps) => {
    if (props.targetKeys === undefined && localTargetKeys === undefined) {
      localTargetKeys = resolveTransferTargetKeys(props.items, props.defaultTargetKeys)
    }

    if (props.selectedKeys === undefined && localSelectedKeys === undefined) {
      localSelectedKeys = resolveTransferSelectedKeys(props.items, props.defaultSelectedKeys)
    }

    const targetKeys = props.targetKeys ?? localTargetKeys ?? []
    const selectedKeys = props.selectedKeys ?? localSelectedKeys ?? []
    const { sourceItems, targetItems } = partitionTransferItems(props.items, targetKeys)

    const setTargetKeys = (nextTargetKeys: string[]) => {
      const resolved = resolveTransferTargetKeys(props.items, nextTargetKeys)
      if (props.targetKeys === undefined) {
        localTargetKeys = resolved
        handle.update()
      }
      props.onChange?.(resolved)
    }

    const setSelectedKeys = (nextSelectedKeys: string[]) => {
      const resolved = resolveTransferSelectedKeys(props.items, nextSelectedKeys)
      if (props.selectedKeys === undefined) {
        localSelectedKeys = resolved
        handle.update()
      }
      props.onSelectChange?.(resolved)
    }

    const selectedSet = new Set(selectedKeys)
    const sourceSelectedCount = sourceItems.filter((item) => selectedSet.has(item.key) && !item.disabled).length
    const targetSelectedCount = targetItems.filter((item) => selectedSet.has(item.key) && !item.disabled).length

    const toggleSelection = (item: TransferItem) => {
      if (item.disabled) return
      if (selectedSet.has(item.key)) {
        setSelectedKeys(selectedKeys.filter((key) => key !== item.key))
      } else {
        setSelectedKeys([...selectedKeys, item.key])
      }
    }

    const move = (direction: TransferDirection) => {
      const moveKeys = resolveTransferMoveKeys(props.items, selectedKeys, targetKeys, direction)
      if (moveKeys.length === 0) return

      setTargetKeys(moveTransferKeys(targetKeys, moveKeys, direction))
      setSelectedKeys(selectedKeys.filter((key) => !moveKeys.includes(key)))
    }

    const renderList = (items: TransferItem[]) => {
      if (items.length === 0) {
        return <li className="rf-transfer-empty">{props.emptyState ?? "No items"}</li>
      }

      return items.map((item) => {
        const checked = selectedSet.has(item.key)
        return (
          <li key={item.key} className="rf-transfer-item" data-disabled={item.disabled ? "true" : "false"}>
            <label className="rf-transfer-item-label">
              <input
                className="rf-transfer-item-check"
                type="checkbox"
                checked={checked}
                disabled={item.disabled}
                aria-label={`Select ${item.key}`}
                mix={[
                  on("change", () => {
                    toggleSelection(item)
                  }),
                ]}
              />
              <span className="rf-transfer-item-text">
                <span className="rf-transfer-item-title">{item.label}</span>
                {item.description ? <span className="rf-transfer-item-description">{item.description}</span> : null}
              </span>
            </label>
          </li>
        )
      })
    }

    return (
      <section className="rf-transfer">
        <div className="rf-transfer-panel" data-side="left">
          <header className="rf-transfer-panel-header">
            <strong>{props.leftTitle ?? "Available"}</strong>
            <span>{sourceItems.length}</span>
          </header>
          <ul className="rf-transfer-list">{renderList(sourceItems)}</ul>
        </div>

        <div className="rf-transfer-ops" aria-label="Transfer actions">
          <button
            className="rf-button"
            type="button"
            disabled={sourceSelectedCount === 0}
            mix={[on("click", () => move("right"))]}
          >
            &gt;
          </button>
          <button
            className="rf-button"
            type="button"
            disabled={targetSelectedCount === 0}
            mix={[on("click", () => move("left"))]}
          >
            &lt;
          </button>
        </div>

        <div className="rf-transfer-panel" data-side="right">
          <header className="rf-transfer-panel-header">
            <strong>{props.rightTitle ?? "Selected"}</strong>
            <span>{targetItems.length}</span>
          </header>
          <ul className="rf-transfer-list">{renderList(targetItems)}</ul>
        </div>
      </section>
    )
  }
}
