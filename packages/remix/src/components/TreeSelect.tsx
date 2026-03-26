import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TreeSelectNode = {
  id: string
  label: ComponentChildren
  children?: TreeSelectNode[]
  disabled?: boolean
}

export type TreeSelectProps = {
  options: TreeSelectNode[]
  value?: string
  defaultValue?: string
  open?: boolean
  defaultOpen?: boolean
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  placeholder?: ComponentChildren
  emptyState?: ComponentChildren
  onChange?: (id: string) => void
  onOpenChange?: (open: boolean) => void
  onExpandedChange?: (ids: string[]) => void
  ariaLabel?: string
}

export function flattenTreeSelectIds(nodes: TreeSelectNode[]): string[] {
  const ids: string[] = []

  const visit = (nextNodes: TreeSelectNode[]) => {
    for (const node of nextNodes) {
      ids.push(node.id)
      if (node.children && node.children.length > 0) visit(node.children)
    }
  }

  visit(nodes)
  return ids
}

export function resolveTreeSelectValue(nodes: TreeSelectNode[], value?: string): string | undefined {
  if (value) return value
  return flattenTreeSelectIds(nodes)[0]
}

export function toggleTreeSelectExpanded(expandedIds: string[], id: string): string[] {
  if (expandedIds.includes(id)) return expandedIds.filter((entry) => entry !== id)
  return [...expandedIds, id]
}

export function resolveTreeSelectLabel(
  nodes: TreeSelectNode[],
  selectedId: string | undefined,
  placeholder: ComponentChildren,
): ComponentChildren {
  if (!selectedId) return placeholder

  const stack = [...nodes]
  while (stack.length > 0) {
    const node = stack.shift()!
    if (node.id === selectedId) return node.label
    if (node.children && node.children.length > 0) stack.unshift(...node.children)
  }

  return placeholder
}

export function TreeSelect(handle: Handle) {
  let localValue: string | undefined
  let localOpen: boolean | undefined
  let localExpandedIds: string[] | undefined

  return (props: TreeSelectProps) => {
    if (props.value === undefined && localValue === undefined) {
      localValue = resolveTreeSelectValue(props.options, props.defaultValue)
    }

    if (props.open === undefined && localOpen === undefined) {
      localOpen = props.defaultOpen ?? false
    }

    if (props.expandedIds === undefined && localExpandedIds === undefined) {
      localExpandedIds = props.defaultExpandedIds ?? []
    }

    const selectedId = props.value ?? localValue
    const open = props.open ?? localOpen ?? false
    const expandedIds = props.expandedIds ?? localExpandedIds ?? []
    const expandedSet = new Set(expandedIds)
    const placeholder = props.placeholder ?? "Select"

    const setOpen = (next: boolean) => {
      if (props.open === undefined) {
        localOpen = next
        handle.update()
      }
      props.onOpenChange?.(next)
    }

    const setValue = (next: string) => {
      if (props.value === undefined) {
        localValue = next
        handle.update()
      }
      props.onChange?.(next)
    }

    const setExpandedIds = (nextIds: string[]) => {
      if (props.expandedIds === undefined) {
        localExpandedIds = nextIds
        handle.update()
      }
      props.onExpandedChange?.(nextIds)
    }

    const renderNodes = (nodes: TreeSelectNode[]): any[] => {
      return nodes.map((node) => {
        const hasChildren = !!(node.children && node.children.length > 0)
        const isExpanded = hasChildren && expandedSet.has(node.id)
        const isSelected = selectedId === node.id

        return (
          <li
            key={node.id}
            className="rf-tree-select-item"
            role="treeitem"
            aria-selected={isSelected ? "true" : "false"}
            aria-expanded={hasChildren ? (isExpanded ? "true" : "false") : undefined}
            data-selected={isSelected ? "true" : "false"}
            data-disabled={node.disabled ? "true" : "false"}
          >
            <div className="rf-tree-select-row">
              {hasChildren ? (
                <button
                  type="button"
                  className="rf-tree-select-toggle rf-focus-ring"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                  mix={[
                    on("click", () => {
                      if (node.disabled) return
                      setExpandedIds(toggleTreeSelectExpanded(expandedIds, node.id))
                    }),
                  ]}
                >
                  {isExpanded ? "▾" : "▸"}
                </button>
              ) : (
                <span className="rf-tree-select-spacer" aria-hidden="true" />
              )}

              <button
                type="button"
                className="rf-tree-select-option rf-focus-ring"
                disabled={node.disabled}
                mix={[
                  on("click", () => {
                    if (node.disabled) return
                    setValue(node.id)
                    setOpen(false)
                  }),
                ]}
              >
                {node.label}
              </button>
            </div>

            {hasChildren && isExpanded ? (
              <ul className="rf-tree-select-group" role="group">
                {renderNodes(node.children!)}
              </ul>
            ) : null}
          </li>
        )
      })
    }

    return (
      <section className="rf-tree-select" data-open={open ? "true" : "false"}>
        <button
          type="button"
          className="rf-tree-select-trigger rf-focus-ring"
          aria-haspopup="tree"
          aria-expanded={open ? "true" : "false"}
          aria-label={props.ariaLabel ?? "Tree select"}
          mix={[on("click", () => setOpen(!open))]}
        >
          <span className="rf-tree-select-trigger-label">{resolveTreeSelectLabel(props.options, selectedId, placeholder)}</span>
          <span className="rf-tree-select-trigger-icon" aria-hidden="true">
            {open ? "▴" : "▾"}
          </span>
        </button>

        {open ? (
          <div className="rf-tree-select-panel" role="listbox">
            {props.options.length === 0 ? (
              <p className="rf-tree-select-empty">{props.emptyState ?? "No options"}</p>
            ) : (
              <ul className="rf-tree-select-tree" role="tree">
                {renderNodes(props.options)}
              </ul>
            )}
          </div>
        ) : null}
      </section>
    )
  }
}
