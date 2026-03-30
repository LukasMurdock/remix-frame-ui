import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import { nextSort, sortRows, type DataGridSort } from "./DataGridLite"

export type DataTableColumn = {
  key: string
  header: ComponentChildren
  align?: "left" | "center" | "right"
  sortable?: boolean
}

export type DataTableRow = {
  key: string
  cells: Record<string, ComponentChildren>
  sortValues?: Record<string, string | number>
}

export type DataTableDataMode = "client" | "server"

export type DataTableProps = {
  columns: DataTableColumn[]
  rows: DataTableRow[]
  /** @default "client" */
  dataMode?: DataTableDataMode
  /** Total row count for server-backed tables */
  totalRows?: number
  rowFilter?: DataTableRowFilter
  /** Client-side contains filter query */
  filterText?: string
  /** @default all column keys */
  filterColumnKeys?: string[]
  caption?: ComponentChildren
  /** @default false */
  loading?: boolean
  errorState?: ComponentChildren
  /** @default "No rows" */
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
  /** @default 1 */
  page?: number
  /** @default 1 */
  defaultPage?: number
  onPageChange?: (page: number) => void
  /** @default 10 */
  pageSize?: number
}

export type DataTableRowFilter = (row: DataTableRow) => boolean

export function resolveDataTablePageSize(pageSize?: number): number {
  if (pageSize === undefined) return 10
  return Math.max(1, Math.floor(pageSize))
}

export function resolveDataTableTotalPages(rowCount: number, pageSize: number): number {
  if (rowCount <= 0) return 1
  return Math.max(1, Math.ceil(rowCount / pageSize))
}

export function clampDataTablePage(page: number | undefined, totalPages: number): number {
  const next = page ?? 1
  if (next < 1) return 1
  if (next > totalPages) return totalPages
  return next
}

export function paginateDataTableRows(rows: DataTableRow[], page: number, pageSize: number): DataTableRow[] {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}

export function filterDataTableRows(rows: DataTableRow[], rowFilter?: DataTableRowFilter): DataTableRow[] {
  if (!rowFilter) return rows
  return rows.filter((row) => rowFilter(row))
}

export function resolveDataTableDataMode(dataMode?: DataTableDataMode): DataTableDataMode {
  return dataMode ?? "client"
}

export function resolveDataTableRowCount(
  dataMode: DataTableDataMode,
  rows: DataTableRow[],
  totalRows?: number,
): number {
  if (dataMode === "server") {
    if (totalRows === undefined) return rows.length
    return Math.max(0, Math.floor(totalRows))
  }

  return rows.length
}

export function resolveDataTableFilter(
  props: Pick<DataTableProps, "columns" | "rowFilter" | "filterText" | "filterColumnKeys">,
): DataTableRowFilter | undefined {
  const filterColumnKeys = props.filterColumnKeys ?? props.columns.map((column) => column.key)
  const textFilter = createDataTableContainsFilter(filterColumnKeys, props.filterText)
  return composeDataTableRowFilter(props.rowFilter, textFilter)
}

export function composeDataTableRowFilter(
  ...filters: Array<DataTableRowFilter | undefined>
): DataTableRowFilter | undefined {
  const active = filters.filter((filter): filter is DataTableRowFilter => filter !== undefined)
  if (active.length === 0) return undefined
  if (active.length === 1) return active[0]
  return (row) => active.every((filter) => filter(row))
}

export function resolveDataTableCellText(row: DataTableRow, columnKey: string): string {
  const sortValue = row.sortValues?.[columnKey]
  if (typeof sortValue === "string" || typeof sortValue === "number") {
    return String(sortValue)
  }

  const cell = row.cells[columnKey]
  if (typeof cell === "string" || typeof cell === "number" || typeof cell === "boolean") {
    return String(cell)
  }

  return ""
}

export function createDataTableContainsFilter(
  columnKeys: string[],
  query: string | undefined,
): DataTableRowFilter | undefined {
  const normalizedQuery = query?.trim().toLowerCase() ?? ""
  if (normalizedQuery === "" || columnKeys.length === 0) return undefined

  return (row) =>
    columnKeys.some((columnKey) => resolveDataTableCellText(row, columnKey).toLowerCase().includes(normalizedQuery))
}

export function createDataTableEqualsFilter(
  columnKey: string,
  value: string | number | undefined,
  allValue?: string | number,
): DataTableRowFilter | undefined {
  if (value === undefined) return undefined
  const expected = String(value).toLowerCase()
  if (allValue !== undefined && expected === String(allValue).toLowerCase()) return undefined
  return (row) => resolveDataTableCellText(row, columnKey).toLowerCase() === expected
}

