import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TreeNode = {
  id: string
  label: ComponentChildren
  children?: TreeNode[]
  disabled?: boolean
}

export type TreeProps = {
  nodes: TreeNode[]
  selectedId?: string
  defaultSelectedId?: string
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  onSelect?: (id: string) => void
  onExpandedChange?: (ids: string[]) => void
  ariaLabel?: string
}

export function flattenTreeNodeIds(nodes: TreeNode[]): string[] {
  const ids: string[] = []

  const visit = (nextNodes: TreeNode[]) => {
    for (const node of nextNodes) {
      ids.push(node.id)
      if (node.children && node.children.length > 0) visit(node.children)
    }
  }

  visit(nodes)
  return ids
}

export function resolveTreeSelectedId(nodes: TreeNode[], selectedId?: string): string | undefined {
  if (selectedId) return selectedId

  const allIds = flattenTreeNodeIds(nodes)
  return allIds[0]
}

export function toggleTreeExpanded(expandedIds: string[], id: string): string[] {
  if (expandedIds.includes(id)) return expandedIds.filter((entry) => entry !== id)
  return [...expandedIds, id]
}

export function Tree(handle: Handle) {
  let localSelectedId: string | undefined
  let localExpandedIds: string[] | undefined

  return (props: TreeProps) => {
    if (props.selectedId === undefined && localSelectedId === undefined) {
      localSelectedId = resolveTreeSelectedId(props.nodes, props.defaultSelectedId)
    }

    if (props.expandedIds === undefined && localExpandedIds === undefined) {
      localExpandedIds = props.defaultExpandedIds ?? []
    }

    const selectedId = props.selectedId ?? localSelectedId
    const expandedIds = props.expandedIds ?? localExpandedIds ?? []
    const expandedSet = new Set(expandedIds)

    const setSelectedId = (nextId: string) => {
      if (props.selectedId === undefined) {
        localSelectedId = nextId
        handle.update()
      }
      props.onSelect?.(nextId)
    }

    const setExpandedIds = (nextIds: string[]) => {
      if (props.expandedIds === undefined) {
        localExpandedIds = nextIds
        handle.update()
      }
      props.onExpandedChange?.(nextIds)
    }

    const renderNodes = (nodes: TreeNode[]): any[] => {
      return nodes.map((node) => {
        const hasChildren = !!(node.children && node.children.length > 0)
        const isExpanded = hasChildren && expandedSet.has(node.id)
        const isSelected = node.id === selectedId

        return (
          <li
            key={node.id}
            className="rf-tree-item"
            role="treeitem"
            aria-selected={isSelected ? "true" : "false"}
            aria-expanded={hasChildren ? (isExpanded ? "true" : "false") : undefined}
            data-selected={isSelected ? "true" : "false"}
            data-disabled={node.disabled ? "true" : "false"}
          >
            <div className="rf-tree-row">
              {hasChildren ? (
                <button
                  type="button"
                  className="rf-tree-toggle rf-focus-ring"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                  mix={[
                    on("click", () => {
                      if (node.disabled) return
                      setExpandedIds(toggleTreeExpanded(expandedIds, node.id))
                    }),
                  ]}
                >
                  {isExpanded ? "▾" : "▸"}
                </button>
              ) : (
                <span className="rf-tree-spacer" aria-hidden="true" />
              )}

              <button
                type="button"
                className="rf-tree-label rf-focus-ring"
                disabled={node.disabled}
                mix={[
                  on("click", () => {
                    if (node.disabled) return
                    setSelectedId(node.id)
                  }),
                ]}
              >
                {node.label}
              </button>
            </div>

            {hasChildren && isExpanded ? (
              <ul className="rf-tree-group" role="group">
                {renderNodes(node.children!)}
              </ul>
            ) : null}
          </li>
        )
      })
    }

    return (
      <ul className="rf-tree" role="tree" aria-label={props.ariaLabel ?? "Tree"}>
        {renderNodes(props.nodes)}
      </ul>
    )
  }
}
