// @ts-nocheck
import { createRoot, on } from "remix/component"
// Consumer example from component docs migration
import { DataTable } from "@lukasmurdock/remix-ui-components"

const pageSize = 6
const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "status", header: "Status", sortable: true },
  { key: "duration", header: "Duration", align: "right", sortable: true },
]

const sourceRows = [
  { id: 1, name: "Release 1.0", status: "success", duration: 18 },
  { id: 2, name: "Release 1.1", status: "failed", duration: 52 },
  { id: 3, name: "Release 1.2", status: "running", duration: 9 },
  { id: 4, name: "Release 1.3", status: "success", duration: 21 },
  { id: 5, name: "Release 1.4", status: "queued", duration: 0 },
  { id: 6, name: "Release 1.5", status: "failed", duration: 43 },
  { id: 7, name: "Release 2.0", status: "running", duration: 13 },
  { id: 8, name: "Release 2.1", status: "success", duration: 27 },
  { id: 9, name: "Release 2.2", status: "queued", duration: 0 },
  { id: 10, name: "Release 2.3", status: "success", duration: 17 },
  { id: 11, name: "Release 2.4", status: "failed", duration: 61 },
  { id: 12, name: "Release 2.5", status: "running", duration: 8 },
  { id: 13, name: "Release 3.0", status: "success", duration: 29 },
  { id: 14, name: "Release 3.1", status: "queued", duration: 0 },
  { id: 15, name: "Release 3.2", status: "failed", duration: 48 },
]

function compareBySort(a, b, sort) {
  if (!sort) return 0
  const direction = sort.direction === "asc" ? 1 : -1
  const aValue = a[sort.columnKey]
  const bValue = b[sort.columnKey]
  if (aValue === bValue) return 0
  return aValue > bValue ? direction : -direction
}

function toDataTableRows(items) {
  return items.map((item) => ({
    key: String(item.id),
    sortValues: { name: item.name, status: item.status, duration: item.duration },
    cells: {
      name: item.name,
      status: item.status,
      duration: `${item.duration}m`,
    },
  }))
}

function loadServerRows({ page, sort, query, status, requestId }) {
  return new Promise((resolve) => {
    const latency = 260 + Math.floor(Math.random() * 220)

    setTimeout(() => {
      let filtered = sourceRows.filter((row) => {
        if (status !== "all" && row.status !== status) return false
        if (query.trim() !== "" && !row.name.toLowerCase().includes(query.trim().toLowerCase())) return false
        return true
      })

      filtered = [...filtered].sort((a, b) => compareBySort(a, b, sort))

      const totalRows = filtered.length
      const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
      const safePage = Math.min(Math.max(1, page), totalPages)
      const start = (safePage - 1) * pageSize
      const pageItems = filtered.slice(start, start + pageSize)

      resolve({
        requestId,
        rows: toDataTableRows(pageItems),
        totalRows,
        safePage,
      })
    }, latency)
  })
}

type RemoteDemoProps = {
  rows: unknown[]
  totalRows: number
  page: number
  query: string
  status: string
  sort: unknown
  loading: boolean
  selectedKeys: string[]
  errorState?: string
  onPageChange: (page: number) => void
  onSortChange: (sort: unknown) => void
  onQueryChange: (query: string) => void
  onStatusChange: (status: string) => void
  onSelectionChange: (keys: string[]) => void
}

export function ReleasesTable(_handle) {
  return (props: RemoteDemoProps) => (
    <section style="display:grid;gap:.75rem;">
      <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;">
        <input
          type="search"
          className="docs-input"
          value={props.query}
          placeholder="Search releases"
          style="min-width:13rem;"
          mix={[on("input", (event) => props.onQueryChange((event.currentTarget as HTMLInputElement).value))]}
        />
        <select
          className="docs-input"
          value={props.status}
          mix={[on("change", (event) => props.onStatusChange((event.currentTarget as HTMLSelectElement).value))]}
        >
          <option value="all">All statuses</option>
          <option value="success">Success</option>
          <option value="running">Running</option>
          <option value="queued">Queued</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={props.rows}
        dataMode="server"
        totalRows={props.totalRows}
        page={props.page}
        pageSize={pageSize}
        sort={props.sort}
        loading={props.loading}
        errorState={props.errorState}
        selectable
        selectedKeys={props.selectedKeys}
        onSelectionChange={props.onSelectionChange}
        onPageChange={props.onPageChange}
        onSortChange={props.onSortChange}
        caption="Remote releases (server-mode DataTable)"
      />
    </section>
  )
}

export function mount(mountEl: HTMLElement) {
  const root = createRoot(mountEl)

  let renderQueued = false
  let requestSeq = 0
  let rows = []
  let totalRows = 0
  let page = 1
  let query = ""
  let status = "all"
  let sort = undefined
  let loading = true
  let errorState = undefined
  let selectedKeys: string[] = []

  const render = () => {
    root.render(
      <ReleasesTable
        rows={rows}
        totalRows={totalRows}
        page={page}
        query={query}
        status={status}
        sort={sort}
        loading={loading}
        errorState={errorState}
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          selectedKeys = keys
          queueRender()
        }}
        onPageChange={(nextPage) => {
          if (page === nextPage) return
          page = nextPage
          fetchRows()
        }}
        onSortChange={(nextSort) => {
          sort = nextSort
          page = 1
          fetchRows()
        }}
        onQueryChange={(nextQuery) => {
          query = nextQuery
          page = 1
          fetchRows()
        }}
        onStatusChange={(nextStatus) => {
          status = nextStatus
          page = 1
          fetchRows()
        }}
      />,
    )
  }

  const queueRender = () => {
    if (renderQueued) return
    renderQueued = true
    queueMicrotask(() => {
      renderQueued = false
      render()
    })
  }

  const fetchRows = () => {
    const requestId = ++requestSeq
    loading = true
    errorState = undefined
    queueRender()

    loadServerRows({ page, sort, query, status, requestId })
      .then((response) => {
        if (response.requestId !== requestSeq) return
        rows = response.rows
        totalRows = response.totalRows
        page = response.safePage
        loading = false
        queueRender()
      })
      .catch(() => {
        if (requestId !== requestSeq) return
        loading = false
        errorState = "Failed to load releases"
        queueRender()
      })
  }

  fetchRows()
}
