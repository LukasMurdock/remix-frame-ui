// @ts-nocheck
import { createRoot, on } from "remix/component"
import { DataTable } from "@lukasmurdock/remix-ui-components"

const pageSize = 6
const columns = [
  { key: "name", header: "Name", sortable: true, minWidth: 200 },
  { key: "status", header: "Status", sortable: true },
  { key: "duration", header: "Duration", align: "right", sortable: true, width: 120 },
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

function buildFilterText(query, status) {
  const queryText = query.trim()
  if (status === "all") return queryText
  if (queryText === "") return `status:${status}`
  return `${queryText} status:${status}`
}

function parseFilterText(filterText) {
  const raw = (filterText ?? "").trim()
  if (raw === "") return { query: "", status: "all" }

  const statusMatch = raw.match(/(?:^|\s)status:([a-z]+)/i)
  const status = statusMatch?.[1]?.toLowerCase() ?? "all"
  const query = raw
    .replace(/(?:^|\s)status:[a-z]+/gi, " ")
    .trim()
    .toLowerCase()
  return { query, status }
}

const releasesDataSource = {
  fetch: async (query, { signal }) => {
    const latency = 260 + Math.floor(Math.random() * 220)
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, latency)
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timeout)
          reject(new DOMException("Aborted", "AbortError"))
        },
        { once: true },
      )
    })

    const parsedFilter = parseFilterText(query.filterText)

    let filtered = sourceRows.filter((row) => {
      if (parsedFilter.status !== "all" && row.status !== parsedFilter.status) return false
      if (parsedFilter.query !== "" && !row.name.toLowerCase().includes(parsedFilter.query)) return false
      return true
    })

    filtered = [...filtered].sort((left, right) => compareBySort(left, right, query.sort))

    const totalRows = filtered.length
    const start = (query.page - 1) * query.pageSize
    const pageItems = filtered.slice(start, start + query.pageSize)

    return {
      rows: toDataTableRows(pageItems),
      totalRows,
    }
  },
}

type RemoteDemoProps = {
  query: string
  status: string
  selectedKeys: string[]
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
        rows={[]}
        dataSource={releasesDataSource}
        pageSize={pageSize}
        filterText={buildFilterText(props.query, props.status)}
        filterColumnKeys={["name", "status"]}
        selectionMode="multiple"
        selectedKeys={props.selectedKeys}
        onSelectionChange={props.onSelectionChange}
        caption="Remote releases (dataSource DataTable)"
      />
    </section>
  )
}

export function mount(mountEl: HTMLElement) {
  const root = createRoot(mountEl)

  let renderQueued = false
  let query = ""
  let status = "all"
  let selectedKeys: string[] = []

  const render = () => {
    root.render(
      <ReleasesTable
        query={query}
        status={status}
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          selectedKeys = keys
          queueRender()
        }}
        onQueryChange={(nextQuery) => {
          query = nextQuery
          queueRender()
        }}
        onStatusChange={(nextStatus) => {
          status = nextStatus
          queueRender()
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

  render()
}
