import { on, type Handle } from "remix/component"
import {
  createTableDataController,
  nextTableSort,
  normalizeTableSelectionMode,
  sortTableRows,
  toggleTableSelectionKey,
  type TableDataController,
  type TableDataControllerOptions,
} from "@lukasmurdock/remix-ui-core"
import type { ComponentChildren } from "../types"

export type DataTableSort = {
  columnKey: string
  direction: "asc" | "desc"
}

export type DataTableSurface = "card" | "flat" | "none"

export type DataTableDensity = "compact" | "default" | "comfortable"

export type DataTableSelectionMode = "none" | "single" | "multiple"

export type DataTableColumn = {
  key: string
  header: ComponentChildren
  align?: "left" | "center" | "right"
  sortable?: boolean
  width?: string | number
  minWidth?: string | number
  headerClassName?: string
  cellClassName?: string
}

export type DataTableRow = {
  key: string
  cells: Record<string, ComponentChildren>
  sortValues?: Record<string, string | number>
}

export type DataTableDataMode = "client" | "server"

export type DataTableDataSourceQuery = {
  page: number
  pageSize: number
  sort?: DataTableSort
  filterText?: string
  filterColumnKeys: string[]
}

export type DataTableDataSourceResult = {
  rows: DataTableRow[]
  totalRows: number
}

export type DataTableDataSource = {
  fetch: (query: DataTableDataSourceQuery, context: { signal: AbortSignal }) => Promise<DataTableDataSourceResult>
}

export type DataTableRowClickContext = {
  key: string
  row: DataTableRow
  event: MouseEvent
}

export type DataTableRowEnterContext = {
  key: string
  row: DataTableRow
  event: MouseEvent
}

export type DataTableRowKeyActivateContext = {
  key: string
  row: DataTableRow
  event: KeyboardEvent
}

export type DataTableRowActionContext = {
  key: string
  row: DataTableRow
  event: MouseEvent | KeyboardEvent
}

export type DataTableSortIndicatorContext = {
  column: DataTableColumn
  sort: DataTableSort | undefined
  isSorted: boolean
  direction: "asc" | "desc" | undefined
}

export type DataTableProps = {
  columns: DataTableColumn[]
  /** Controlled server rows when `dataSource` is omitted */
  rows: DataTableRow[]
  /** @default "client" */
  dataMode?: DataTableDataMode
  dataSource?: DataTableDataSource
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
  /** @default "card" */
  surface?: DataTableSurface
  /** @default "default" */
  density?: DataTableDensity
  /** @default "none" (`selectable` aliases to `"multiple"`) */
  selectionMode?: DataTableSelectionMode
  /** @default false */
  selectable?: boolean
  /** @default true when selectionMode is "single", otherwise false */
  selectOnRowClick?: boolean
  /** @default [] */
  selectedKeys?: string[]
  /** @default [] */
  defaultSelectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  onRowClick?: (context: DataTableRowClickContext) => void
  onRowEnter?: (context: DataTableRowEnterContext) => void
  onRowKeyActivate?: (context: DataTableRowKeyActivateContext) => void
  onRowAction?: (context: DataTableRowActionContext) => void
  sort?: DataTableSort
  defaultSort?: DataTableSort
  onSortChange?: (sort: DataTableSort | undefined) => void
  renderSortIndicator?: (context: DataTableSortIndicatorContext) => ComponentChildren
  /** @default 1 */
  page?: number
  /** @default 1 */
  defaultPage?: number
  onPageChange?: (page: number) => void
  /** @default 10 */
  pageSize?: number
}

export type DataTableRowFilter = (row: DataTableRow) => boolean

const rowInteractionIgnoreSelector = [
  "a",
  "button",
  "input",
  "label",
  "select",
  "textarea",
  "[contenteditable=true]",
  "[data-row-interaction-ignore=true]",
  "[role=button]",
  "[role=link]",
  "[role=checkbox]",
  "[role=menuitem]",
  "[role=switch]",
].join(",")

