import { on, type Handle } from "remix/component"
import { nextTableSort, sortTableRows, type TableSortDirection } from "@lukasmurdock/remix-ui-core"
import type { ComponentChildren } from "../types"

export type DataGridDirection = TableSortDirection

export type DataGridSort = {
  columnKey: string
  direction: DataGridDirection
}

export type DataGridColumn = {
  key: string
  header: ComponentChildren
  align?: "left" | "center" | "right"
  sortable?: boolean
}

export type DataGridRow = {
  key: string
  cells: Record<string, ComponentChildren>
  sortValues?: Record<string, string | number>
}

export type DataGridLiteProps = {
  columns: DataGridColumn[]
  rows: DataGridRow[]
  caption?: ComponentChildren
  /** @default false */
  loading?: boolean
  /** @default "No data" */
  emptyState?: ComponentChildren
  /** @default false */
  selectable?: boolean
  /** @default [] */
  selectedKeys?: string[]
  /** @default [] */
  defaultSelectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  sort?: DataGridSort
  defaultSort?: DataGridSort
  onSortChange?: (sort: DataGridSort | undefined) => void
}

export function nextSort(current: DataGridSort | undefined, columnKey: string): DataGridSort | undefined {
  return nextTableSort(current, columnKey)
}

export function sortRows(rows: DataGridRow[], sort: DataGridSort | undefined): DataGridRow[] {
  return sortTableRows(rows, sort, (row, columnKey) => {
    const sortValue = row.sortValues?.[columnKey]
    if (typeof sortValue === "string" || typeof sortValue === "number") {
      return sortValue
    }

    const cell = row.cells[columnKey]
    if (typeof cell === "string" || typeof cell === "number") {
      return cell
    }

    if (typeof cell === "boolean") {
      return String(cell)
    }

    return ""
  })
}

export function DataGridLite(handle: Handle) {
  let localSort: DataGridSort | undefined
  let localSelected = new Set<string>()

  function getSelected(props: DataGridLiteProps): Set<string> {
    if (props.selectedKeys) return new Set(props.selectedKeys)

    if (localSelected.size === 0 && props.defaultSelectedKeys) {
      localSelected = new Set(props.defaultSelectedKeys)
    }

    return new Set(localSelected)
  }

  function setSelected(props: DataGridLiteProps, next: Set<string>): void {
    if (props.selectedKeys === undefined) {
      localSelected = new Set(next)
      handle.update()
    }
    props.onSelectionChange?.([...next])
  }

  return (props: DataGridLiteProps) => {
    const sort = props.sort ?? localSort ?? props.defaultSort
    const selected = getSelected(props)
    const rows = sortRows(props.rows, sort)
    const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.key))

    if (props.loading) {
      return <section className="rf-data-grid-loading">Loading…</section>
    }

    return (
      <div className="rf-data-grid-wrap" role="region" aria-label="Data grid">
        <table className="rf-data-grid">
          {props.caption ? <caption>{props.caption}</caption> : null}
          <thead>
            <tr>
              {props.selectable ? (
                <th scope="col" className="rf-data-grid-select-col">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allSelected}
                    mix={[
                      on("change", (event) => {
                        const checked = (event.currentTarget as HTMLInputElement).checked
                        const next = new Set<string>()
                        if (checked) {
                          for (const row of rows) next.add(row.key)
                        }
                        setSelected(props, next)
                      }),
                    ]}
                  />
                </th>
              ) : null}

              {props.columns.map((column) => {
                const isSorted = sort?.columnKey === column.key
                const ariaSort = isSorted ? (sort?.direction === "asc" ? "ascending" : "descending") : "none"

                return (
                  <th key={column.key} scope="col" data-align={column.align ?? "left"} aria-sort={ariaSort}>
                    {column.sortable ? (
                      <button
                        type="button"
                        className="rf-data-grid-sort rf-focus-ring"
                        mix={[
                          on("click", () => {
                            const next = nextSort(sort, column.key)
                            if (props.sort === undefined) {
                              localSort = next
                              handle.update()
                            }
                            props.onSortChange?.(next)
                          }),
                        ]}
                      >
                        <span>{column.header}</span>
                        <span className="rf-data-grid-sort-indicator" aria-hidden="true">
                          {isSorted ? (sort?.direction === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </button>
                    ) : (
                      <span>{column.header}</span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={props.columns.length + (props.selectable ? 1 : 0)} className="rf-data-grid-empty">
                  {props.emptyState ?? "No data"}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.key} data-selected={selected.has(row.key) ? "true" : "false"}>
                  {props.selectable ? (
                    <td className="rf-data-grid-select-col">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${row.key}`}
                        checked={selected.has(row.key)}
                        mix={[
                          on("change", (event) => {
                            const checked = (event.currentTarget as HTMLInputElement).checked
                            const next = new Set(selected)
                            if (checked) next.add(row.key)
                            else next.delete(row.key)
                            setSelected(props, next)
                          }),
                        ]}
                      />
                    </td>
                  ) : null}

                  {props.columns.map((column) => (
                    <td key={`${row.key}-${column.key}`} data-align={column.align ?? "left"}>
                      {row.cells[column.key] ?? null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )
  }
}