export function DataTable(handle: Handle) {
  let localSort: DataGridSort | undefined
  let localSelected = new Set<string>()
  let localPage: number | undefined

  function getSelected(props: DataTableProps): Set<string> {
    if (props.selectedKeys) return new Set(props.selectedKeys)

    if (localSelected.size === 0 && props.defaultSelectedKeys) {
      localSelected = new Set(props.defaultSelectedKeys)
    }

    return new Set(localSelected)
  }

  function setSelected(props: DataTableProps, next: Set<string>): void {
    if (props.selectedKeys === undefined) {
      localSelected = new Set(next)
      handle.update()
    }
    props.onSelectionChange?.([...next])
  }

  function setPage(props: DataTableProps, nextPage: number): void {
    if (props.page === undefined) {
      localPage = nextPage
      handle.update()
    }
    props.onPageChange?.(nextPage)
  }

  return (props: DataTableProps) => {
    const dataMode = resolveDataTableDataMode(props.dataMode)
    const isServer = dataMode === "server"
    const sort = props.sort ?? localSort ?? props.defaultSort
    const tableFilter = resolveDataTableFilter(props)
    const filteredRows = isServer ? props.rows : filterDataTableRows(props.rows, tableFilter)
    const sortedRows = isServer ? filteredRows : sortRows(filteredRows, sort)

    const pageSize = resolveDataTablePageSize(props.pageSize)
    const totalRows = resolveDataTableRowCount(dataMode, sortedRows, props.totalRows)
    const totalPages = resolveDataTableTotalPages(totalRows, pageSize)
    const page = clampDataTablePage(props.page ?? localPage ?? props.defaultPage, totalPages)
    const pageRows = isServer ? sortedRows : paginateDataTableRows(sortedRows, page, pageSize)

    const selected = getSelected(props)
    const allPageRowsSelected = pageRows.length > 0 && pageRows.every((row) => selected.has(row.key))

    if (props.loading) {
      return <section className="rf-data-table-loading">Loading…</section>
    }

    if (props.errorState) {
      return <section className="rf-data-table-error">{props.errorState}</section>
    }

    return (
      <section className="rf-data-table-wrap" role="region" aria-label="Data table">
        <table className="rf-data-table">
          {props.caption ? <caption>{props.caption}</caption> : null}
          <thead>
            <tr>
              {props.selectable ? (
                <th scope="col" className="rf-data-table-select-col">
                  <input
                    type="checkbox"
                    aria-label="Select visible rows"
                    checked={allPageRowsSelected}
                    mix={[
                      on("change", (event) => {
                        const checked = (event.currentTarget as HTMLInputElement).checked
                        const next = new Set(selected)
                        for (const row of pageRows) {
                          if (checked) next.add(row.key)
                          else next.delete(row.key)
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
                        className="rf-data-table-sort rf-focus-ring"
                        mix={[
                          on("click", () => {
                            const next = nextSort(sort, column.key)
                            if (props.sort === undefined) localSort = next
                            if (props.page === undefined) localPage = 1
                            handle.update()
                            props.onSortChange?.(next)
                            props.onPageChange?.(1)
                          }),
                        ]}
                      >
                        <span>{column.header}</span>
                        <span className="rf-data-table-sort-indicator" aria-hidden="true">
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
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={props.columns.length + (props.selectable ? 1 : 0)} className="rf-data-table-empty">
                  {props.emptyState ?? "No rows"}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr key={row.key} data-selected={selected.has(row.key) ? "true" : "false"}>
                  {props.selectable ? (
                    <td className="rf-data-table-select-col">
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

        <footer className="rf-data-table-footer">
          <span className="rf-data-table-pagination-status">
            Page {page} of {totalPages}
          </span>
          <div className="rf-data-table-pagination-actions">
            <button
              type="button"
              className="rf-button"
              data-variant="outline"
              disabled={page <= 1}
              mix={[on("click", () => setPage(props, Math.max(1, page - 1)))]}
            >
              Previous
            </button>
            <button
              type="button"
              className="rf-button"
              data-variant="outline"
              disabled={page >= totalPages}
              mix={[on("click", () => setPage(props, Math.min(totalPages, page + 1)))]}
            >
              Next
            </button>
          </div>
        </footer>
      </section>
    )
  }
}