export function resolveDataTableSurface(surface?: DataTableSurface): DataTableSurface {
  return surface ?? "card"
}

export function resolveDataTableDensity(density?: DataTableDensity): DataTableDensity {
  return density ?? "default"
}

export function resolveDataTableSelectionMode(
  selectionMode?: DataTableSelectionMode,
  selectable?: boolean,
): DataTableSelectionMode {
  if (selectionMode !== undefined) {
    return normalizeTableSelectionMode(selectionMode)
  }

  return selectable ? "multiple" : "none"
}

export function resolveDataTableLength(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined
  if (typeof value === "number") return `${value}px`
  return value
}

export function resolveDataTableColumnStyle(column: Pick<DataTableColumn, "width" | "minWidth">): string | undefined {
  const width = resolveDataTableLength(column.width)
  const minWidth = resolveDataTableLength(column.minWidth)
  if (!width && !minWidth) return undefined

  const declarations: string[] = []
  if (width) declarations.push(`width: ${width};`)
  if (minWidth) declarations.push(`min-width: ${minWidth};`)
  return declarations.join(" ")
}

export function resolveDataTableFilterText(filterText: string | undefined): string | undefined {
  const normalized = filterText?.trim() ?? ""
  return normalized === "" ? undefined : normalized
}

export function isDataTableActivationKey(key: string): boolean {
  return key === "Enter" || key === " "
}

export function shouldIgnoreDataTableRowEvent(event: Event): boolean {
  const target = event.target
  if (!(target instanceof Element)) return false
  if (target === event.currentTarget) return false
  return target.closest(rowInteractionIgnoreSelector) !== null
}

export function isSameDataTableSort(left: DataTableSort | undefined, right: DataTableSort | undefined): boolean {
  if (left === right) return true
  if (!left || !right) return false
  return left.columnKey === right.columnKey && left.direction === right.direction
}

export function isSameDataTableDataSourceQuery(
  left: DataTableDataSourceQuery,
  right: DataTableDataSourceQuery,
): boolean {
  if (left.page !== right.page) return false
  if (left.pageSize !== right.pageSize) return false
  if (!isSameDataTableSort(left.sort, right.sort)) return false
  if ((left.filterText ?? "") !== (right.filterText ?? "")) return false
  if (!isSameDataTableOrderedTextList(left.filterColumnKeys, right.filterColumnKeys)) return false

  return true
}

export function isSameDataTableOrderedTextList(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return false
  }
  return true
}

export function isSameDataTableFilterSignature(
  left: DataTableFilterSignature | undefined,
  right: DataTableFilterSignature | undefined,
): boolean {
  if (!left && !right) return true
  if (!left || !right) return false
  if ((left.filterText ?? "") !== (right.filterText ?? "")) return false
  return isSameDataTableOrderedTextList(left.filterColumnKeys, right.filterColumnKeys)
}

export function coerceDataTableFilterSignature(value: unknown): DataTableFilterSignature | undefined {
  if (!value || typeof value !== "object") return undefined

  const candidate = value as {
    filterText?: unknown
    filterColumnKeys?: unknown
  }

  if (!Array.isArray(candidate.filterColumnKeys)) return undefined
  const filterColumnKeys = candidate.filterColumnKeys.filter((entry): entry is string => typeof entry === "string")
  if (filterColumnKeys.length !== candidate.filterColumnKeys.length) return undefined

  const filter: DataTableFilterSignature = { filterColumnKeys }
  if (typeof candidate.filterText === "string") filter.filterText = candidate.filterText
  return filter
}

export function renderDefaultDataTableSortIndicator(
  context: Pick<DataTableSortIndicatorContext, "isSorted" | "direction">,
) {
  if (!context.isSorted) return "↕"
  return context.direction === "asc" ? "↑" : "↓"
}

type DataTableFilterSignature = {
  filterText?: string
  filterColumnKeys: string[]
}

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

export function resolveDataTableSortValue(row: DataTableRow, columnKey: string): string | number {
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
}

