export type TableSortDirection = "asc" | "desc"

export type TableSort = {
  columnKey: string
  direction: TableSortDirection
}

export function nextTableSort(current: TableSort | undefined, columnKey: string): TableSort | undefined {
  if (!current || current.columnKey !== columnKey) {
    return { columnKey, direction: "asc" }
  }

  if (current.direction === "asc") {
    return { columnKey, direction: "desc" }
  }

  return undefined
}

export function sortTableRows<Row>(
  rows: readonly Row[],
  sort: TableSort | undefined,
  getValue: (row: Row, columnKey: string) => unknown,
): Row[] {
  if (!sort) {
    return [...rows]
  }

  const directionMultiplier = sort.direction === "asc" ? 1 : -1

  return rows
    .map((row, index) => ({ row, index, value: getValue(row, sort.columnKey) }))
    .sort((left, right) => {
      const comparison = compareTableValues(left.value, right.value) * directionMultiplier
      if (comparison !== 0) {
        return comparison
      }

      return left.index - right.index
    })
    .map((entry) => entry.row)
}

export type TableSelectionMode = "none" | "single" | "multiple"

export function normalizeTableSelectionMode(mode: string | null | undefined): TableSelectionMode {
  if (mode === "single" || mode === "multiple") {
    return mode
  }

  return "none"
}

export function toggleTableSelectionKey(
  currentSelection: ReadonlySet<string> | undefined,
  key: string,
  mode: TableSelectionMode,
): Set<string> {
  const normalizedMode = normalizeTableSelectionMode(mode)

  if (normalizedMode === "none") {
    return new Set<string>()
  }

  if (normalizedMode === "single") {
    if (currentSelection?.has(key) && currentSelection.size === 1) {
      return new Set<string>()
    }

    return new Set<string>([key])
  }

  const nextSelection = new Set(currentSelection ?? [])
  if (nextSelection.has(key)) {
    nextSelection.delete(key)
  } else {
    nextSelection.add(key)
  }

  return nextSelection
}

export function setSingleTableSelection(key: string | null | undefined): Set<string> {
  if (!key) {
    return new Set<string>()
  }

  return new Set<string>([key])
}

export function setMultipleTableSelection(keys: Iterable<string>): Set<string> {
  return new Set(keys)
}

export type TableDataLoadReason = "initial" | "query" | "reload"

export type TableDataQueryUpdater<Query> = Query | ((current: Query) => Query)

export type TableDataLoadContext<Query> = {
  query: Query
  reason: TableDataLoadReason
  signal: AbortSignal
  requestId: number
}

export type TableDataLoader<Query, Result> = (context: TableDataLoadContext<Query>) => Promise<Result>

export type TableDataState<Query, Result> = {
  query: Query
  result: Result | undefined
  error: unknown
  status: "idle" | "loading" | "success" | "error"
  isLoading: boolean
  requestId: number
  lastReason: TableDataLoadReason | undefined
}

export type TableDataController<Query, Result> = {
  getSnapshot: () => TableDataState<Query, Result>
  subscribe: (listener: () => void) => () => void
  setQuery: (updater: TableDataQueryUpdater<Query>) => void
  reload: () => void
  cancel: () => void
  dispose: () => void
}

export type TableDataControllerOptions<Query, Result, Filter = unknown> = {
  initialQuery: Query
  initialResult?: Result
  autoLoad?: boolean
  load: TableDataLoader<Query, Result>
  getPage?: (query: Query) => number | undefined
  setPage?: (query: Query, page: number) => Query
  getSort?: (query: Query) => TableSort | undefined
  getFilter?: (query: Query) => Filter
  isFilterEqual?: (left: Filter | undefined, right: Filter | undefined) => boolean
  resetPageOnSortChange?: boolean
  resetPageOnFilterChange?: boolean
  resetPageTo?: number
}

export function createTableDataController<Query, Result, Filter = unknown>(
  options: TableDataControllerOptions<Query, Result, Filter>,
): TableDataController<Query, Result> {
  const listeners = new Set<() => void>()
  const getFilterEqual = options.isFilterEqual ?? Object.is
  const resetPageTo = options.resetPageTo ?? 1

  let disposed = false
  let currentRequestId = 0
  let activeAbortController: AbortController | undefined
  let state: TableDataState<Query, Result> = {
    query: options.initialQuery,
    result: options.initialResult,
    error: undefined,
    status: options.initialResult === undefined ? "idle" : "success",
    isLoading: false,
    requestId: 0,
    lastReason: undefined,
  }

  const notify = (): void => {
    listeners.forEach((listener) => listener())
  }

  const setState = (nextState: TableDataState<Query, Result>): void => {
    state = nextState
    notify()
  }

  const getStatusAfterCancel = (): TableDataState<Query, Result>["status"] => {
    if (state.result !== undefined) {
      return "success"
    }
    if (state.error !== undefined) {
      return "error"
    }

    return "idle"
  }

  const cancel = (): void => {
    if (!activeAbortController) {
      return
    }

    activeAbortController.abort()
    activeAbortController = undefined

    if (state.isLoading) {
      setState({
        ...state,
        status: getStatusAfterCancel(),
        isLoading: false,
      })
    }
  }

  const load = (reason: TableDataLoadReason): void => {
    if (disposed) {
      return
    }

    cancel()

    currentRequestId += 1
    const requestId = currentRequestId
    const abortController = new AbortController()
    activeAbortController = abortController

    setState({
      ...state,
      status: "loading",
      isLoading: true,
      error: undefined,
      requestId,
      lastReason: reason,
    })

    void options
      .load({
        query: state.query,
        reason,
        signal: abortController.signal,
        requestId,
      })
      .then((result) => {
        if (disposed || requestId !== currentRequestId || abortController.signal.aborted) {
          return
        }

        activeAbortController = undefined
        setState({
          ...state,
          result,
          error: undefined,
          status: "success",
          isLoading: false,
          requestId,
        })
      })
      .catch((error: unknown) => {
        if (disposed || requestId !== currentRequestId || abortController.signal.aborted) {
          return
        }

        activeAbortController = undefined
        setState({
          ...state,
          error,
          status: "error",
          isLoading: false,
          requestId,
        })
      })
  }

  const maybeResetPage = (previousQuery: Query, nextQuery: Query): Query => {
    if (!options.getPage || !options.setPage) {
      return nextQuery
    }

    let query = nextQuery
    const previousSort = options.getSort?.(previousQuery)
    const nextSort = options.getSort?.(query)
    if (options.resetPageOnSortChange && !isSameTableSort(previousSort, nextSort)) {
      query = options.setPage(query, resetPageTo)
    }

    const previousFilter = options.getFilter?.(previousQuery)
    const nextFilter = options.getFilter?.(query)
    if (options.resetPageOnFilterChange && !getFilterEqual(previousFilter, nextFilter)) {
      query = options.setPage(query, resetPageTo)
    }

    return query
  }

  const setQuery = (updater: TableDataQueryUpdater<Query>): void => {
    if (disposed) {
      return
    }

    const previousQuery = state.query
    const nextQuery = typeof updater === "function" ? (updater as (query: Query) => Query)(previousQuery) : updater
    const normalizedQuery = maybeResetPage(previousQuery, nextQuery)

    setState({
      ...state,
      query: normalizedQuery,
    })

    load("query")
  }

  const subscribe = (listener: () => void): (() => void) => {
    if (disposed) {
      return () => {}
    }

    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  const dispose = (): void => {
    if (disposed) {
      return
    }

    disposed = true
    cancel()
    listeners.clear()
  }

  if (options.autoLoad ?? true) {
    load("initial")
  }

  return {
    getSnapshot: () => state,
    subscribe,
    setQuery,
    reload: () => load("reload"),
    cancel,
    dispose,
  }
}

function compareTableValues(left: unknown, right: unknown): number {
  if (Object.is(left, right)) {
    return 0
  }

  if (left == null) {
    return 1
  }
  if (right == null) {
    return -1
  }

  if (typeof left === "number" && typeof right === "number") {
    return compareNumbers(left, right)
  }

  if (typeof left === "bigint" && typeof right === "bigint") {
    return left < right ? -1 : 1
  }

  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right)
  }

  if (left instanceof Date && right instanceof Date) {
    return compareNumbers(left.getTime(), right.getTime())
  }

  return String(left).localeCompare(String(right))
}

function compareNumbers(left: number, right: number): number {
  const leftNaN = Number.isNaN(left)
  const rightNaN = Number.isNaN(right)

  if (leftNaN && rightNaN) {
    return 0
  }
  if (leftNaN) {
    return 1
  }
  if (rightNaN) {
    return -1
  }

  return left - right
}

function isSameTableSort(left: TableSort | undefined, right: TableSort | undefined): boolean {
  if (!left && !right) {
    return true
  }

  if (!left || !right) {
    return false
  }

  return left.columnKey === right.columnKey && left.direction === right.direction
}