export function sortDataTableRows(rows: DataTableRow[], sort: DataTableSort | undefined): DataTableRow[] {
  return sortTableRows(rows, sort, (row, columnKey) => resolveDataTableSortValue(row, columnKey))
}

export function DataTable(handle: Handle) {
  let localSort: DataTableSort | undefined
  let localSelected = new Set<string>()
  let localPage: number | undefined
  let dataController: TableDataController<DataTableDataSourceQuery, DataTableDataSourceResult> | undefined
  let releaseDataController: (() => void) | undefined
  let activeDataSource: DataTableDataSource | undefined
  let previousDataSourceFetch: DataTableDataSource["fetch"] | undefined
  let pageControlMode: "controlled" | "uncontrolled" | undefined
  let controllerSyncQueued = false
  let pendingController: TableDataController<DataTableDataSourceQuery, DataTableDataSourceResult> | undefined
  let pendingQuery: DataTableDataSourceQuery | undefined
  let pendingReload = false

  handle.signal.addEventListener("abort", () => {
    releaseDataController?.()
    releaseDataController = undefined
    dataController?.dispose()
    dataController = undefined
    pendingController = undefined
    pendingQuery = undefined
    pendingReload = false
    controllerSyncQueued = false
  })

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

  function clearDataController(): void {
    releaseDataController?.()
    releaseDataController = undefined
    dataController?.dispose()
    dataController = undefined
    previousDataSourceFetch = undefined
    pageControlMode = undefined
    pendingController = undefined
    pendingQuery = undefined
    pendingReload = false
    controllerSyncQueued = false
  }

  function queueControllerSync(): void {
    if (controllerSyncQueued) return
    controllerSyncQueued = true

    handle.queueTask(() => {
      controllerSyncQueued = false
      if (handle.signal.aborted) return

      const controller = pendingController
      const nextQuery = pendingQuery
      const shouldReload = pendingReload

      pendingController = undefined
      pendingQuery = undefined
      pendingReload = false

      if (!controller) return

      if (nextQuery) {
        const current = controller.getSnapshot().query
        if (!isSameDataTableDataSourceQuery(current, nextQuery)) {
          controller.setQuery(nextQuery)
          return
        }
      }

      if (shouldReload) {
        controller.reload()
      }
    })
  }

  function scheduleDataControllerSync(
    controller: TableDataController<DataTableDataSourceQuery, DataTableDataSourceResult>,
    nextQuery: DataTableDataSourceQuery,
    options: { shouldSetQuery: boolean; shouldReload: boolean },
  ): void {
    pendingController = controller
    pendingQuery = options.shouldSetQuery ? nextQuery : undefined
    pendingReload = options.shouldSetQuery ? false : options.shouldReload
    queueControllerSync()
  }

  function getDataController(
    props: DataTableProps,
    query: DataTableDataSourceQuery,
  ): {
    controller: TableDataController<DataTableDataSourceQuery, DataTableDataSourceResult>
    sourceChanged: boolean
  } {
    activeDataSource = props.dataSource
    const nextPageControlMode = props.page === undefined ? "uncontrolled" : "controlled"
    const shouldRecreate = !dataController || pageControlMode !== nextPageControlMode

    if (shouldRecreate) {
      const previousResult = dataController?.getSnapshot().result
      clearDataController()
      pageControlMode = nextPageControlMode

      const controllerOptions: TableDataControllerOptions<DataTableDataSourceQuery, DataTableDataSourceResult> = {
        initialQuery: query,
        load: ({ query: nextQuery, signal }: { query: DataTableDataSourceQuery; signal: AbortSignal }) => {
          if (!activeDataSource) {
            return Promise.resolve({ rows: [], totalRows: 0 })
          }
          return activeDataSource.fetch(nextQuery, { signal })
        },
        getPage: (nextQuery: DataTableDataSourceQuery) => nextQuery.page,
        setPage: (nextQuery: DataTableDataSourceQuery, page: number) => ({ ...nextQuery, page }),
        getSort: (nextQuery: DataTableDataSourceQuery) => nextQuery.sort,
        getFilter: (nextQuery: DataTableDataSourceQuery): DataTableFilterSignature => {
          const filter: DataTableFilterSignature = {
            filterColumnKeys: nextQuery.filterColumnKeys,
          }
          if (nextQuery.filterText !== undefined) filter.filterText = nextQuery.filterText
          return filter
        },
        isFilterEqual: (left: unknown, right: unknown): boolean =>
          isSameDataTableFilterSignature(coerceDataTableFilterSignature(left), coerceDataTableFilterSignature(right)),
        resetPageOnSortChange: props.page === undefined,
        resetPageOnFilterChange: props.page === undefined,
      }

      if (previousResult !== undefined) {
        controllerOptions.initialResult = previousResult
      }

      dataController = createTableDataController<DataTableDataSourceQuery, DataTableDataSourceResult>(controllerOptions)

      releaseDataController = dataController.subscribe(() => {
        handle.update()
      })
    }

    const sourceChanged = !shouldRecreate && previousDataSourceFetch !== props.dataSource?.fetch

    previousDataSourceFetch = props.dataSource?.fetch

    if (!dataController) {
      throw new Error("Data table data controller not available")
    }

    return {
      controller: dataController,
      sourceChanged,
    }
  }

  function createDataSourceQuery(
    props: DataTableProps,
    pageSize: number,
    sort: DataTableSort | undefined,
  ): DataTableDataSourceQuery {
    const filterColumnKeys = props.filterColumnKeys ?? props.columns.map((column) => column.key)
    const query: DataTableDataSourceQuery = {
      page: props.page ?? localPage ?? props.defaultPage ?? 1,
      pageSize,
      filterColumnKeys,
    }

    const filterText = resolveDataTableFilterText(props.filterText)
    if (filterText !== undefined) query.filterText = filterText
    if (sort !== undefined) query.sort = sort

    return query
  }

  function applyRowSelection(
    props: DataTableProps,
    selected: Set<string>,
    selectionMode: DataTableSelectionMode,
    rowKey: string,
  ): void {
    const next = toggleTableSelectionKey(selected, rowKey, selectionMode)
    setSelected(props, next)
  }

  function getDataTableWrapAttributes(
    props: DataTableProps,
    selectionMode: DataTableSelectionMode,
  ): Record<string, string> {
    return {
      "data-surface": resolveDataTableSurface(props.surface),
      "data-density": resolveDataTableDensity(props.density),
      "data-selection-mode": selectionMode,
    }
  }

  return (props: DataTableProps) => {
    const dataMode = props.dataSource ? "server" : resolveDataTableDataMode(props.dataMode)
    const isServer = dataMode === "server"
    const sort = props.sort ?? localSort ?? props.defaultSort
    const selectionMode = resolveDataTableSelectionMode(props.selectionMode, props.selectable)
    const selectOnRowClick = props.selectOnRowClick ?? selectionMode === "single"
    const showSelectionColumn = selectionMode === "multiple" || (selectionMode === "single" && !selectOnRowClick)
    const showSelectAll = selectionMode === "multiple"
    const wrapAttributes = getDataTableWrapAttributes(props, selectionMode)
    const tableFilter = resolveDataTableFilter(props)

    const pageSize = resolveDataTablePageSize(props.pageSize)
    let sourceRows = props.rows
    let sourceTotalRows = props.totalRows
    let sourceLoading = props.loading ?? false
    let sourceErrorState = props.errorState
    let currentQuery: DataTableDataSourceQuery | undefined

    if (props.dataSource) {
      const nextQuery = createDataSourceQuery(props, pageSize, sort)
      const { controller, sourceChanged } = getDataController(props, nextQuery)
      const snapshot = controller.getSnapshot()
      const shouldSetQuery = !isSameDataTableDataSourceQuery(snapshot.query, nextQuery)
      if (shouldSetQuery || sourceChanged) {
        scheduleDataControllerSync(controller, nextQuery, {
          shouldSetQuery,
          shouldReload: sourceChanged,
        })
      }

      const nextSnapshot = controller.getSnapshot()
      currentQuery = nextSnapshot.query
      if (props.page === undefined) {
        localPage = nextSnapshot.query.page
      }
      sourceRows = nextSnapshot.result?.rows ?? []
      sourceTotalRows = nextSnapshot.result?.totalRows
      sourceLoading = props.loading ?? nextSnapshot.isLoading
      sourceErrorState = props.errorState ?? (nextSnapshot.status === "error" ? "Failed to load rows" : undefined)
    } else {
      clearDataController()
    }

    const filteredRows = isServer ? sourceRows : filterDataTableRows(sourceRows, tableFilter)
    const sortedRows = isServer ? filteredRows : sortDataTableRows(filteredRows, sort)

    const totalRows = resolveDataTableRowCount(dataMode, sortedRows, sourceTotalRows)
    const totalPages = resolveDataTableTotalPages(totalRows, pageSize)
    const requestedPage = props.dataSource ? currentQuery?.page : (props.page ?? localPage ?? props.defaultPage)
    const page = clampDataTablePage(requestedPage, totalPages)
    const pageRows = isServer ? sortedRows : paginateDataTableRows(sortedRows, page, pageSize)
    const columnStyleByKey = new Map(props.columns.map((column) => [column.key, resolveDataTableColumnStyle(column)]))
    const rowsAllowClick = selectOnRowClick || props.onRowClick !== undefined || props.onRowAction !== undefined
    const rowsAllowKeyboard =
      selectOnRowClick || props.onRowKeyActivate !== undefined || props.onRowAction !== undefined
    const rowsAllowHover = props.onRowEnter !== undefined

    const selected = getSelected(props)
    const allPageRowsSelected = pageRows.length > 0 && pageRows.every((row) => selected.has(row.key))

    if (sourceLoading) {
      return (
        <section className="rf-data-table-loading" data-part="loading" {...wrapAttributes}>
          Loading…
        </section>
      )
    }

    if (sourceErrorState) {
      return (
        <section className="rf-data-table-error" data-part="error" {...wrapAttributes}>
          {sourceErrorState}
        </section>
      )
    }

    return (
      <section
        className="rf-data-table-wrap"
        data-part="wrapper"
        role="region"
        aria-label="Data table"
        {...wrapAttributes}
      >
        <table className="rf-data-table" data-part="table">
          {props.caption ? <caption>{props.caption}</caption> : null}
          <thead data-part="header">
            <tr data-part="header-row">
              {showSelectionColumn ? (
                <th scope="col" className="rf-data-table-select-col" data-part="selection-cell">
                  {showSelectAll ? (
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
                  ) : null}
                </th>
              ) : null}

              {props.columns.map((column) => {
                const isSorted = sort?.columnKey === column.key
                const ariaSort = isSorted ? (sort?.direction === "asc" ? "ascending" : "descending") : "none"
                const columnStyle = columnStyleByKey.get(column.key)

                return (
                  <th
                    key={column.key}
                    scope="col"
                    data-part="header-cell"
                    data-align={column.align ?? "left"}
                    aria-sort={ariaSort}
                    className={column.headerClassName}
                    style={columnStyle}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="rf-data-table-sort rf-focus-ring"
                        data-part="sort-button"
                        mix={[
                          on("click", () => {
                            const next = nextTableSort(sort, column.key)
                            if (props.sort === undefined) localSort = next
                            if (props.page === undefined) localPage = 1
                            handle.update()
                            props.onSortChange?.(next)
                            props.onPageChange?.(1)
                          }),
                        ]}
                      >
                        <span>{column.header}</span>
                        <span className="rf-data-table-sort-indicator" data-part="sort-indicator" aria-hidden="true">
                          {props.renderSortIndicator?.({
                            column,
                            sort,
                            isSorted,
                            direction: isSorted ? sort?.direction : undefined,
                          }) ??
                            renderDefaultDataTableSortIndicator({
                              isSorted,
                              direction: isSorted ? sort?.direction : undefined,
                            })}
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

          <tbody data-part="body">
            {pageRows.length === 0 ? (
              <tr data-part="row">
                <td
                  colSpan={props.columns.length + (showSelectionColumn ? 1 : 0)}
                  className="rf-data-table-empty"
                  data-part="empty-cell"
                >
                  {props.emptyState ?? "No rows"}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const isRowSelected = selected.has(row.key)
                const rowInteractionEnabled = rowsAllowClick || rowsAllowKeyboard
                const rowMix: any[] = []

                if (rowsAllowHover) {
                  rowMix.push(
                    on("mouseenter" as any, (event) => {
                      props.onRowEnter?.({
                        key: row.key,
                        row,
                        event: event as unknown as MouseEvent,
                      })
                    }),
                  )
                }

                if (rowsAllowClick) {
                  rowMix.push(
                    on("click" as any, (event) => {
                      if (shouldIgnoreDataTableRowEvent(event as unknown as Event)) return

                      const clickEvent = event as unknown as MouseEvent
                      props.onRowClick?.({ key: row.key, row, event: clickEvent })
                      props.onRowAction?.({ key: row.key, row, event: clickEvent })

                      if (selectOnRowClick && selectionMode !== "none") {
                        applyRowSelection(props, selected, selectionMode, row.key)
                      }
                    }),
                  )
                }

                if (rowsAllowKeyboard) {
                  rowMix.push(
                    on("keydown" as any, (event) => {
                      if (shouldIgnoreDataTableRowEvent(event as unknown as Event)) return
                      if (!isDataTableActivationKey((event as unknown as KeyboardEvent).key)) return

                      const keyEvent = event as unknown as KeyboardEvent
                      keyEvent.preventDefault()

                      props.onRowKeyActivate?.({ key: row.key, row, event: keyEvent })
                      props.onRowAction?.({ key: row.key, row, event: keyEvent })

                      if (selectOnRowClick && selectionMode !== "none") {
                        applyRowSelection(props, selected, selectionMode, row.key)
                      }
                    }),
                  )
                }

                return (
                  <tr
                    key={row.key}
                    data-part="row"
                    data-selected={isRowSelected ? "true" : "false"}
                    data-interactive={rowInteractionEnabled ? "true" : undefined}
                    tabIndex={rowsAllowKeyboard ? 0 : undefined}
                    mix={rowMix}
                  >
                    {showSelectionColumn ? (
                      <td className="rf-data-table-select-col" data-part="selection-cell">
                        <input
                          type="checkbox"
                          aria-label={`Select row ${row.key}`}
                          checked={isRowSelected}
                          mix={[
                            on("change", (event) => {
                              const checked = (event.currentTarget as HTMLInputElement).checked
                              const next = new Set(selected)
                              if (selectionMode === "single") {
                                if (checked) {
                                  next.clear()
                                  next.add(row.key)
                                } else {
                                  next.clear()
                                }
                              } else {
                                if (checked) next.add(row.key)
                                else next.delete(row.key)
                              }
                              setSelected(props, next)
                            }),
                          ]}
                        />
                      </td>
                    ) : null}

                    {props.columns.map((column) => {
                      const columnStyle = columnStyleByKey.get(column.key)
                      return (
                        <td
                          key={`${row.key}-${column.key}`}
                          data-part="cell"
                          data-align={column.align ?? "left"}
                          className={column.cellClassName}
                          style={columnStyle}
                        >
                          {row.cells[column.key] ?? null}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        <footer className="rf-data-table-footer" data-part="footer">
          <span className="rf-data-table-pagination-status" data-part="pagination-status">
            Page {page} of {totalPages}
          </span>
          <div className="rf-data-table-pagination-actions" data-part="pagination-actions">
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
